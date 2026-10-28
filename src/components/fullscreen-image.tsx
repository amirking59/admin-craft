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
      <img src={src} alt={alt} className={`h-full w-full object-contain ${imageClassName}`} />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger
          render={
            <div
              className="absolute end-2 bottom-2 cursor-pointer rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
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

        <DialogContent className="flex max-h-[90vh] w-[90vw] max-w-5xl items-center justify-center overflow-hidden bg-black/90 p-0">
          <img src={src} alt={alt} className="h-full max-h-[calc(90vh-2rem)] w-full max-w-full object-contain" />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FullScreenImage;
