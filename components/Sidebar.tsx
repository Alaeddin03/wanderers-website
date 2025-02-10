import React from "react";
import Link from "next/link";
import { Guide } from "@/types/guide";

interface SidebarProps {
  guides: Guide[];
}

const renderGuides = (guides: Guide[], depth = 0) => {
  return (
    <ul style={{ paddingLeft: `${depth * 16}px` }}>
      {guides.map((guide) => (
        <li key={guide.id}>
          <Link href={`/guides/${guide.slug}`}>{guide.title}</Link>
          {guide.children.length > 0 && renderGuides(guide.children, depth + 1)}
        </li>
      ))}
    </ul>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ guides }) => {
  return (
    <aside style={{ borderRight: "1px solid #ddd", padding: "10px", width: "250px" }}>
      <h3>Table of Contents</h3>
      {guides.length > 0 ? renderGuides(guides) : <p>No guides available.</p>}
    </aside>
  );
};

export default Sidebar;
