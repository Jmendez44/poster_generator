"use client";

import { useState, useRef, useEffect } from "react";
import useImageUpload from "./hooks/useImageUpload";
import InputFields from "./components/InputFields";
import PosterPreview from "./components/PosterPreview";
import drawPoster from "./utils/drawPoster";
import { loadInterFont } from "./utils/loadInterFont";

export default function Home() {
  // State variables for input fields
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");
  const [input4, setInput4] = useState("");

  // State for logos
  const [logos, setLogos] = useState<string[]>([
    "/logos/logo1.png",
    "/logos/logo2.png",
    "/logos/logo3.png",
  ]);

  const {
    palette,
    previewSrc,
    isDragging,
    uploadedImageRef,
    fileInputRef,
    handleFileInputChange,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleClickUpload,
    setPalette,
    setPreviewSrc,
    imageUploaded,
  } = useImageUpload();

  const [downloadReady, setDownloadReady] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Load the Inter font when the component mounts
    loadInterFont()
      .then(() => {
        console.log("Inter font loaded successfully.");
      })
      .catch((error) => {
        console.error("Failed to load Inter font:", error);
      });
  }, []);

  // Redraw the poster when input fields, logo, or palette change
  useEffect(() => {
    const generatePoster = async () => {
      if (imageUploaded) {
        // Only call drawPoster if an image is uploaded
        await drawPoster({
          palette,
          isExport: false,
          canvasRef,
          uploadedImageRef,
          previewSrc,
          setPreviewSrc,
          setDownloadReady,
          inputs: {
            title,
            year,
            input2,
            input3,
            input4,
            logos,
          },
          imageUploaded, // Pass this to drawPoster
        });
      } else {
        // If no image is uploaded, ensure previewSrc is empty
        setPreviewSrc("");
        setDownloadReady(false);
      }
    };
    generatePoster();
  }, [title, year, input2, input3, input4, logos, palette, imageUploaded]);

  const handleDownload = () => {
    if (imageUploaded) {
      drawPoster({
        palette,
        isExport: true,
        canvasRef,
        uploadedImageRef,
        previewSrc,
        setPreviewSrc,
        setDownloadReady,
        inputs: {
          title,
          year,
          input2,
          input3,
          input4,
          logos,
        },
        imageUploaded, // Pass this to drawPoster
      });
    } else {
      alert("Please upload an image before downloading the poster.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* === Header === */}
      <header className="text-center py-4 bg-white shadow-md">
        <h1 className="text-4xl font-bold">CineCanvas</h1>
      </header>

      {/* === Main Content Area === */}
      <div className="flex flex-col md:flex-row md:items-start justify-center space-y-8 md:space-y-0 md:space-x-12 mt-6 p-4">
        {/* === Inputs Section (Left Column) === */}
        <InputFields
          title={title}
          setTitle={setTitle}
          year={year}
          setYear={setYear}
          input2={input2}
          setInput2={setInput2}
          input3={input3}
          setInput3={setInput3}
          input4={input4}
          setInput4={setInput4}
        />

        {/* === Poster Preview on the Right === */}
        <PosterPreview
          previewSrc={previewSrc}
          isDragging={isDragging}
          handleDragOver={handleDragOver}
          handleDragEnter={handleDragEnter}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
          handleClickUpload={handleClickUpload}
          fileInputRef={fileInputRef}
          handleFileInputChange={handleFileInputChange}
          downloadReady={downloadReady}
          handleDownload={handleDownload}
        />
        {/* Hidden elements */}
        <img
          ref={uploadedImageRef}
          alt="Uploaded"
          style={{ display: "none" }}
        />
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      </div>
    </div>
  );
}
