// utils/drawPoster.ts

import { wrapText, capitalizeWords } from "./textFormatting";
// import loadInterFont from "./loadInterFont"; // Adjust the import path accordingly

interface DrawPosterParams {
  palette: number[][];
  isExport: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  uploadedImageRef: React.RefObject<HTMLImageElement>;
  previewSrc: string;
  setPreviewSrc: React.Dispatch<React.SetStateAction<string>>;
  setDownloadReady: React.Dispatch<React.SetStateAction<boolean>>;
  inputs: {
    title: string;
    year: string;
    input2: string;
    input3: string;
    input4: string;
    logos: string[];
  };
  imageUploaded: boolean;
  quality?: 'low' | 'high';
}

interface DrawPosterParams {
  palette: number[][];
  isExport: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  uploadedImageRef: React.RefObject<HTMLImageElement>;
  previewSrc: string;
  setPreviewSrc: React.Dispatch<React.SetStateAction<string>>;
  setDownloadReady: React.Dispatch<React.SetStateAction<boolean>>;
  inputs: {
    title: string;
    year: string;
    input2: string;
    input3: string;
    input4: string;
    logos: string[];
  };
  imageUploaded: boolean;
  quality?: 'low' | 'high';
}

async function drawPoster(params: DrawPosterParams) {
  const {
    palette,
    isExport,
    canvasRef,
    uploadedImageRef,
    previewSrc,
    setPreviewSrc,
    setDownloadReady,
    inputs: { title, year, input2, input3, input4, logos },
    imageUploaded,
    quality = 'high',
  } = params;

  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D | null;

  if (isExport) {
    canvas = document.createElement("canvas");
    canvas.width = quality === 'high' ? 6000 : 1500;
    canvas.height = quality === 'high' ? 9000 : 2250;
    context = canvas.getContext("2d");
  } else {
    canvas = canvasRef.current!;
    context = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 1200;
  }

  if (!context) return;

  // Wait for fonts to load
  await document.fonts.ready;
  console.log("Fonts loaded:", document.fonts.check("1em Inter")); // Should log true

  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the background
  context.fillStyle = "#F6F1E5"; // White background
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

  // === 2. Draw Title Text ===

  const titleY = titleLineY + canvas.height * 0.05; // 2% below the line
  context.fillStyle = "#000000"; // Black text
  context.font = `900 condensed ${canvas.height * 0.05}px 'Inter', sans-serif`; // 6% of canvas height
  context.textAlign = "left";
  context.textBaseline = "top";
  context.fillText(capitalizeWords(title), canvas.width * 0.025, titleY);

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
  const paletteSpacing = canvas.width * 0; // 0% of canvas width

  // Calculate total width occupied by palette boxes and spacing
  const paletteBoxWidth =
    (paletteWidth - (palette.length - 1) * paletteSpacing) / palette.length;

  // Start drawing palette boxes from the left edge
  let currentX = paletteX;
  const paletteBoxY = paletteYPos + (paletteHeight - paletteBoxHeight) / 2; // Center vertically

  palette.forEach((color, index) => {
    context.fillStyle = `rgb(${color.join(",")})`;
    context.fillRect(currentX, paletteBoxY, paletteBoxWidth, paletteBoxHeight);

    currentX += paletteBoxWidth + paletteSpacing;
  });

  // === 5. Draw Input Texts Directly Under Palette ===

  const textYStart = paletteYPos + paletteHeight + canvas.height * -0.025; // 0.5% below palette
  const textXPos = canvas.width * 0.025; // 2.5% from left
  let textY = textYStart;

  // Shot by Input
  context.fillStyle = "#333333"; // Dark gray text
  context.font = `600 condensed ${
    canvas.height * 0.0225
  }px 'Inter', sans-serif`; // 2.25% of canvas height
  context.textAlign = "left";
  context.textBaseline = "top";
  context.fillText(`Shot by ${capitalizeWords(input2)}`, textXPos, textY);
  textY += canvas.height * 0.04; // 4% of canvas height

  // Location Input
  context.fillStyle = "#555555"; // Medium gray text
  context.font = `${canvas.height * 0.0125}px 'Inter', sans-serif`; // 1.25% of canvas height
  textY += canvas.height * -0.015; // -1.5% of canvas height

  // Split input3 into address and coordinates
  const [address, coordinates] = input3.split('\n');

  // Draw address
  context.fillText(capitalizeWords(address), textXPos, textY);

  // Draw coordinates on the next line
  textY += canvas.height * 0.015; // Move to next line
  context.font = `${canvas.height * 0.01}px 'Inter', sans-serif`; // Slightly smaller font for coordinates
  context.fillText(coordinates || '', textXPos, textY);

  // Adjust textY for the next element
  textY += canvas.height * 0.04; // 4% of canvas height

  // A quote that matches
  context.fillStyle = "#333333"; // Dark gray text
  context.font = `condensed ${canvas.height * 0.0125}px 'Inter', sans-serif`; // 1.25% of canvas height

  // Define maximum width and line height
  const maxTextWidth = canvas.width * 0.9; // 90% of canvas width
  const lineHeight = canvas.height * 0.015; // 1.5% of canvas height

  // Reduce the space before the quote
  textY -= canvas.height * 0.01; // Subtract 2% of canvas height

  // Use wrapText to handle multi-line text and get updated y-coordinate
  textY = wrapText(context, input4, textXPos, textY, maxTextWidth, lineHeight);

  // === 6. Draw Logos at the Bottom ===

  const logosY = canvas.height * 0.98; // 98% from top (2% from bottom)
  const logoSpacing = canvas.width * 0.02; // 2% of canvas width for spacing between logos

  const drawLogo = async (src: string, x: number, y: number, width: number, height: number) => {
    return new Promise<void>((resolve) => {
      const logoImage = new Image();
      logoImage.src = src;
      logoImage.crossOrigin = "anonymous";

      logoImage.onload = () => {
        context!.drawImage(logoImage, x, y, width, height);
        resolve();
      };

      logoImage.onerror = () => {
        // Optional placeholder
        context!.fillStyle = "#CCCCCC";
        context!.fillRect(x, y, width, height);
        context!.fillStyle = "#666666";
        context!.font = `${canvas.height * 0.02}px Arial`;
        context!.textAlign = "center";
        context!.textBaseline = "middle";
        context!.fillText("Logo", x + width / 2, y + height / 2);
        resolve();
      };
    });
  };

  // Define individual logo dimensions
  const logo1Width = canvas.width * 0.02;   // 4% of canvas width
  const logo1Height = canvas.height * 0.010; // 2.5% of canvas height

  const logo2Width = canvas.width * 0.08;   // 15% of canvas width
  const logo2Height = canvas.height * 0.010; // 2.5% of canvas height

  const logo3Width = canvas.width * 0.04;   // 4% of canvas width
  const logo3Height = canvas.height * 0.010; // 2.5% of canvas height

  // Calculate total width of all logos and spacing
  const totalLogoWidth = logo1Width + logo2Width + logo3Width + 2 * logoSpacing;

  // Calculate starting X position to center the logo group
  const startX = (canvas.width - totalLogoWidth) / 2;

  // Calculate individual logo positions
  const logo1X = startX;
  const logo2X = logo1X + logo1Width + logoSpacing;
  const logo3X = logo2X + logo2Width + logoSpacing;

  // Calculate Y positions to align the bottoms of the logos
  const maxLogoHeight = Math.max(logo1Height, logo2Height, logo3Height);
  const logo1Y = logosY - logo1Height;
  const logo2Y = logosY - logo2Height;
  const logo3Y = logosY - logo3Height;

  // Draw the logos
  await drawLogo('/logos/CINECNVS2.png', logo1X, logo1Y, logo1Width, logo1Height);
  await drawLogo('/logos/logo2.png', logo2X, logo2Y, logo2Width, logo2Height);
  await drawLogo('/logos/pngegg.png', logo3X, logo3Y, logo3Width, logo3Height);

  if (!isExport) {
    if (imageUploaded) {
      setDownloadReady(true);
      const dataURL = canvas.toDataURL();
      setPreviewSrc(dataURL);
    } else {
      setDownloadReady(false);
      setPreviewSrc(""); // Ensure previewSrc is empty
    }
  } else {
    canvas.toBlob(function (blob) {
      const link = document.createElement("a");
      link.download = "poster.png";
      link.href = URL.createObjectURL(blob!);
      link.click();
    }, "image/png");
  }
}

export default drawPoster;
