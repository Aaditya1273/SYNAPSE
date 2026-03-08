import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
    {
        variants: {
            variant: {
                default: "border-brand-500/30 bg-brand-500/10 text-brand-400",
                success: "border-green-500/30 bg-green-500/10 text-green-400",
                warning: "border-amber-500/30 bg-amber-500/10 text-amber-400",
                danger: "border-red-500/30 bg-red-500/10 text-red-400",
                muted: "border-white/10 bg-white/5 text-white/50",
                outline: "border-white/20 bg-transparent text-white/70",
                violet: "border-violet-500/30 bg-violet-500/10 text-violet-400",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
