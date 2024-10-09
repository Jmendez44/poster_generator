// hooks/useImageUpload.ts

import { useState, useRef } from "react";
import ColorThief from "color-thief-browser";

export interface UseImageUploadReturn {
  palette: number[][];
  previewSrc: string;
  isDragging: boolean;
  uploadedImageRef: React.RefObject<HTMLImageElement>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragEnter: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleClickUpload: () => void;
  setPalette: React.Dispatch<React.SetStateAction<number[][]>>;
  setPreviewSrc: React.Dispatch<React.SetStateAction<string>>;
  imageUploaded: boolean;
}

export default function useImageUpload(): UseImageUploadReturn {
  const [palette, setPalette] = useState<number[][]>([]);
  const [previewSrc, setPreviewSrc] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const uploadedImageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageUploaded, setImageUploaded] = useState<boolean>(false);

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
                5
              );
              setPalette(palette);

              // Update previewSrc to trigger re-render
              setPreviewSrc(uploadedImageRef.current.src);

              // Set imageUploaded to true
              setImageUploaded(true);
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

  return {
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
  };
}
