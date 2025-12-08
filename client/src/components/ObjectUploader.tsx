import { useState, useRef } from "react";
import type { ReactNode, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, X, Image, Loader2 } from "lucide-react";

interface ObjectUploaderProps {
  maxFileSize?: number;
  onGetUploadParameters: () => Promise<{
    method: "PUT";
    url: string;
  }>;
  onComplete?: (result: { successful: Array<{ uploadURL?: string }> }) => void;
  buttonClassName?: string;
  children: ReactNode;
}

export function ObjectUploader({
  maxFileSize = 10485760,
  onGetUploadParameters,
  onComplete,
  buttonClassName,
  children,
}: ObjectUploaderProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    try {
      const { url } = await onGetUploadParameters();
      
      const response = await fetch(url, {
        method: 'PUT',
        body: selectedFile,
        headers: {
          'Content-Type': selectedFile.type,
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Upload Image</DialogTitle>
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
            ) : (
              <div className="relative">
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      data-testid="image-preview"
                    />
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
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Image className="w-4 h-4" />
                  <span className="truncate">{selectedFile.name}</span>
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive" data-testid="upload-error">
                {error}
              </p>
            )}

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
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
