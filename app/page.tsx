"use client";

import React from 'react';
import { useState, useRef, useEffect, useMemo, lazy, Suspense } from "react";
import useImageUpload from "./hooks/useImageUpload";
import InputFields from "./components/InputFields";
import drawPoster from "./utils/drawPoster";
import { loadInterFont } from "./utils/loadInterFont";
import { createGradientFromPalette } from "./utils/colorUtils";

// Lazy load the PosterPreview component
const PosterPreview = lazy(() => import("./components/PosterPreview"));

export default function Home() {
  // State variables for input fields with default values
  const [title, setTitle] = useState("My Awesome Shot");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [input2, setInput2] = useState("John Doe");
  const [input3, setInput3] = useState("New York, NY");
  const [input4, setInput4] = useState("True joy in life comes not from material things, but from the people we hold dear. Loved ones are the anchors of our hearts, the safe harbor in every storm, and the constant reminder that we are never truly alone. Cherish them, for time is fleeting, and moments with them are life’s greatest treasures.");
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);
  const [backgroundGradient, setBackgroundGradient] = useState<string>(
    'linear-gradient(135deg, rgba(245, 247, 250, 0.5) 0%, rgba(195, 207, 226, 0.5) 100%)'
  );

  // State for logos
  const [logos, setLogos] = useState<string[]>([
    "/logos/CINECNVSthick.png",
    "/logos/logo2.png",
    "/logos/logo3.png",
  ]);

  const [isLoading, setIsLoading] = useState<boolean>(false); // Moved isLoading here

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
  } = useImageUpload(setIsLoading); // Pass setIsLoading to the hook

  const [downloadReady, setDownloadReady] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 400;  // Set to your desired width
      canvas.height = 600; // Set to your desired height
      canvasRef.current = canvas;
    }
  }, []);

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
          imageUploaded,
        });

        setIsLoading(false); // End loading after poster is drawn
        setBackgroundGradient(createGradientFromPalette(palette, 0.5)); // 0.5 opacity
      } else {
        setPreviewSrc("");
        setDownloadReady(false);
        setBackgroundGradient('linear-gradient(135deg, rgba(245, 247, 250, 0.5) 0%, rgba(195, 207, 226, 0.5) 100%)');
      }
    };
    generatePoster();
  }, [title, year, input2, input3, input4, logos, palette, imageUploaded]);

  const handleDownload = () => {
    if (
      !imageUploaded ||
      title.trim() === "" ||
      year.trim() === "" ||
      input2.trim() === "" ||
      input3.trim() === "" ||
      input4.trim() === ""
    ) {
      alert(
        "Please complete all fields and upload an image before proceeding."
      );
      return;
    }

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
      imageUploaded,
    });
  };

  const generateRandomQuote = async () => {
    setIsGeneratingQuote(true);
    try {
      const response = await fetch("/api/quote");
      if (!response.ok) {
        throw new Error("Failed to fetch quote");
      }
      const data = await response.json();
      setInput4(`${data.content} - ${data.author}`);
    } catch (error) {
      console.error("Failed to fetch quote:", error);
      setInput4("Failed to generate quote. Please try again.");
    } finally {
      setIsGeneratingQuote(false);
    }
  };

  const memoizedPalette = useMemo(() => palette, [palette]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative" style={{ background: backgroundGradient }}>
      {/* === Header === */}
      <header className="fixed logo-container top-0 left-0 right-0 flex justify-center pt-4 bg-transparent z--10">

          <img className="w-14" src="/logos/CINECNVSthick.png" alt="Logo" />

      </header>

      {/* === Main Content Area === */}
      <div className="flex flex-col flex-col-reverse md:flex-row h-full w-fit md:bg-white justify-center space-y-8 md:space-y-0 md:mt-0 mt-16 md:p-4 border-black md:border-0 md:rounded-sm md:shadow-xl">
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
          handleDownload={handleDownload}
          palette={memoizedPalette}
          imageUploaded={imageUploaded}
          generateRandomQuote={generateRandomQuote}
          isGeneratingQuote={isGeneratingQuote}
        />

        {/* Wrap PosterPreview in Suspense */}
        <Suspense fallback={<div>Loading poster preview...</div>}>
          <PosterPreview
            previewSrc={previewSrc}
            isDragging={isDragging}
            isLoading={isLoading}
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
        </Suspense>

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
