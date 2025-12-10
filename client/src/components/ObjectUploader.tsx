import { useState, useRef, useCallback } from "react";
import type { ReactNode, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, X, Image, Loader2, Crop, Check } from "lucide-react";
import ReactCrop, { type Crop as CropType, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ObjectUploaderProps {
  maxFileSize?: number;
  onGetUploadParameters: () => Promise<{
    method: "PUT";
    url: string;
  }>;
  onComplete?: (result: { successful: Array<{ uploadURL?: string }> }) => void;
  buttonClassName?: string;
  children: ReactNode;
  aspectRatio?: number;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export function ObjectUploader({
  maxFileSize = 10485760,
  onGetUploadParameters,
  onComplete,
  buttonClassName,
  children,
  aspectRatio,
}: ObjectUploaderProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<CropType>();
  const imgRef = useRef<HTMLImageElement>(null);
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxFileSize) {
      setError(`File too large. Maximum size is ${Math.round(maxFileSize / 1024 / 1024)}MB`);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setError(null);
    setSelectedFile(file);
    setCroppedFile(null);
    setCroppedPreview(null);
    setIsCropping(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initialCrop = aspectRatio 
      ? centerAspectCrop(width, height, aspectRatio)
      : centerAspectCrop(width, height, width / height);
    setCrop(initialCrop);
    setCompletedCrop(initialCrop);
  }, [aspectRatio]);

  const getCroppedImg = useCallback(async (): Promise<{ file: File; dataUrl: string } | null> => {
    if (!imgRef.current || !completedCrop || !selectedFile) return null;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const pixelCrop = {
      x: (completedCrop.x / 100) * image.width * scaleX,
      y: (completedCrop.y / 100) * image.height * scaleY,
      width: (completedCrop.width / 100) * image.width * scaleX,
      height: (completedCrop.height / 100) * image.height * scaleY,
    };

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    const mimeType = selectedFile.type || "image/jpeg";
    const quality = mimeType === "image/png" ? undefined : 0.9;
    const extension = mimeType.split("/")[1] || "jpg";
    const baseName = selectedFile.name.replace(/\.[^/.]+$/, "");
    const fileName = `${baseName}-cropped.${extension}`;

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(null);
            return;
          }
          const file = new File([blob], fileName, { type: mimeType });
          const dataUrl = canvas.toDataURL(mimeType, quality);
          resolve({ file, dataUrl });
        },
        mimeType,
        quality
      );
    });
  }, [completedCrop, selectedFile]);

  const handleConfirmCrop = async () => {
    const result = await getCroppedImg();
    if (result) {
      setCroppedFile(result.file);
      setCroppedPreview(result.dataUrl);
      setIsCropping(false);
    }
  };

  const handleSkipCrop = () => {
    setCroppedFile(null);
    setCroppedPreview(null);
    setIsCropping(false);
  };

  const handleEditCrop = () => {
    setIsCropping(true);
    setCroppedFile(null);
    setCroppedPreview(null);
  };

  const handleUpload = async () => {
    const fileToUpload = croppedFile || selectedFile;
    if (!fileToUpload) return;

    setUploading(true);
    setError(null);

    try {
      const { url } = await onGetUploadParameters();
      
      const response = await fetch(url, {
        method: 'PUT',
        body: fileToUpload,
        headers: {
          'Content-Type': fileToUpload.type,
        },
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const uploadURL = url.split('?')[0];

      if (onComplete) {
        onComplete({
          successful: [{ uploadURL }],
        });
      }

      handleClose();
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    setIsCropping(false);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setCroppedPreview(null);
    setCroppedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    setIsCropping(false);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setCroppedPreview(null);
    setCroppedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayPreview = croppedPreview || preview;

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className={buttonClassName}
        onClick={() => setShowModal(true)}
        data-testid="button-upload-image"
      >
        {children}
      </Button>

      <Dialog open={showModal} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className={isCropping ? "sm:max-w-2xl" : "sm:max-w-md"}>
          <DialogHeader>
            <DialogTitle className="font-serif">
              {isCropping ? "Crop Image" : "Upload Image"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {!selectedFile ? (
              <label
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                data-testid="dropzone-area"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground font-sans">
                    Click to select an image
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    PNG, JPG, or WebP (max {Math.round(maxFileSize / 1024 / 1024)}MB)
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                  data-testid="input-file"
                />
              </label>
            ) : isCropping && preview ? (
              <div className="space-y-4">
                <div className="relative w-full max-h-[400px] overflow-auto rounded-lg bg-muted flex items-center justify-center">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(_, percentCrop) => setCompletedCrop(percentCrop)}
                    aspect={aspectRatio}
                    className="max-w-full"
                  >
                    <img
                      ref={imgRef}
                      src={preview}
                      alt="Crop preview"
                      onLoad={onImageLoad}
                      className="max-w-full max-h-[380px] object-contain"
                      data-testid="crop-image"
                    />
                  </ReactCrop>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Drag to reposition. Drag corners to resize the crop area.
                </p>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleSkipCrop}
                    data-testid="button-skip-crop"
                  >
                    Skip Cropping
                  </Button>
                  <Button
                    type="button"
                    className="flex-1"
                    onClick={handleConfirmCrop}
                    disabled={!completedCrop}
                    data-testid="button-confirm-crop"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Apply Crop
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                  {displayPreview && (
                    <img
                      src={displayPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      data-testid="image-preview"
                    />
                  )}
                  {croppedFile && (
                    <div className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-md flex items-center gap-1">
                      <Crop className="w-3 h-3" />
                      Cropped
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={clearSelection}
                  data-testid="button-clear-selection"
                >
                  <X className="w-4 h-4" />
                </Button>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Image className="w-4 h-4" />
                    <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleEditCrop}
                    data-testid="button-edit-crop"
                  >
                    <Crop className="w-4 h-4 mr-1" />
                    Edit Crop
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive" data-testid="upload-error">
                {error}
              </p>
            )}

            {selectedFile && !isCropping && (
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleClose}
                  disabled={uploading}
                  data-testid="button-cancel-upload"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  data-testid="button-confirm-upload"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Upload'
                  )}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
