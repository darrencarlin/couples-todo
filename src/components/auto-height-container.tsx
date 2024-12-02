"use client";

import { cn } from "@/lib/utils";
import { memo, useCallback, useEffect, useRef, useState } from "react";

interface DynamicHeightContainerProps {
  className?: string;
  children: React.ReactNode;
}

// This component will automatically adjust its height based on the size of the screen
//  and automatically overflow when the content is too large.

export const AutoHeightContainer = memo(
  ({ className, children }: DynamicHeightContainerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState(0);

    const calculateHeight = useCallback(() => {
      const element = containerRef.current;
      if (!element) return 0;

      const { height } = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      const paddingTop = parseFloat(style.paddingTop);
      const paddingBottom = parseFloat(style.paddingBottom);

      return Math.max(height - paddingTop - paddingBottom, 0);
    }, []);

    useEffect(() => {
      const element = containerRef.current;
      if (!element) return;

      setContentHeight(calculateHeight());

      const resizeObserver = new ResizeObserver(() => {
        setContentHeight(calculateHeight());
      });

      resizeObserver.observe(element);

      return () => resizeObserver.disconnect();
    }, [calculateHeight]);

    const classname = cn(
      "flex flex-col min-h-screen w-full overflow-y-auto",
      className
    );

    return (
      <div
        ref={containerRef}
        className={classname}
        style={{ height: `${contentHeight}px` }}
      >
        {children}
      </div>
    );
  }
);

// Add display name for better debugging
AutoHeightContainer.displayName = "DynamicHeightContainer";
