// components/InputFields.tsx

import React, { useState, useEffect, useMemo } from "react";

interface InputFieldsProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  year: string;
  setYear: React.Dispatch<React.SetStateAction<string>>;
  input2: string;
  setInput2: React.Dispatch<React.SetStateAction<string>>;
  input3: string;
  setInput3: React.Dispatch<React.SetStateAction<string>>;
  input4: string;
  setInput4: React.Dispatch<React.SetStateAction<string>>;
}

const InputFields: React.FC<InputFieldsProps> = ({
  title,
  setTitle,
  year,
  setYear,
  input2,
  setInput2,
  input3,
  setInput3,
  input4,
  setInput4,
}) => {
  const currentYear = new Date().getFullYear();
  const years = useMemo(() => {
    const yearList = [];
    for (let y = currentYear; y >= 1900; y--) {
      yearList.push(y);
    }
    return yearList;
  }, [currentYear]);
  return (
    <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md">
      {/* Title and Year Inputs */}
      <div className="mb-6">
        <label className="block text-left font-semibold mb-1">Title:</label>
        <input
          type="text"
          minLength={1}
          maxLength={16}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 p-2 mb-3 w-full rounded"
          placeholder="Enter title"
        />
        <label className="block text-left font-semibold mb-1">Year:</label>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border border-gray-300 p-2 mb-3 w-full rounded"
        >
          <option selected value="" disabled>
            2024
          </option>
          {years.map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>
      </div>
      {/* Additional Inputs */}
      <div>
        <label className="block text-left font-semibold mb-1">Shot by:</label>
        <input
          type="text"
          value={input2}
          onChange={(e) => setInput2(e.target.value)}
          className="border border-gray-300 p-2 mb-3 w-full rounded"
          placeholder="Enter your name"
        />
        <label className="block text-left font-semibold mb-1">Location:</label>
        <input
          type="text"
          value={input3}
          onChange={(e) => setInput3(e.target.value)}
          className="border border-gray-300 p-2 mb-3 w-full rounded"
          placeholder="Enter Location"
        />
        <label className="block text-left font-semibold mb-1">A Quote:</label>
        <textarea
          minLength={100}
          maxLength={385}
          value={input4}
          onChange={(e) => setInput4(e.target.value)}
          className="border border-gray-300 p-2 w-full rounded"
          placeholder="Enter a Quote (or whatever you want really 🙂)"
        ></textarea>
      </div>
    </div>
  );
};

export default InputFields;
