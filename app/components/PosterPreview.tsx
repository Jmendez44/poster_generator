import React from "react";

interface PosterPreviewProps {
  previewSrc: string;
  isDragging: boolean;
  isLoading: boolean;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragEnter: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleClickUpload: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  downloadReady: boolean;
  handleDownload: () => void;
}

const PosterPreview: React.FC<PosterPreviewProps> = ({
  previewSrc,
  isDragging,
  isLoading,
  handleDragOver,
  handleDragEnter,
  handleDragLeave,
  handleDrop,
  handleClickUpload,
  fileInputRef,
  handleFileInputChange,
  downloadReady,
  handleDownload,
}) => {
  return (
    <div className="w-full md:w-2/3">
      <div className="flex flex-col items-center">
        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        {/* Poster preview area */}
        <div
          className={`relative w-[400px] h-[600px] bg-white border ${
            isDragging ? "border-blue-500" : "border-gray-300"
          } overflow-hidden rounded-lg shadow-lg`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClickUpload}
          style={{ cursor: "pointer" }}
        >
          {isLoading ? (
            // Display loading indicator
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
              {/* Loading Spinner */}
              <svg
                className="animate-spin h-10 w-10 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            </div>
          ) : previewSrc ? (
            // Display the poster preview
            <img
              src={previewSrc}
              alt="Poster Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            // Display placeholder
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-white bg-opacity-70">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mb-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <p className="text-lg">Drag image here or click to upload</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PosterPreview;
