import React, { useState } from "react";
import { Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

interface FullScreenImageProps {
  src: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
}

export const FullScreenImage = ({
  src,
  alt = "Preview Image",
  className = "",
  imageClassName = "",
}: FullScreenImageProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative inline-block ${className}`}>
      <img src={src} alt={alt} className={`w-full h-full object-contain ${imageClassName}`} />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger
          render={
            <div
              className="absolute cursor-pointer bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="View fullscreen"
            />
          }
        >
          <Maximize2 size={16} />
        </DialogTrigger>

        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>image</DialogTitle>
          </DialogHeader>
        </VisuallyHidden>

        <DialogContent className="max-w-5xl w-[90vw] max-h-[90vh] overflow-hidden p-0 flex items-center justify-center bg-black/90">
          <img src={src} alt={alt} className="max-w-full max-h-[calc(90vh-2rem)] w-full h-full object-contain" />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FullScreenImage;
