"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2, Replace } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import { toast } from "sonner";
import Image from "next/image";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string, publicId?: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  aspectRatio?: "square" | "video" | "portrait";
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled,
  className,
  label = "Upload Image",
  aspectRatio = "video",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local validation
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    // Set local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    const formData = new FormData();
    formData.append("image", file);

    setIsUploading(true);
    try {
      const { data } = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      if (data.success) {
        onChange(data.data.url, data.data.publicId);
        toast.success("Image uploaded successfully");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload image");
      setPreview(value || null); // Revert to previous value
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onRemove?.();
    onChange("", "");
  };

  return (
    <div className={cn("space-y-4 w-full", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-2xl transition-all duration-200 overflow-hidden group bg-muted/30",
          aspectRatio === "square" && "aspect-square",
          aspectRatio === "video" && "aspect-video",
          aspectRatio === "portrait" && "aspect-[3/4]",
          !preview && "hover:border-primary/50 hover:bg-primary/5",
          preview && "border-transparent",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {preview ? (
          <div className="relative w-full h-full">
            <Image
              src={preview}
              alt="Upload preview"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="rounded-xl font-bold gap-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || disabled}
              >
                <Replace className="h-4 w-4" />
                Replace
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="rounded-xl font-bold gap-2"
                onClick={handleRemove}
                disabled={isUploading || disabled}
              >
                <X className="h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="w-full h-full flex flex-col items-center justify-center gap-4 text-muted-foreground transition-colors group-hover:text-primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || disabled}
          >
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-primary/10">
              <Upload className="h-7 w-7" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-bold">{label}</p>
              <p className="text-xs">PNG, JPG, WebP up to 5MB</p>
            </div>
          </button>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 animate-in fade-in duration-300">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-xs font-bold text-primary animate-pulse uppercase tracking-wider">Uploading...</p>
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isUploading || disabled}
      />
    </div>
  );
}
