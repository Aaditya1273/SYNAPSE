import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 duration-200",
    {
        variants: {
            variant: {
                default:
                    "bg-gradient-to-r from-brand-500 to-violet-500 text-white hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] glow-brand",
                outline:
                    "border border-white/10 bg-transparent text-white/80 hover:bg-white/5 hover:border-white/20 hover:text-white",
                ghost:
                    "text-white/60 hover:text-white hover:bg-white/5",
                secondary:
                    "bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 hover:text-white",
                destructive:
                    "bg-danger/20 text-red-400 border border-red-500/30 hover:bg-danger/30",
                success:
                    "bg-success/20 text-green-400 border border-green-500/30 hover:bg-success/30",
                link: "text-brand-400 underline-offset-4 hover:underline p-0 h-auto",
            },
            size: {
                default: "h-10 px-5 py-2",
                sm: "h-8 rounded-md px-4 text-xs",
                lg: "h-12 rounded-xl px-8 text-base",
                xl: "h-14 rounded-xl px-10 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
