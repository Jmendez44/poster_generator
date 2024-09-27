import { useState, useRef } from "react";
import Head from "next/head";
import ColorThief from "color-thief-browser";

export default function Home() {
  const [palette, setPalette] = useState<number[][]>([]);
  const [previewSrc, setPreviewSrc] = useState<string>("");
  const [downloadReady, setDownloadReady] = useState<boolean>(false);
  const uploadedImageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  const drawPoster = (palette: number[][], isExport: boolean = false) => {
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

    // Draw the white background
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate image dimensions and position for cropping
    const img = uploadedImageRef.current!;
    const imgAspectRatio = img.naturalWidth / img.naturalHeight;
    const canvasAspectRatio = canvas.width / (canvas.height * 0.6); // Image area is 60% of canvas height

    let imgWidth, imgHeight, imgX, imgY;

    if (imgAspectRatio > canvasAspectRatio) {
      // Image is wider than the canvas area
      imgHeight = canvas.height * 0.6;
      imgWidth = imgHeight * imgAspectRatio;
      imgX = -(imgWidth - canvas.width) / 2;
      imgY = 0;
    } else {
      // Image is taller than the canvas area
      imgWidth = canvas.width;
      imgHeight = imgWidth / imgAspectRatio;
      imgX = 0;
      imgY = -(imgHeight - canvas.height * 0.6) / 2;
    }

    // Draw the cropped image
    context.drawImage(img, imgX, imgY, imgWidth, imgHeight);

    // Draw the color palette
    const paletteBoxSize = canvas.width / 10;
    const paletteY = canvas.height - paletteBoxSize - canvas.height * 0.05; // 5% margin from bottom
    const totalPaletteWidth =
      palette.length * (paletteBoxSize + canvas.width * 0.02) -
      canvas.width * 0.02;
    const startX = (canvas.width - totalPaletteWidth) / 2;

    palette.forEach((color, index) => {
      const x = startX + index * (paletteBoxSize + canvas.width * 0.02);
      context.fillStyle = `rgb(${color.join(",")})`;
      context.fillRect(x, paletteY, paletteBoxSize, paletteBoxSize);

      // Optional: Draw border around color boxes
      context.strokeStyle = "#ccc";
      context.lineWidth = canvas.width * 0.002; // Line width relative to canvas size
      context.strokeRect(x, paletteY, paletteBoxSize, paletteBoxSize);
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
  };

  const handleDownload = () => {
    drawPoster(palette, true);
  };

  return (
    <>
      <Head>
        <title>Photo Border Generator</title>
      </Head>
      <h1 className="text-2xl font-bold mt-4">Photo Border Generator</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mt-4"
      />
      <div className="relative w-96 h-[600px] mx-auto mt-4 bg-white border border-gray-300 overflow-hidden">
        {previewSrc && (
          <img
            src={previewSrc}
            alt="Poster Preview"
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex justify-center mt-4">
        {palette.map((color, index) => (
          <div
            key={index}
            className="w-8 h-8 mx-1 border border-gray-300"
            style={{ backgroundColor: `rgb(${color.join(",")})` }}
          ></div>
        ))}
      </div>
      {downloadReady && (
        <button
          onClick={handleDownload}
          className="mt-4 px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded"
        >
          Download Poster
        </button>
      )}
      {/* Hidden elements */}
      <img ref={uploadedImageRef} alt="Uploaded" style={{ display: "none" }} />
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </>
  );
}
