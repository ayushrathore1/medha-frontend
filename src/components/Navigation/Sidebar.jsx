import React from "react";
import { NavLink } from "react-router-dom";

const sidebarItems = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/flashcards", label: "Flashcards" },
  { path: "/quiz", label: "Quiz" },
  { path: "/chatbot", label: "Chatbot" },
  { path: "/feedback", label: "Feedback" },
];

const Sidebar = () => (
  <aside className="bg-white w-60 min-h-screen border-r border-blue-100 shadow-sm py-6 px-3">
    <div className="flex flex-col gap-3">
      {sidebarItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `block font-semibold px-3 py-2 rounded-lg ${
              isActive
                ? "bg-blue-100 text-blue-700"
                : "text-blue-900 hover:bg-blue-50"
            } transition`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  </aside>
);

export default Sidebar;
