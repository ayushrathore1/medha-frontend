import React from "react";

const SubjectCard = ({ subject, onSelect, onDelete }) => (
  <div className="flex justify-between items-center bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-3 shadow-sm">
    <span className="font-medium text-blue-900">{subject.name}</span>
    <div className="flex gap-2">
      <button
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        onClick={onSelect}
      >
        Select
      </button>
      {onDelete && (
        <button
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          onClick={onDelete}
        >
          Delete
        </button>
      )}
    </div>
  </div>
);

export default SubjectCard;
