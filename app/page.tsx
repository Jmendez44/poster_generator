"use client";

import { useState, useRef, useEffect } from "react";
import ColorThief from "color-thief-browser";

export default function Home() {
  const [palette, setPalette] = useState<number[][]>([]);
  const [previewSrc, setPreviewSrc] = useState<string>("");
  const [downloadReady, setDownloadReady] = useState<boolean>(false);
  const uploadedImageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State variables for input fields
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");
  const [input4, setInput4] = useState("");

  const colorThief = new ColorThief();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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

    // Draw the frame background with the new color
    context.fillStyle = "#FAF9F6"; // Frame color
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Define padding
    const FRAME_PADDING = canvas.width * 0.05; // 5% of canvas width as padding

    // Adjust this value to change the image area's height
    const IMAGE_AREA_HEIGHT_PERCENT = 0.6; // 60% of canvas height

    // Calculate the available area for the image after padding
    const imageAreaX = FRAME_PADDING;
    const imageAreaY = FRAME_PADDING;
    const imageAreaWidth = canvas.width - 2 * FRAME_PADDING;
    const imageAreaHeight =
      canvas.height * IMAGE_AREA_HEIGHT_PERCENT - 2 * FRAME_PADDING;

    // Calculate image dimensions and position to fill the image area completely
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

    // Prepare to draw text and palette under the image
    const contentAreaY = imageAreaY + imageAreaHeight + FRAME_PADDING;
    const contentAreaHeight = canvas.height - contentAreaY - FRAME_PADDING;

    // Divide the content area into two columns
    const contentAreaX = imageAreaX;
    const contentAreaWidth = imageAreaWidth;

    // Define text area
    const textAreaX = contentAreaX;
    const textAreaY = contentAreaY;
    const textAreaWidth = contentAreaWidth * 0.7; // 70% for text
    const textAreaHeight = contentAreaHeight;

    // Define palette area
    const paletteAreaX = textAreaX + textAreaWidth;
    const paletteAreaY = contentAreaY;
    const paletteAreaWidth = contentAreaWidth * 0.3; // 30% for palette
    const paletteAreaHeight = contentAreaHeight;

    // Draw the text
    context.fillStyle = "#000"; // Text color
    context.font = `${canvas.width * 0.04}px Arial`; // Font size relative to canvas size
    context.textAlign = "left"; // Left-aligned text
    context.textBaseline = "top";

    let textX = textAreaX;
    let textY = textAreaY;

    // Draw title and year
    let titleText = title;
    if (year) {
      titleText += " " + year;
    }
    context.fillText(titleText, textX, textY);
    textY += canvas.height * 0.04; // Move down for next line

    // Draw input2
    context.fillText(input2, textX, textY);
    textY += canvas.height * 0.04;

    // Draw input3
    context.fillText(input3, textX, textY);
    textY += canvas.height * 0.04;

    // Draw input4
    context.fillText(input4, textX, textY);

    // Draw the color palette vertically
    // Adjust the paletteBoxSize to make the palette smaller
    const paletteBoxSize = paletteAreaWidth * 0.25; // Reduce the size multiplier to make it smaller
    // You can adjust the size multiplier (e.g., 0.5) to make the palette boxes smaller or larger

    const paletteStartX =
      paletteAreaX + (paletteAreaWidth - paletteBoxSize) / 2;
    const paletteSpacing = canvas.height * 0.01; // Adjust spacing as needed
    const totalPaletteHeight =
      palette.length * (paletteBoxSize + paletteSpacing) - paletteSpacing;
    let paletteStartY =
      paletteAreaY + (paletteAreaHeight - totalPaletteHeight) / 2;

    palette.forEach((color, index) => {
      const y = paletteStartY + index * (paletteBoxSize + paletteSpacing);
      context.fillStyle = `rgb(${color.join(",")})`;
      context.fillRect(paletteStartX, y, paletteBoxSize, paletteBoxSize);

      // Optional: Draw border around color boxes
      context.strokeStyle = "#ccc";
      context.lineWidth = canvas.width * 0.002; // Line width relative to canvas size
      context.strokeRect(paletteStartX, y, paletteBoxSize, paletteBoxSize);
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
    if (
      previewSrc &&
      uploadedImageRef.current &&
      uploadedImageRef.current.complete
    ) {
      drawPoster(palette);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, year, input2, input3, input4]);

  const handleDownload = () => {
    drawPoster(palette, true);
  };

  return (
    <div className="font-sans">
      <h1 className="text-2xl font-bold mt-4 text-center">POSTER BORED</h1>
      <div className="flex flex-col items-center mt-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4"
        />
        {previewSrc && (
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
            <div className="relative w-2/3 h-[600px] bg-white border border-gray-300 overflow-hidden">
              <img
                src={previewSrc}
                alt="Poster Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
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
