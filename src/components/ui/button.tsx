import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

export function Button({
  className,
  variant = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-xl px-4 py-2 font-medium transition",
        variant === "default" &&
          "bg-cyan-500 text-black hover:opacity-90",
        variant === "outline" &&
          "border border-white/20 hover:bg-white/10",
        className
      )}
      {...props}
    />
  );
}