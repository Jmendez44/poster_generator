"use client";

import React from 'react';
import { useState, useRef, useEffect, useMemo, lazy, Suspense } from "react";
import useImageUpload from "./hooks/useImageUpload";
import InputFields from "./components/InputFields";
import drawPoster from "./utils/drawPoster";
import { loadInterFont } from "./utils/loadInterFont";
import { createGradientFromPalette } from "./utils/colorUtils";
import DownloadPopup from "./components/DownloadPopup";

// Lazy load the PosterPreview component
const PosterPreview = lazy(() => import("./components/PosterPreview"));

export default function Home() {
  // State variables for input fields with default values
  const [title, setTitle] = useState("My Awesome Shot");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [input2, setInput2] = useState("John Doe");
  const [input3, setInput3] = useState("New York, NY");
  const [input4, setInput4] = useState("Life is a beautiful journey filled with moments of joy, challenges, and growth. Each day presents an opportunity to learn, love, and make a positive impact on the world around us. Embrace the present, cherish your relationships, and pursue your passions with unwavering determination. Remember that every setback is a setup for a comeback, and every experience, good or bad, shapes who we are. Be kind to yourself and others, for we're all navigating this complex world together. In the end, it's not the years in your life that count, but the life in your years.");
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

  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);

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
  }, [title, year, input2, input3, input4, palette, imageUploaded]);

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

    setIsDownloadPopupOpen(true);
  };

  const handleDownloadLowRes = () => {
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
      quality: 'low',
    });
    setIsDownloadPopupOpen(false);
  };

  const handleSignUpAndDownload = async (email: string) => {
    setIsLoading(true);
    try {
      console.log('Sending request to /api/subscribe');
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_address: email }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      // Subscriber added successfully, now download high-res
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
        quality: 'high',
      });
      alert('Thank you for subscribing! Your high-res poster is being downloaded.');
    } catch (error) {
      console.error('Error in sign up process:', error);
      alert(error instanceof Error ? error.message : 'There was an error processing your request. Please try again.');
    } finally {
      setIsLoading(false);
      setIsDownloadPopupOpen(false);
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
          // generateRandomQuote={generateRandomQuote}
          // isGeneratingQuote={isGeneratingQuote}
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
      
      <DownloadPopup
        isOpen={isDownloadPopupOpen}
        onClose={() => setIsDownloadPopupOpen(false)}
        onDownloadLowRes={handleDownloadLowRes}
        onSignUp={handleSignUpAndDownload}
        isLoading={isLoading}
      />
    </div>
  );
}
