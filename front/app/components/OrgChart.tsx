import React, { useState, useMemo, useCallback } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import OrgChartNode from "./OrgChartNode";
import CollapseControl from "./CollapseControl";
import DetailNode from "./DetailNode";
import LocationFilter from "./LocationFilter";
import PaginationControl from "./PaginationControl";
import type { OrgMember } from "../data/orgChartData";
import { orgData } from "../data/orgChartData";
import { Transition } from "@headlessui/react";

export default function OrgChart() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    member_ceo: true,
  });
  const [selectedMember, setSelectedMember] = useState<OrgMember | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([
    "Paris",
  ]);
  const [pageMap, setPageMap] = useState<Record<string, number>>({});

  const maxKidsPerPage = 3;
  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleLocation = (loc: string) =>
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    );
  const setPage = useCallback((parentId: string, page: number) => {
    setPageMap((prev) => ({ ...prev, [parentId]: page }));
  }, []);

  // 1. Construire la map managerName → enfants
  const childrenMap = useMemo(() => {
    const map: Record<string, (OrgMember & { managerName?: string })[]> = {};
    orgData.forEach((m) => {
      if (m.managerName) {
        map[m.managerName] ||= [];
        map[m.managerName].push(m);
      }
    });
    return map;
  }, []);

  // 2. Filtrage récursif par localisation
  const filterRec = useCallback(
    (node: OrgMember & { managerName?: string }): boolean => {
      const self = selectedLocations.includes(node.location);
      const kids = childrenMap[node.name] || [];
      return self || kids.some((c) => filterRec(c));
    },
    [childrenMap, selectedLocations]
  );

  // 3. Racines
  const roots = useMemo(
    () =>
      orgData
        .filter((m) => !m.managerName)
        .filter((m) => (selectedLocations.length ? filterRec(m) : true)),
    [filterRec, selectedLocations]
  );

  // 4. Affichage conditionnel des enfants
  const getDisplayedChildren = (name: string) => {
    const all = childrenMap[name] || [];
    const open = all.filter((c) => expanded[c.id]);
    return open.length > 0 ? open : all;
  };

  const getLastName = (s: string) => s.trim().split(" ").slice(-1)[0];

  // 5. Rendu récursif
  const renderTree = (member: OrgMember & { managerName?: string }) => {
    const rawKids = getDisplayedChildren(member.name).filter((c) =>
      selectedLocations.length ? filterRec(c) : true
    );
    const sortedKids = [...rawKids].sort((a, b) => {
      const diff =
        (childrenMap[b.name]?.length || 0) - (childrenMap[a.name]?.length || 0);
      if (diff !== 0) return diff;
      return getLastName(a.name).localeCompare(getLastName(b.name));
    });

    const isExp = !!expanded[member.id];
    const currentPage = pageMap[member.id] ?? 1;
    const paginated = sortedKids.slice(
      (currentPage - 1) * maxKidsPerPage,
      currentPage * maxKidsPerPage
    );

    return (
      <TreeNode
        key={member.id}
        label={
          <div className="flex justify-center">
            <OrgChartNode
              avatarUrl={member.avatarUrl}
              name={member.name}
              title={member.title}
              department={member.department}
              location={member.location}
              onClick={() => setSelectedMember(member)}
            />
          </div>
        }
      >
        {sortedKids.length > 0 && (
          <TreeNode
            label={
              // wrapper en grid 3 colonnes : [1fr auto 1fr]
              <div
                className="relative w-full grid"
                style={{
                  gridTemplateColumns: "1fr auto 1fr",
                  alignItems: "center",
                }}
              >
                {/* case gauche vide */}
                <div />

                {/* case centrale : collapse centré */}
                <CollapseControl
                  isExpanded={isExp}
                  onToggle={() => toggle(member.id)}
                  childrenCount={childrenMap[member.name]?.length || 0}
                />

                {/* case droite : pagination alignée à droite */}
                {sortedKids.length > maxKidsPerPage && isExp && (
                  <PaginationControl
                    currentPage={currentPage}
                    totalItems={sortedKids.length}
                    itemsPerPage={maxKidsPerPage}
                    onPageChange={(p) => setPage(member.id, p)}
                  />
                )}
              </div>
            }
          >
            {isExp &&
              paginated.map((child) => (
                <React.Fragment key={child.id}>
                  {renderTree(child)}
                </React.Fragment>
              ))}
          </TreeNode>
        )}
      </TreeNode>
    );
  };

  return (
    <div className="relative">
      <LocationFilter selected={selectedLocations} onToggle={toggleLocation} />

      <div
        className={`transition-all duration-200 ${selectedMember ? "filter blur-xs" : ""} flex justify-center`}
      >
        {roots.map((root) => {
          const rawKids = getDisplayedChildren(root.name).filter((c) =>
            selectedLocations.length ? filterRec(c) : true
          );
          const sortedKids = [...rawKids].sort((a, b) => {
            const diff =
              (childrenMap[b.name]?.length || 0) -
              (childrenMap[a.name]?.length || 0);
            if (diff !== 0) return diff;
            return getLastName(a.name).localeCompare(getLastName(b.name));
          });

          const isExp = !!expanded[root.id];
          const currentPage = pageMap[root.id] ?? 1;
          const paginated = sortedKids.slice(
            (currentPage - 1) * maxKidsPerPage,
            currentPage * maxKidsPerPage
          );

          return (
            <Tree
              key={root.id}
              lineWidth="3px"
              lineColor="#E5E7EB"
              lineBorderRadius="8px"
              label={
                <div className="flex justify-center">
                  <OrgChartNode
                    avatarUrl={root.avatarUrl}
                    name={root.name}
                    title={root.title}
                    department={root.department}
                    location={root.location}
                    onClick={() => setSelectedMember(root)}
                  />
                </div>
              }
            >
              <TreeNode
                label={
                  <div
                    className="relative w-full grid"
                    style={{
                      gridTemplateColumns: "1fr auto 1fr",
                      alignItems: "center",
                    }}
                  >
                    <div />
                    <CollapseControl
                      isExpanded={isExp}
                      onToggle={() => toggle(root.id)}
                      childrenCount={childrenMap[root.name]?.length || 0}
                    />
                    {sortedKids.length > maxKidsPerPage && isExp && (
                      <PaginationControl
                        currentPage={currentPage}
                        totalItems={sortedKids.length}
                        itemsPerPage={maxKidsPerPage}
                        onPageChange={(p) => setPage(root.id, p)}
                      />
                    )}
                  </div>
                }
              >
                {isExp &&
                  paginated.map((child) => (
                    <React.Fragment key={child.id}>
                      {renderTree(child)}
                    </React.Fragment>
                  ))}
              </TreeNode>
            </Tree>
          );
        })}
      </div>

      {selectedMember && (
        <Transition
          appear
          show
          enter="transition ease-out duration-500 transform"
          enterFrom="opacity-0 scale-85"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-500 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-85"
        >
          <div
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            role="dialog"
            aria-modal="true"
          >
            <DetailNode
              member={selectedMember}
              onClose={() => setSelectedMember(null)}
            />
          </div>
        </Transition>
      )}
    </div>
  );
}
