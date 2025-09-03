import React from "react";
import "../styles/Drawer.css";

export default function Drawer() {
  return (
    <aside className="drawer">
      <ul>
        <li>Dashboard</li>
        <li>Vendors</li>
        <li>Settings</li>
        <li>Logout</li>
      </ul>
    </aside>
  );
}
