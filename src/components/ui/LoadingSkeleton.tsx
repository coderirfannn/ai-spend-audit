import React from "react";
import clsx from "clsx";

type LoadingSkeletonProps = {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: "sm" | "md" | "full";
};

export function LoadingSkeleton({ className, width = "100%", height = 16, rounded = "md" }: LoadingSkeletonProps) {
  const radius = rounded === "sm" ? "6px" : rounded === "md" ? "10px" : "9999px";

  return (
    <div
      aria-hidden
      className={clsx("animate-pulse bg-[color:var(--panel-border)]", className)}
      style={{ width, height, borderRadius: radius }}
    />
  );
}

export default LoadingSkeleton;
