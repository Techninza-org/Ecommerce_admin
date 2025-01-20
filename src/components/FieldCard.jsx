import React from "react";

const FieldCard = ({ field }) => {
  return (
    <div className="bg-gray-700 p-4 rounded-lg mb-4">
      <h4 className="text-xl font-semibold text-gray-100">{field.keyName}</h4>
      <ul className="mt-2">
        {field.fieldValues.map((value) => (
          <li key={value.id} className="text-gray-300">
            {value.valueName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FieldCard;
