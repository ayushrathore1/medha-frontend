import React from "react";
import { NavLink } from "react-router-dom";

const sidebarItems = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/flashcards", label: "Flashcards" },
  { path: "/quiz", label: "Quiz" },
  { path: "/chatbot", label: "Chatbot" },
  { path: "/feedback", label: "Feedback" },
];

const Sidebar = ({ open, onClose }) => (
  <aside
    className={`fixed z-40 top-0 left-0 h-full w-4/5 max-w-xs bg-white border-r border-blue-100 shadow-2xl py-8 px-4 transform transition-transform duration-300 ${
      open ? "translate-x-0" : "-translate-x-full"
    } md:hidden`}
  >
    <button
      onClick={onClose}
      className="absolute top-3 right-3 p-1 rounded hover:bg-blue-50 z-50"
    >
      <svg
        className="w-7 h-7 text-blue-700"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
    <div className="flex flex-col gap-3 mt-7">
      {sidebarItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `block font-semibold px-4 py-2 text-lg rounded-lg ${
              isActive
                ? "bg-blue-100 text-blue-700"
                : "text-blue-900 hover:bg-blue-50"
            } transition`
          }
          onClick={onClose}
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  </aside>
);

export default Sidebar;
