import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan disabled:pointer-events-none disabled:opacity-50", {
  variants: {
    variant: {
      default: "bg-primary-600 text-white shadow-[0_12px_35px_rgba(20,85,255,.45)] hover:bg-primary-500 hover:-translate-y-0.5",
      secondary: "border border-white/12 bg-white/[.08] text-white hover:bg-white/[.13]",
      ghost: "text-white/70 hover:bg-white/[.08] hover:text-white",
      dark: "bg-ink-950 text-white hover:bg-ink-900",
      destructive: "bg-danger/12 text-danger border border-danger/20 hover:bg-danger/18"
    },
    size: { default: "h-11 px-5", sm: "h-9 px-3.5 text-xs", lg: "h-13 px-7 text-base", icon: "h-10 w-10" }
  },
  defaultVariants: { variant: "default", size: "default" }
});

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";
export { Button, buttonVariants };
