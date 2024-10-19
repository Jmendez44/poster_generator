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
      ? `rgb(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]})`
      : "#cccccc"; // Gray color when disabled

  return (
      <div className="w-full h-full p-6 bg-white md:bg-transparent mb-4 md:mb-0 flex flex-col justify-between">
        <label className="block text-left text-sm font-semibold mb-1">Title</label>
        <div className="flex items-center mb-3">
          <input
            type="text"
            minLength={1}
            maxLength={16}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 p-2 w-[220px] mr-2"
            placeholder="Enter title"
          />
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border border-gray-300 p-2 w-[80px]"
            defaultValue={currentYear.toString()}
          >
            {years.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>
        <label className="block text-left text-sm font-semibold mb-1">Shot by</label>
        <input
          type="text"
          value={input2}
          onChange={(e) => setInput2(e.target.value)}
          className="border border-gray-300 p-2 mb-3 w-[300px] "
          placeholder="Enter your name"
        />
        <label className="block text-left text-sm font-semibold mb-1">Location</label>
        <input
          type="text"
          value={input3}
          onChange={(e) => setInput3(e.target.value)}
          className="border border-gray-300 p-2 mb-3 w-[300px]"
          placeholder="Enter Location"
        />
        <div className="mb-6 relative">
          <label className="block text-left text-sm font-semibold mb-1">Quote</label>
          <textarea
            value={input4}
            onChange={(e) => setInput4(e.target.value)}
            placeholder="Enter a quote"
            className="w-full p-2 border border-gray-300 rounded h-32 resize-none align-top"
            style={{ verticalAlign: 'top' }}
          />
          <button
            onClick={generateRandomQuote}
            disabled={isGeneratingQuote}
            className="absolute right-2 bottom-2 w-8 h-8 bg-transparent border border-gray-300 text-black rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            title="Generate a quote"
          >
            {isGeneratingQuote ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
          </button>
        </div>
        {/* Buttons */}
        <div className="flex items-center w-auto justify-around">
          <button
            onClick={handleDownload}
            disabled={!isFormValid}
            className={`px-6 py-2 text-white shadow-md transition duration-300 ${
              isFormValid ? "" : "cursor-not-allowed"
            }`}
            style={{
              backgroundColor: buttonColor,
              opacity: isFormValid ? 1 : 0.6,
            }}
          >
            Download
          </button>
          <div className="relative group">
            <button
              disabled
              className="px-6 py-2 text-white shadow-md transition duration-300 cursor-not-allowed opacity-30 bg-gray-400"
            >
              Add to Cart
            </button>
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Coming Soon
            </span>
          </div>
        </div>
      </div>
  );
});

export default InputFields;
