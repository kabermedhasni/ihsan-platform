"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, FileCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProofUploadProps {
  onUpload: (file: File | null) => void;
  label?: string;
}

export const ProofUpload = ({
  onUpload,
  label = "Upload Bank Transfer Screenshot",
}: ProofUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        onUpload(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName(null);
    onUpload(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 px-1">
        {label}
      </label>

      <AnimatePresence mode="wait">
        {!preview ? (
          <div
            key="upload"
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-3xl p-10 flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all group"
          >
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-all">
              <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-foreground">
                Click or Drag to Upload
              </p>
              <p className="text-xs text-muted-foreground font-medium mt-1">
                PNG, JPG or PDF up to 5MB
              </p>
            </div>
          </div>
        ) : (
          <div
            key="preview"
            className="relative bg-card border border-border rounded-3xl overflow-hidden"
          >
            <div className="aspect-video w-full bg-muted relative group">
              {preview.startsWith("data:image") ? (
                <img
                  src={preview}
                  alt="Proof preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center gap-3">
                  <FileCheck className="w-12 h-12 text-primary" />
                  <span className="text-sm font-bold">{fileName}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={handleRemove}
                  className="p-3 bg-destructive text-destructive-foreground rounded-2xl hover:scale-110 transition-transform"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between border-t border-border bg-card">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-[10px] font-black text-foreground uppercase truncate max-w-[200px]">
                  {fileName}
                </span>
              </div>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">
                Ready
              </span>
            </div>
          </div>
        )}
      </AnimatePresence>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,.pdf"
        className="hidden"
      />
    </div>
  );
};
