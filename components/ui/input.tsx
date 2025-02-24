import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "border" | "default" | "neutral";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => {
    const variantClasses = {
      border:
        "bg-transparent border-white border text-white placeholder:text-neutral-500",
      default: "",
      neutral:
        "bg-neutral-800 border-none text-white placeholder:text-neutral-500 ring-offset-neutral-500",
    };
    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded-full border border-slate-200 bg-white px-5 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          variantClasses[variant],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
