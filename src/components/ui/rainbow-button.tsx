import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

const rainbowButtonVariants = cva(
    cn(
        "relative cursor-pointer group transition-all animate-rainbow",
        "inline-flex items-center justify-center gap-2 shrink-0",
        "rounded-sm outline-none focus-visible:ring-[3px] aria-invalid:border-destructive",
        "text-sm font-medium whitespace-nowrap",
        "disabled:pointer-events-none disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
    ),
    {
        variants: {
            variant: {
                default:
                    "relative border-0 bg-[var(--button-bg)] text-[var(--button-fg)] z-10 \
                    before:content-[''] before:absolute before:inset-x-0 before:bottom-[-30%] before:left-1/2 before:-translate-x-1/2 before:w-[120%] before:h-2 before:rounded-full \
                    before:bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-2)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-5)))] \
                    before:blur-md before:opacity-80 before:z-[-1] before:animate-rainbow",
                outline:
                    "border border-input border-b-transparent bg-transparent text-[var(--button-fg)] [background-clip:padding-box,border-box,border-box] [background-origin:border-box] before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))] before:[filter:blur(0.75rem)]",
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
                lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
                icon: "size-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

interface RainbowButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof rainbowButtonVariants> {
    asChild?: boolean;
}

const RainbowButton = React.forwardRef<HTMLButtonElement, RainbowButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                data-slot="button"
                className={cn(rainbowButtonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    },
);

RainbowButton.displayName = "RainbowButton";

export { RainbowButton, rainbowButtonVariants, type RainbowButtonProps }; 