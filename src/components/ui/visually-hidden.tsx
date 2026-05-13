import * as React from "react";
import { useRender } from "@base-ui/react/use-render";

interface VisuallyHiddenProps extends useRender.ComponentProps<"div"> {}

const HIDDEN_STYLE: React.CSSProperties = {
  border: 0,
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: "1px",
};

function VisuallyHidden({ render, style, ...props }: VisuallyHiddenProps) {
  return useRender({
    render: render ?? <div />,
    props: {
      ...props,
      style: { ...HIDDEN_STYLE, ...style },
    },
  });
}

export { VisuallyHidden };
export type { VisuallyHiddenProps };
