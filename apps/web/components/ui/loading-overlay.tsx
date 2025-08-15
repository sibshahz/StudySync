import * as React from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

interface LoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  isVisible: boolean;
  message?: string;
}

const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ className, isVisible, message = "Loading...", ...props }, ref) => {
    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
          "flex items-center justify-center",
          className
        )}
        {...props}
      >
        <div className="bg-white rounded-lg p-6 shadow-lg flex flex-col items-center gap-4 max-w-sm mx-4">
          <Spinner size="lg" />
          <p className="text-sm font-medium text-gray-900">{message}</p>
        </div>
      </div>
    );
  }
);

LoadingOverlay.displayName = "LoadingOverlay";

export { LoadingOverlay };
