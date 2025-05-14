# ONEPOINT Organizational Chart

Cette application est un organigramme intéractif de OnePoint à partir des données récupérées automatiquement sur Workday.  
Elle repose sur une architecture statique et scalable entièrement déployée sur AWS à l’aide de Terraform et automatisée avec des CI/CD pipelines.

## Plan d'action

1. Fonction **AWS Lambda** (script python) qui scrap les données depuis Workday :

   - Planification mensuelle de la fonction Lambda avec **Amazon EventBridge**.
   - Récupère les credentials workday depuis **AWS Secrets Manager**.
   - Intercèpte la requête pour télécharger le csv contenant les données des employés.
   - 1 csv = 1 communauté.
   - Stocke chaque csv brut dans un bucket **S3** (`raw/`) et le compare au csv précédant pour ne màj que les nouvautés (départs et arrivés).
     Potentiellement pour récupérer les photos de chacun :
   - Appeler l'**API Microsoft Graph** pour récupérer la photo utilisée dans Outlook à partir du mail du collaborateur.
   - Dans le csv il y a une référence à des objets S3 qui stockent les images des collaborateurs.

2. Génération du site statique **Next.js (SSG)** :

   - Utilisation de `getStaticProps` pour charger le csv depuis S3.
   - Utiliser ce csv pour afficher l'org chart (le front).
   - L'App Pipeline va build l'app et générer le dossier statique `out/` qu'on stocke dans un bucket **S3**.
   - Quand lancer l'App Pipeline ?
     - à chaque changement du csv contenant la data Workday à l'aide d'un **EventBridge S3** (déclenchement mensuel)
     - à chaque push sur le main du repo git, qui indique un changement dans le front de l'application

3. Distribution du frontend avec **Amazon CloudFront** à partir du site statique stocké sur S3 (utilisation de CloudFront plus pour SSL/TLS que pour le CDN) :

   - Utilisation de **Route 53** pour mapper le nom de domaine à la distribution CloudFront
   - Utilisation de CloudFront pour avoir HTTPS avec le certificat TLS, pas pour le CDN. S3 propose que HTTP.

4. Gestion d'infrastructure **Infrastructure as Code** via **Terraform** :

   Modules pour :

   - Gestion de l'état (`backend { s3 + DynamoDB lock }`).
   - Secrets Manager, IAM Roles & Policies.
   - Lambda, EventBridge, S3, CloudFront.
   - CodePipeline & CodeBuild.

5. **CI/CD** entièrement automatisé pour l'infra et l'application.

   **Infra Pipeline**

   - Trigger : Lorsqu’on push une modification dans le dossier /Terraform du repo git.
   - Actions : Il récupère la dernière configuration Terraform, la valide, puis provisionne ou met à jour toutes les ressources AWS (rôles IAM, Secrets Manager, buckets S3, distributions CloudFront, Lambda, EventBridge, etc.).
   - Pourquoi ? Pour s’assurer que l’infrastructure correspond toujours au code déclaratif stocké en Git.

   **Scraper Pipeline**

   - Trigger : Lorsqu’on push une modification dans le dossier /lambda du repo git (modif du code du scrapper).
   - Actions : Il installe d’abord les dépendances Python du scraper, exécute éventuellement les tests unitaires pour vérifier que le script produit bien un csv valide, puis regroupe le code et ses librairies en un package. Enfin, il met à jour la fonction AWS Lambda existante avec ce nouveau package.
   - Pourquoi ? Pour que toute évolution du scraper (nouveaux champs extraits, optimisation du parsing…) soit immédiatement déployée dans la fonction Lambda sans passer par les autres pipelines.

   **App Pipeline**

   - Trigger :
     - 1 - Dès qu’un nouveau fichier csv apparaît dans le préfixe raw/ du bucket S3 (grâce à un événement EventBridge).
     - 2 - Lorsqu’on push une modification dans le dossier /app du repo git (modif du front Next.js).
   - Actions : Il récupère le code de l’application Next.js, lit le dernier csv dans S3, regénère l’ensemble du site statique en y incorporant les nouvelles données, puis synchronise les fichiers produits sur le bucket “website” S3. Enfin, il purge (invalide) le cache CloudFront pour que les utilisateurs voient tout de suite la mise à jour de l’organigramme.
   - Pourquoi ? Pour automatiser la mise à jour des données présentées, sans avoir à toucher au code, dès qu’un scraping Workday a eu lieu.

## Structure du projet

```bash
├── terraform/                   # Modules et configuration Terraform
│   ├── backend.tf
│   ├── modules/
│   │   ├── lambda-scraper/
│   │   ├── s3-data/
│   │   ├── s3-website/
│   │   ├── cloudfront/
│   │   └── cicd/
│   └── env/
├── lambda/                      # AWS Lambda (script scraper py)
│   └── scraper.py
├── app/                         # Application Next.js statique
│   ├── next.config.js
│   ├── package.json
│   ├── public/
│   ├── pages/
│   ├── components/
│   └── lib/
├── buildspec-nextjs.yml         # Instructions CodeBuild pour Next.js
├── buildspec-infra.yml          # Instructions CodeBuild pour Terraform
└── README.md                    # Ce fichier
```
