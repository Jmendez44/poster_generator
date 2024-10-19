import React, { useMemo } from "react";

interface InputFieldsProps {
  palette: number[][];
  imageUploaded: boolean;
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
  handleDownload: () => void;
  generateRandomQuote: () => void;
  isGeneratingQuote: boolean;
}

const InputFields: React.FC<InputFieldsProps> = React.memo(({
  palette,
  imageUploaded,
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
  handleDownload,
  generateRandomQuote,
  isGeneratingQuote,
}) => {
  const currentYear = new Date().getFullYear();
  const years = useMemo(() => {
    const yearList = [];
    for (let y = currentYear; y >= 1900; y--) {
      yearList.push(y);
    }
    return yearList;
  }, [currentYear]);

  const isFormValid =
    imageUploaded &&
    title.trim() !== "" &&
    year.trim() !== "" &&
    input2.trim() !== "" &&
    input3.trim() !== "" &&
    input4.trim() !== "";

  const buttonColor =
    isFormValid && palette.length > 0
      ? `rgb(${palette[3][0]}, ${palette[3][1]}, ${palette[3][2]})`
      : "#cccccc"; // Gray color when disabled

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
          <option value="" disabled>
            Select Year
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
        <div className="mb-6 relative">
          <label className="block text-center font-semibold mb-1">Quote</label>
          <input
            type="text"
            value={input4}
            onChange={(e) => setInput4(e.target.value)}
            className="border border-gray-300 p-2 w-[300px] pr-24"
            placeholder="Enter a quote or generate one"
          />
          <button
            onClick={generateRandomQuote}
            disabled={isGeneratingQuote}
            className="absolute right-0 bottom-0 bg-blue-500 text-white px-2 py-1 text-sm rounded-bl rounded-tr hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isGeneratingQuote ? "..." : "Generate"}
          </button>
        </div>
        {/* Buttons */}
        <div className="flex items-end h-20 w-auto justify-around">
          <button
            onClick={handleDownload}
            disabled={!isFormValid}
            className={`mt-6 px-6 py-2 text-white shadow-md transition duration-300 ${
              isFormValid ? "" : "cursor-not-allowed"
            }`}
            style={{
              backgroundColor: buttonColor,
              opacity: isFormValid ? 1 : 0.6,
            }}
          >
            Download
          </button>
          <button
            onClick={handleDownload}
            disabled={!isFormValid}
            className={`mt-6 px-6 py-2 text-white shadow-md transition duration-300 ${
              isFormValid ? "" : "cursor-not-allowed"
            }`}
            style={{
              backgroundColor: buttonColor,
              opacity: isFormValid ? 1 : 0.6,
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
});

export default InputFields;
