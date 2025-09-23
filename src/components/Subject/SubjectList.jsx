import React from "react";
import SubjectCard from "./SubjectCard";

const SubjectList = ({ subjects, onSelect, onDelete }) => {
  if (!subjects.length) {
    return (
      <div className="text-blue-700 text-center py-6">
        No subjects added. Click “Add Subject” to begin!
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {subjects.map((subject, idx) => (
        <SubjectCard
          key={subject._id || subject.name || idx}
          subject={subject}
          onSelect={() => onSelect && onSelect(subject, idx)}
          onDelete={onDelete ? () => onDelete(subject, idx) : undefined}
        />
      ))}
    </div>
  );
};

export default SubjectList;
