"use client";

import dynamic from "next/dynamic";
import React from "react";

const OrgChart = dynamic(() => import("./components/OrgChart"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative flex items-center justify-center p-4 min-h-screen">
      <OrgChart />
    </main>
  );
}
