import React, { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import OrgChartNode from "./OrgChartNode";
import CollapseControl from "./control/CollapseControl";
import DetailNode from "./DetailNode";
import PaginationControl from "./control/PaginationControl";
import type { Membre } from "../types/Membre";
import { orgData } from "../data/orgChartData.generated";
import { Transition } from "@headlessui/react";

// Import dynamique de Tree et TreeNode, désactivant le SSR
const Tree = dynamic(
  () => import("react-organizational-chart").then((mod) => mod.Tree),
  { ssr: false }
);
const TreeNode = dynamic(
  () => import("react-organizational-chart").then((mod) => mod.TreeNode),
  { ssr: false }
);

type OrgChartProps = {
  selectedCommunities?: string[];
};

export default function OrgChart({ selectedCommunities }: OrgChartProps) {
  const roots = useMemo(() => orgData.filter((m) => !m.nomManager), []);

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    roots.forEach((root) => {
      init[root.id] = true;
    });
    return init;
  });

  const [selectedMember, setSelectedMember] = useState<Membre | null>(null);
  const [pageMap, setPageMap] = useState<Record<string, number>>({});

  const maxKidsPerPage = 4;

  // Toggle expand/collapse, et reset page à 1 lorsque l'on ouvre
  const toggle = (id: string) => {
    setExpanded((prev) => {
      const willExpand = !prev[id];
      if (willExpand) {
        setPageMap((pm) => ({ ...pm, [id]: 1 }));
      }
      return { ...prev, [id]: willExpand };
    });
  };

  const setPage = useCallback((parentId: string, page: number) => {
    setPageMap((prev) => ({ ...prev, [parentId]: page }));
  }, []);

  const filteredData = useMemo(() => {
    if (selectedCommunities && selectedCommunities.length > 0) {
      return orgData.filter((m) => {
        const comm = m.communaute
          ? Array.isArray(m.communaute)
            ? m.communaute
            : [m.communaute]
          : [];
        return comm.some((c) => selectedCommunities.includes(c));
      });
    }
    return orgData;
  }, [selectedCommunities]);

  const childrenMap = useMemo(() => {
    const map: Record<string, Membre[]> = {};
    filteredData.forEach((m) => {
      if (m.nomManager) {
        map[m.nomManager] ||= [];
        map[m.nomManager].push(m);
      }
    });
    return map;
  }, [filteredData]);

  const getDisplayedChildren = (name: string) => {
    const all = childrenMap[name] || [];
    const open = all.filter((c) => expanded[c.id]);
    return open.length > 0 ? open : all;
  };

  const getLastName = (s: string) => s.trim().split(" ").slice(-1)[0];

  const renderTree = (member: Membre) => {
    const rawKids = getDisplayedChildren(member.nom);
    const sortedKids = [...rawKids].sort((a, b) => {
      const diff =
        (childrenMap[b.nom]?.length || 0) - (childrenMap[a.nom]?.length || 0);
      if (diff !== 0) return diff;
      return getLastName(a.nom).localeCompare(getLastName(b.nom));
    });

    const isExp = !!expanded[member.id];
    const totalPages = Math.ceil(sortedKids.length / maxKidsPerPage) || 1;
    // Clamp : si pageMap[member.id] > totalPages, on retombe sur totalPages
    const currentPage = Math.min(pageMap[member.id] ?? 1, totalPages);

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
              membre={member}
              onClick={() => setSelectedMember(member)}
            />
          </div>
        }
      >
        {sortedKids.length > 0 && (
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
                  onToggle={() => toggle(member.id)}
                  childrenCount={childrenMap[member.nom]?.length || 0}
                />

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
      <div
        className={`transition-all duration-200 ${
          selectedMember ? "filter blur-xs" : ""
        } flex justify-center`}
      >
        {roots.map((root) => {
          const rawKids = getDisplayedChildren(root.nom);
          const sortedKids = [...rawKids].sort((a, b) => {
            const diff =
              (childrenMap[b.nom]?.length || 0) -
              (childrenMap[a.nom]?.length || 0);
            if (diff !== 0) return diff;
            return getLastName(a.nom).localeCompare(getLastName(b.nom));
          });

          const isExp = !!expanded[root.id];
          const totalPages = Math.ceil(sortedKids.length / maxKidsPerPage) || 1;
          const currentPage = Math.min(pageMap[root.id] ?? 1, totalPages);

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
                    membre={root}
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
                      childrenCount={childrenMap[root.nom]?.length || 0}
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
              membre={selectedMember}
              onClose={() => setSelectedMember(null)}
            />
          </div>
        </Transition>
      )}
    </div>
  );
}
