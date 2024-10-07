"use client";

import { useState, useRef, useEffect } from "react";
import ColorThief from "color-thief-browser";

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

  const colorThief = new ColorThief();

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
                6
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

  function drawPoster(palette: number[][], isExport: boolean = false) {
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
      canvas.width = 400;
      canvas.height = 600;
    }

    if (!context) return;

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the frame background
    context.fillStyle = "#FAF9F6"; // Frame color
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Define padding
    const FRAME_PADDING = canvas.width * 0.01;

    // Define image area dimensions
    const imageAreaX = FRAME_PADDING;
    const imageAreaY = FRAME_PADDING;
    const imageAreaWidth = canvas.width - 2 * FRAME_PADDING;
    const imageAreaHeight = canvas.height / 1.75; // Keep it square

    if (previewSrc) {
      // Draw the uploaded image
      const img = uploadedImageRef.current!;
      const imgAspectRatio = img.naturalWidth / img.naturalHeight;
      const imageAreaAspectRatio = imageAreaWidth / imageAreaHeight;

      let sx, sy, sWidth, sHeight;

      if (imgAspectRatio > imageAreaAspectRatio) {
        // Image is wider than the image area
        sHeight = img.naturalHeight;
        sWidth = sHeight * imageAreaAspectRatio;
        sx = (img.naturalWidth - sWidth) / 2;
        sy = 0;
      } else {
        // Image is taller than the image area
        sWidth = img.naturalWidth;
        sHeight = sWidth / imageAreaAspectRatio;
        sx = 0;
        sy = (img.naturalHeight - sHeight) / 2;
      }

      // Draw the cropped image to fill the image area completely
      context.drawImage(
        img,
        sx,
        sy,
        sWidth,
        sHeight,
        imageAreaX,
        imageAreaY,
        imageAreaWidth,
        imageAreaHeight
      );
    } else {
      // Draw placeholder for image area
      context.strokeStyle = "#ccc";
      context.lineWidth = canvas.width * 0.005;
      context.strokeRect(
        imageAreaX,
        imageAreaY,
        imageAreaWidth,
        imageAreaHeight
      );

      // Draw a plus icon in the center
      context.strokeStyle = "#aaa";
      context.lineWidth = canvas.width * 0.01;
      const centerX = imageAreaX + imageAreaWidth / 2;
      const centerY = imageAreaY + imageAreaHeight / 2 - canvas.height * 0.05;
      const plusSize = canvas.width * 0.05;

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
      context.fillStyle = "#aaa";
      context.font = `${canvas.width * 0.04}px Arial`;
      context.textAlign = "center";
      context.textBaseline = "top";
      context.fillText(
        "Drag image here or click to upload",
        centerX,
        centerY + plusSize + canvas.height * 0.02
      );
    }

    // Prepare to draw content under the image
    const contentAreaX = imageAreaX;
    const contentAreaY = imageAreaY + imageAreaHeight + FRAME_PADDING;
    const contentAreaWidth = imageAreaWidth;
    const contentAreaHeight = canvas.height - contentAreaY - FRAME_PADDING;

    // Divide the content area into two columns: text and palette
    const textAreaWidth = contentAreaWidth * 0.7; // 70% for text
    const paletteAreaWidth = contentAreaWidth * 0.3; // 30% for palette

    // Positions
    const textAreaX = contentAreaX;
    const textAreaY = contentAreaY;
    const paletteAreaX = contentAreaX;
    const paletteAreaY = contentAreaY;
    const paletteAreaHeight = contentAreaHeight;

    // Draw the text
    context.textAlign = "left";
    context.textBaseline = "top";
    let textX = textAreaX;
    let textY = textAreaY;

    // Title and Year (Bold)
    context.font = `bold ${canvas.width * 0.05}px Arial Black`;
    context.fillStyle = "#000";
    let titleText = title;
    if (year) {
      titleText += ", " + year;
    }
    context.fillText(titleText, textX, textY);
    textY += canvas.height * 0.06;

    // Input 2 (Italic)
    context.font = `italic ${canvas.width * 0.04}px Georgia`;
    context.fillStyle = "#333";
    context.fillText(input2, textX, textY);
    textY += canvas.height * 0.05;

    // Input 3 (Regular)
    context.font = `${canvas.width * 0.04}px 'Times New Roman'`;
    context.fillStyle = "#555";
    context.fillText(input3, textX, textY);
    textY += canvas.height * 0.05;

    // Input 4 (Bold Italic)
    context.font = `bold italic ${canvas.width * 0.04}px Verdana`;
    context.fillStyle = "#777";
    context.fillText(input4, textX, textY);

    // Draw the color palette vertically under the image, aligned to the right
    const paletteBoxSize = paletteAreaWidth * 0.285; // Adjust size as needed
    const paletteStartX = imageAreaX + imageAreaWidth - paletteBoxSize; // Align right edge with image
    const paletteSpacing = canvas.height * 0.0025;
    const totalPaletteHeight =
      palette.length * (paletteBoxSize + paletteSpacing) - paletteSpacing;
    let paletteStartY =
      paletteAreaY + (paletteAreaHeight - totalPaletteHeight) / 2;

    palette.forEach((color, index) => {
      const y = paletteStartY + index * (paletteBoxSize + paletteSpacing);
      context.fillStyle = `rgb(${color.join(",")})`;
      context.fillRect(paletteStartX, y, paletteBoxSize, paletteBoxSize);

      // Optional: Draw border around color boxes
      // context.strokeStyle = "#ccc";
      // context.lineWidth = canvas.width * 0.002;
      // context.strokeRect(paletteStartX, y, paletteBoxSize, paletteBoxSize);
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

  // Redraw the poster when input fields change
  useEffect(() => {
    drawPoster(palette);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, year, input2, input3, input4, previewSrc]);

  const handleDownload = () => {
    drawPoster(palette, true);
  };

  return (
    <div className="font-sans">
      <h1 className="text-2xl font-bold mt-4 text-center">
        Photo Poster Generator
      </h1>
      <div className="flex flex-col items-center mt-4">
        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        <div className="flex mt-4">
          {/* Input fields on the left */}
          <div className="w-1/3 pr-4">
            {/* Input fields */}
            <div className="mb-2">
              <label className="block text-left">Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-gray-300 p-1 mb-2 w-full"
              />
              <label className="block text-left">Year:</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="border border-gray-300 p-1 mb-2 w-full"
              />
            </div>
            {/* Placeholder inputs */}
            <div>
              {/* Input 2 */}
              <label className="block text-left">Input 2:</label>
              <input
                type="text"
                value={input2}
                onChange={(e) => setInput2(e.target.value)}
                className="border border-gray-300 p-1 mb-2 w-full"
              />
              {/* Input 3 */}
              <label className="block text-left">Input 3:</label>
              <input
                type="text"
                value={input3}
                onChange={(e) => setInput3(e.target.value)}
                className="border border-gray-300 p-1 mb-2 w-full"
              />
              {/* Input 4 */}
              <label className="block text-left">Input 4:</label>
              <input
                type="text"
                value={input4}
                onChange={(e) => setInput4(e.target.value)}
                className="border border-gray-300 p-1 w-full"
              />
            </div>
          </div>
          {/* Poster preview on the right */}
          <div
            className={`relative w-2/3 h-[600px] bg-white border border-gray-300 overflow-hidden ${
              isDragging ? "border-blue-500" : ""
            }`}
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
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mb-2 text-gray-400"
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
                <p>Drag image here or click to upload</p>
              </div>
            )}
          </div>
        </div>
        {downloadReady && (
          <button
            onClick={handleDownload}
            className="mt-4 px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded"
          >
            Download Poster
          </button>
        )}
      </div>
      {/* Hidden elements */}
      <img ref={uploadedImageRef} alt="Uploaded" style={{ display: "none" }} />
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
}
