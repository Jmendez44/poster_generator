// components/InputFields.tsx

import React, { useState, useEffect, useMemo } from "react";

interface InputFieldsProps {
  palette: number[][];
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
  downloadReady: boolean;
  handleDownload: () => void;
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
  downloadReady,
  handleDownload,
  palette,
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
    <div className="w-full md:w-full h-full p-6">
      {/* Title and Year Inputs */}
      <div className="mb-6 w-full">
        <label className="block text-center font-semibold mb-1">Title</label>
        <input
          type="text"
          minLength={1}
          maxLength={16}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 p-2 mb-3 w-[300px]"
          placeholder="Enter title"
        />
        <label className="block text-center font-semibold mb-1">
          Year Taken
        </label>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border border-gray-300 p-2 mb-3 w-[300px]"
        >
          {/* <option defaultValue={"2024"} disabled></option> */}
          {years.map((yr) => (
            <option defaultValue={"2024"} key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>
      </div>
      {/* Additional Inputs */}
      <div>
        <label className="block text-center font-semibold mb-1">Shot by</label>
        <input
          type="text"
          value={input2}
          onChange={(e) => setInput2(e.target.value)}
          className="border border-gray-300 p-2 mb-3 w-[300px] "
          placeholder="Enter your name"
        />
        <label className="block text-center font-semibold mb-1">Location</label>
        <input
          type="text"
          value={input3}
          onChange={(e) => setInput3(e.target.value)}
          className="border border-gray-300 p-2 mb-3 w-[300px]"
          placeholder="Enter Location"
        />
        <label className="block text-center font-semibold mb-1">A Quote</label>
        <textarea
          minLength={100}
          maxLength={385}
          value={input4}
          onChange={(e) => setInput4(e.target.value)}
          className="border border-gray-300 p-2 w-full"
          placeholder="Enter a Quote (or whatever you want really 🙂)"
        ></textarea>
        {/* Download Button */}
        {downloadReady ? (
          <div className="flex items-end h-20 w-auto justify-around">
            <button
              onClick={handleDownload}
              className="mt-6 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 shadow-md transition duration-300"
            >
              Download
            </button>
            <button
              onClick={handleDownload}
              className="mt-6 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 shadow-md transition duration-300"
            >
              Add to Cart
            </button>
          </div>
        ) : (
          <div className="flex items-end h-20 justify-around">
            <button
              onClick={handleDownload}
              className=" mt-6 px-6 py-2 text-black bg-gray-200 border-2 border-black"
            >
              Download
            </button>
            <button
              onClick={handleDownload}
              className=" mt-6 px-6 py-2 text-black bg-gray-200 border-2 border-black"
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputFields;
