"use client";

import { useState, useRef, useEffect } from "react";
import ColorThief from "color-thief-browser";
import wrapText from "./utils/wrapText";
import { loadInterFont } from "./utils/loadInterFont"; // Adjust the import path accordingly

export default function Home() {
  const [palette, setPalette] = useState<number[][]>([]);
  const [previewSrc, setPreviewSrc] = useState<string>("");
  const [downloadReady, setDownloadReady] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const uploadedImageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State variables for input fields
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");
  const [input4, setInput4] = useState("");

  // State for logos
  const [logos, setLogos] = useState<string[]>([
    // Replace with your logo paths or URLs
    "/logos/logo2.png",
  ]);

  const colorThief = new ColorThief();

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

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onload = function (e) {
        if (uploadedImageRef.current) {
          uploadedImageRef.current.src = e.target?.result as string;

          uploadedImageRef.current.onload = function () {
            if (uploadedImageRef.current?.complete) {
              // Generate color palette
              const palette = colorThief.getPalette(
                uploadedImageRef.current as HTMLImageElement,
                5
              );
              setPalette(palette);

              // Draw on canvas
              drawPoster(palette);
            }
          };
        }
      };

      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  async function drawPoster(palette: number[][], isExport: boolean = false) {
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D | null;

    if (isExport) {
      canvas = document.createElement("canvas");
      canvas.width = 6000;
      canvas.height = 9000;
      context = canvas.getContext("2d");
    } else {
      canvas = canvasRef.current!;
      context = canvas.getContext("2d");
      canvas.width = 800; // Adjusted width for manageable preview
      canvas.height = 1200; // Adjusted height for manageable preview
    }

    if (!context) return;

    // Wait for fonts to load
    await document.fonts.ready;
    console.log("Fonts loaded:", document.fonts.check("1em Inter")); // Should log true

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background
    context.fillStyle = "#FFFFFF"; // White background
    context.fillRect(0, 0, canvas.width, canvas.height);

    // === 1. Draw Title Line and Year ===

    const titleLineY = canvas.height * 0.015; // 3% from top
    const titleLineStartX = canvas.width * 0.03; // 3% from left
    const titleLineEndX = canvas.width * 0.97; // 97% from left
    const lineThickness = canvas.height * 0.002; // 0.5% of canvas height

    // Draw the horizontal line
    context.strokeStyle = "#000000"; // Black line
    context.lineWidth = lineThickness;
    context.beginPath();
    context.moveTo(titleLineStartX, titleLineY);
    context.lineTo(titleLineEndX, titleLineY);
    context.stroke();

    // Draw the year at the end of the line
    const titleYForYear = titleLineY + canvas.height * 0.017; // 2% below the line
    context.fillStyle = "#000000"; // Black text
    context.font = `${canvas.height * 0.02}px 'Inter', sans-serif`; // 4% of canvas height
    context.textAlign = "right";
    context.textBaseline = "middle";
    context.fillText(year, titleLineEndX, titleYForYear);
    // context.fillText(title, canvas.width * 0.05, titleYForYear);

    // === 2. Draw Title Text ===

    const titleY = titleLineY + canvas.height * 0.05; // 2% below the line
    context.fillStyle = "#000000"; // Black text
    context.font = `800 condensed ${
      canvas.height * 0.05
    }px 'Inter', sans-serif`; // 6% of canvas height
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText(title, canvas.width * 0.025, titleY);

    // === 3. Draw Uploaded Image ===

    const imageY = titleY + canvas.height * 0.055; // 2% below title
    const imageWidth = canvas.width * 0.95; // 95% of canvas width
    const imageHeight = imageWidth; // Square image

    if (previewSrc) {
      const img = uploadedImageRef.current!;
      const imgAspectRatio = img.naturalWidth / img.naturalHeight;
      const canvasAspectRatio = imageWidth / imageHeight;

      let sx, sy, sWidth, sHeight;

      if (imgAspectRatio > canvasAspectRatio) {
        // Image is wider than canvas area
        sHeight = img.naturalHeight;
        sWidth = sHeight * canvasAspectRatio;
        sx = (img.naturalWidth - sWidth) / 2;
        sy = 0;
      } else {
        // Image is taller than canvas area
        sWidth = img.naturalWidth;
        sHeight = sWidth / canvasAspectRatio;
        sx = 0;
        sy = (img.naturalHeight - sHeight) / 2;
      }

      // Calculate centered X-coordinate
      const imageX = (canvas.width - imageWidth) / 2;

      // Draw the cropped image
      context.drawImage(
        img,
        sx,
        sy,
        sWidth,
        sHeight,
        imageX,
        imageY,
        imageWidth,
        imageHeight
      );
    } else {
      // Draw placeholder for image area
      context.strokeStyle = "#CCCCCC"; // Light gray border
      context.lineWidth = lineThickness;
      context.strokeRect(
        canvas.width * 0.05,
        imageY,
        canvas.width * 0.9,
        canvas.width * 0.9
      );

      // Draw a plus icon in the center
      context.strokeStyle = "#AAAAAA"; // Gray color
      context.lineWidth = canvas.height * 0.01; // 1% of canvas height
      const centerX = canvas.width * 0.5;
      const centerY = imageY + canvas.width * 0.45; // Slight adjustment
      const plusSize = canvas.height * 0.05; // 5% of canvas height

      // Draw vertical line of plus
      context.beginPath();
      context.moveTo(centerX, centerY - plusSize);
      context.lineTo(centerX, centerY + plusSize);
      context.stroke();

      // Draw horizontal line of plus
      context.beginPath();
      context.moveTo(centerX - plusSize, centerY);
      context.lineTo(centerX + plusSize, centerY);
      context.stroke();

      // Draw the placeholder text below the plus icon
      context.fillStyle = "#AAAAAA"; // Gray text
      context.font = `${canvas.height * 0.035}px 'Inter', sans-serif`; // 3.5% of canvas height
      context.textAlign = "center";
      context.textBaseline = "top";
      context.fillText(
        "Drag image here or click to upload",
        centerX,
        centerY + plusSize + canvas.height * 0.02
      );
    }

    // === 4. Draw Color Palette Directly Under Image ===

    const paletteYPos = imageY + imageHeight + canvas.height * -0.03; // 0.5% below image
    const paletteHeight = canvas.height * 0.1; // 10% of canvas height
    const paletteWidth = canvas.width * 0.95; // 90% of canvas width
    const paletteX = canvas.width * 0.025; // 5% from left

    const paletteBoxHeight = paletteHeight * 0.2; // Increased to 20% of palette area height
    const paletteSpacing = canvas.width * 0; // 2% of canvas width

    // Calculate total width occupied by palette boxes and spacing
    const paletteBoxWidth =
      (paletteWidth - (palette.length - 1) * paletteSpacing) / palette.length;

    // Start drawing palette boxes from the left edge
    let currentX = paletteX;
    const paletteBoxY = paletteYPos + (paletteHeight - paletteBoxHeight) / 2; // Center vertically

    palette.forEach((color, index) => {
      context.fillStyle = `rgb(${color.join(",")})`;
      context.fillRect(
        currentX,
        paletteBoxY,
        paletteBoxWidth,
        paletteBoxHeight
      );

      // Removed borders from palette colors as per your request

      currentX += paletteBoxWidth + paletteSpacing;
    });

    // === 5. Draw Input Texts Directly Under Palette ===

    const textYStart = paletteYPos + paletteHeight + canvas.height * -0.025; // 0.5% below palette
    const textXPos = canvas.width * 0.025; // 25% from left
    let textY = textYStart;

    // Shot by Input
    context.fillStyle = "#333333"; // Dark gray text
    context.font = `600 condensed ${
      canvas.height * 0.0225
    }px 'Inter', sans-serif`; // 3.5% of canvas height
    context.textAlign = "left";
    context.textBaseline = "top";
    // context.fontStretch = "condensed"
    context.fillText(`Shot by ${input2}`, textXPos, textY);
    textY += canvas.height * 0.04; // 4% of canvas height

    // Location Input
    context.fillStyle = "#555555"; // Medium gray text
    context.font = `${canvas.height * 0.0125}px 'Inter', sans-serif`; // 3.5% of canvas height
    textY += canvas.height * -0.015; // 4% of canvas height
    context.fillText(input3, textXPos, textY);

    // A quote that matches
    context.fillStyle = "#777777"; // Light gray text
    context.font = `condensed ${canvas.height * 0.0125}px 'Inter', sans-serif`; // 3.5% of canvas height
    textY += canvas.height * 0.04; // 4% of canvas height
    context.fillText(input4, textXPos, textY);

    // Define maximum width and line height
    const maxTextWidth = canvas.width * 0.9; // 90% of canvas width
    const lineHeight = canvas.height * 0.015; // 4% of canvas height

    // Use wrapText to handle multi-line text and get updated y-coordinate
    textY = wrapText(
      context,
      input4,
      textXPos,
      textY,
      maxTextWidth,
      lineHeight
    );

    // // Update y-coordinate based on the number of lines drawn
    // // Estimate the number of lines by splitting the text
    // const estimatedLines = Math.ceil(
    //   input4.length / (maxTextWidth / (canvas.height * 0.035))
    // );
    // textY += lineHeight * estimatedLines;

    // === 6. Draw Three Logos at the Bottom ===

    const logosY = canvas.height * 0.95; // 95% from top (5% from bottom)
    const logoHeight = canvas.height * 0.07; // 7% of canvas height
    const logoSpacing = canvas.width * 0.05; // 5% of canvas width

    const totalLogosWidth =
      logos.length * (canvas.width * 0.1) + (logos.length - 1) * logoSpacing;
    const logosStartX = (canvas.width - totalLogosWidth) / 2; // Center the logos

    logos.forEach((logoSrc, index) => {
      const logoX = logosStartX + index * (canvas.width * 0.1 + logoSpacing);
      const logoY = logosY - logoHeight; // Position logos above the 95% line

      // Draw the logo image
      const logoImage = new Image();
      logoImage.src = logoSrc;
      logoImage.crossOrigin = "Anonymous"; // Handle CORS if logos are from external sources

      logoImage.onload = () => {
        context.drawImage(
          logoImage,
          logoX,
          logoY,
          canvas.width * 0.1,
          logoHeight
        );
      };

      // Optional: Draw placeholder if logo is not loaded
      logoImage.onerror = () => {
        context.fillStyle = "#CCCCCC"; // Light gray placeholder
        context.fillRect(logoX, logoY, canvas.width * 0.1, logoHeight);
        context.fillStyle = "#666666"; // Darker gray text
        context.font = `${canvas.height * 0.02}px Arial`; // 2% of canvas height
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(
          "Logo",
          logoX + canvas.width * 0.05,
          logoY + logoHeight / 2
        );
      };
    });

    if (!isExport) {
      setDownloadReady(true);
      const dataURL = canvas.toDataURL();
      setPreviewSrc(dataURL);
    } else {
      canvas.toBlob(function (blob) {
        const link = document.createElement("a");
        link.download = "poster.png";
        link.href = URL.createObjectURL(blob!);
        link.click();
      }, "image/png");
    }
  }

  // Redraw the poster when input fields or logos change
  useEffect(() => {
    const generatePoster = async () => {
      await drawPoster(palette);
    };
    generatePoster();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, year, input2, input3, input4, previewSrc, logos]);

  const handleDownload = () => {
    drawPoster(palette, true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mt-4 text-center">POSTER BORED</h1>
      <div className="flex flex-col md:flex-row md:items-center justify-center space-y-8 md:space-y-0 md:space-x-12 mt-6">
        {/* === 1. Input Fields on the Left === */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md">
          {/* <h2 className="text-2xl font-semibold mb-4">Input Fields</h2> */}
          {/* Title and Year Inputs */}
          <div className="mb-6">
            <label className="block text-left font-semibold mb-1">Title:</label>
            <input
              type="text"
              minLength={1}
              maxLength={16}
              value={title}
              onChange={(e) => setTitle(e.target.value.toUpperCase())}
              className="border border-gray-300 p-2 mb-3 w-full rounded"
              placeholder="Enter title"
            />
            <label className="block text-left font-semibold mb-1">Year:</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border border-gray-300 p-2 mb-3 w-full rounded"
              placeholder="Enter year"
            />
          </div>
          {/* Additional Inputs */}
          <div>
            <label className="block text-left font-semibold mb-1">
              Shot by:
            </label>
            <input
              type="text"
              value={input2}
              onChange={(e) => setInput2(e.target.value)}
              className="border border-gray-300 p-2 mb-3 w-full rounded"
              placeholder="Enter your name"
            />
            <label className="block text-left font-semibold mb-1">
              Location:
            </label>
            <input
              type="text"
              value={input3}
              onChange={(e) => setInput3(e.target.value)}
              className="border border-gray-300 p-2 mb-3 w-full rounded"
              placeholder="Enter Location"
            />
            <label className="block text-left font-semibold mb-1">
              Input 4:
            </label>
            <textarea
              value={input4}
              onChange={(e) => setInput4(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded"
              placeholder="Enter input 4"
            />
          </div>
        </div>

        {/* === 2. Poster Preview on the Right === */}
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
              <img
                src={previewSrc}
                alt="Poster Preview"
                className="w-full h-full object-cover"
              />
              {!previewSrc && (
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
            {/* Download Button */}
            {downloadReady && (
              <button
                onClick={handleDownload}
                className="mt-6 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition duration-300"
              >
                Download Poster
              </button>
            )}
            {/* Hidden elements */}
            <img
              ref={uploadedImageRef}
              alt="Uploaded"
              style={{ display: "none" }}
            />
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}
