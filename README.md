# ONEPOINT Organizational Chart

Cette application est un organigramme interactif de OnePoint à partir des données récupérées automatiquement sur Workday.
Elle repose sur une architecture conteneurisée et scalable entièrement déployée sur AWS à l’aide de Terraform et automatisée avec des CI/CD pipelines.

---

## Plan d'action

### 1. Fonction **AWS Lambda** (script Python) pour scraper Workday

- Planification mensuelle de la fonction **Lambda** avec **Amazon EventBridge**.
- Récupère les credentials workday depuis **AWS Secrets Manager**.
- Intercèpte la requête pour télécharger le csv contenant les données des employés.
- 1 csv = 1 lieu (paris.csv, lyon.csv ...)
- Stocke chaque csv brut dans un bucket **S3** (`raw/`) et le compare au csv précédant pour ne màj que les nouvautés (départs et arrivés).
- Génère un JSON contenant toutes les info sur les collaborateurs (possible utilisation d'AWS RDS si j'ai le temps après).

  Potentiellement pour récupérer les photos de chacun :

  - Interroger l'**API Microsoft Graph** pour récupérer la photo utilisée dans Outlook à partir du mail du collaborateur.
  - Dans le csv il y a une référence à des objets S3 qui stockent les images des collaborateurs.
  - On interroge l'API que la première fois, par la suite on va voirImplémenter un cache pour ne pas interroger l'API à chaque run Lambda.

---

### 2. Génération du site statique **Next.js (SSG)**

- Utilisation de `getStaticProps` pour charger le csv depuis S3.
- Utiliser ce csv pour afficher l'org chart (le front).
- L’App Pipeline va build le site, le package dans une **image Docker (NGINX)** et le conteneur associé est publié sur **Amazon ECR**.
- La dernière image est déployée automatiquement sur une instance **EC2** dédiée.

  Quand est-ce que l'App Pipeline se trigger ?

  - Nouveau fichier CSV dans S3 (`raw/`) (déclenchement mensuel par EventBridge).
  - Push dans `/app/` qui indique un changement du front de l'appli.

---

### 3. Distribution du site avec **EC2 + Docker + ALB + ASG**

- Le site est servi par **NGINX dans un conteneur Docker** tournant sur EC2.
- Un **Application Load Balancer (ALB)** en amont :
  - Fournit un point d’entrée HTTPS grâce à un certificat **ACM**.
  - Redirige le trafic vers un **Target Group** contenant l’instance EC2.
- Un **Auto Scaling Group (ASG)** associé à l'ALB pour éviter un single point of failure sur l'EC2.
- Le domaine custom est mappé via **Route 53** vers le ALB.
- Le conteneur expose le port 80, redirigé automatiquement via l’ALB.
- Possibilité d’ajouter des instances à l’avenir (scalabilité horizontale).

---

### 4. Gestion d'infrastructure **Infrastructure as Code** via **Terraform** :

Des modules sont utilisés pour gérer :

- **État Terraform** : Backend avec S3 + DynamoDB pour le verrouillage.
- **IAM & Roles** : EC2, Lambda, CodePipeline...
- **Réseau** : VPC, Subnets publics, Security Groups.
- **ALB** : Load balancer, Target Group, Listener HTTPS.
- **ACM** : Certificat TLS pour domaine personnalisé.
- **EC2** : Déploiement et configuration de la VM avec **Ansible** pour installer Docker et lancer le conteneur.
- **ECR** : Stockage de l’image Docker de l’application.
- **CodePipeline / CodeBuild** : Déploiement continu.

---

### 5. **CI/CD** entièrement automatisé pour l'infra et l'application.

#### 🛠 Infra Pipeline

- **Trigger** : Push dans `/terraform/`.
- **Actions** :

  - Récupère la dernière configuration Terraform
  - Provisionne ou met à jour toutes les ressources AWS : EC2, ALB, IAM, Secrets, Lambda, S3, etc.

#### 🐍 Scraper Pipeline

- **Trigger** : Push dans `/lambda/`.
- **Actions** :

  - Installe les dépendances Python.
  - Vérifie la validité du JSON généré avec tests unitaire.
  - Regroupe le code et les libraires dans un package.
  - Mise à jour de la fonction Lambda avec ce package.

#### 🌐 App Pipeline

- **Triggers** :

  - Nouveau fichier CSV dans S3 (`raw/`) (déclenchement mensuel par EventBridge).
  - Push dans `/app/` qui indique un changement du front de l'appli.

- **Actions** :

  1. `next build && next export`
  2. Création de l’image Docker avec NGINX servant le dossier `out/`
  3. Push de l’image vers **Amazon ECR**
  4. Mise à jour avec **Ansible** de l’instance EC2 pour pull et redémarrer le conteneur via SSH ou SSM

---

## Structure du projet

```bash
├── terraform/                     # Modules et config Terraform
│   ├── backend.tf
│   ├── modules/
│   │   ├── lambda-scraper/
│   │   ├── s3-data/
│   │   ├── ecr/
│   │   ├── ec2-nginx/
│   │   ├── alb/
│   │   └── cicd/
│   └── env/
├── lambda/                        # AWS Lambda (scraper)
│   └── scraper.py
├── app/                           # Application Next.js statique
│   ├── next.config.js
│   ├── Dockerfile                 # Conteneur Docker NGINX
│   ├── package.json
│   ├── pages/
│   ├── components/
│   └── lib/
├── buildspec-nextjs.yml           # Build & push Docker image
├── buildspec-infra.yml            # Terraform validation & apply
└── README.md                      # Ce fichier
```
