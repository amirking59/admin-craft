import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Trash2, Upload } from "lucide-react";
import { useState, useCallback } from "react";
import FullScreenImage from "@/components/fullscreen-image";
import { useTranslation } from "react-i18next";
import { useUploadImage } from "@admin-panel/services/upload/_hooks";
import { SpinnerWrapper } from "@/components/ui/spinner-wrapper";

interface ImageFieldProps {
  name: string;
  label?: string;
  accept?: string;
}

export function ImageField({ label, name }: ImageFieldProps) {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const { uploadImage, isUploading } = useUploadImage();
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent, onChange: (value: string | null) => void) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        try {
          const response = await uploadImage(files[0]);
          if (response?.fullUrl) {
            onChange(response.fullUrl);
          }
        } catch (error) {
          console.error("Upload failed:", error);
        }
      }
    },
    [uploadImage],
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string | null) => void) => {
      const files = e.target.files;
      if (files && files[0]) {
        try {
          const response = await uploadImage(files[0]);

          if (response?.fullUrl) {
            onChange(response.fullUrl);
          }
        } catch (error) {
          console.error("Upload failed:", error);
        }
      }
    },
    [uploadImage],
  );

  const handleRemoveImage = useCallback((onChange: (value: string | null) => void) => {
    onChange(null);
  }, []);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}

          <FormControl>
            <SpinnerWrapper isLoading={isUploading}>
              {field.value ? (
                <div className="rounded-xl max-h- relative w-full overflow-hidden border border-ring/50 flex justify-center items-center">
                  <FullScreenImage src={field.value} className="w-full h-auto" alt="logo" />

                  <div
                    className="absolute cursor-pointer bottom-2 left-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    aria-label="View fullscreen"
                    onClick={() => handleRemoveImage(field.onChange)}
                  >
                    <Trash2 size={16} />
                  </div>
                </div>
              ) : (
                <div
                  className={`border-2 cursor-pointer border-dashed w-full flex justify-center items-center flex-col rounded-lg p-8 text-center transition-colors ${
                    dragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onClick={() => document.getElementById(`file-${name}`)?.click()}
                  onDrop={(e) => handleDrop(e, field.onChange)}
                >
                  <Upload size={32} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">{t("upload.inputDescription")}</p>

                  <input
                    type="file"
                    accept={"image/*"}
                    onChange={(e) => handleFileSelect(e, field.onChange)}
                    className="hidden"
                    id={`file-${name}`}
                  />
                </div>
              )}
            </SpinnerWrapper>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
