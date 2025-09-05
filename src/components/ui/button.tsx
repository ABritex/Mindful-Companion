import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[2px] focus-visible:ring-[var(--input-button-blue)] focus-visible:outline-none",
    {
        variants: {
            variant: {
                default:
                    "bg-[var(--color-primary)] text-[var(--input-button-background)] shadow-input hover:bg-[var(--color-primary)]/90 group-hover/button:shadow-none",
                destructive:
                    "bg-[var(--color-accent)] text-white shadow-input hover:bg-[var(--color-accent)]/90 group-hover/button:shadow-none",
                outline:
                    "border-none bg-[var(--input-button-background)] text-[var(--color-foreground)] shadow-input hover:bg-[var(--color-muted-foreground)] group-hover/button:shadow-none",
                secondary:
                    "bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] shadow-input hover:bg-[var(--color-secondary)]/80 group-hover/button:shadow-none",
                ghost:
                    "bg-transparent hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] shadow-input group-hover/button:shadow-none",
                link: "text-[var(--color-primary)] underline-offset-4 hover:underline bg-transparent shadow-none",
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
    }
)

function Button({
    className,
    variant,
    size,
    asChild = false,
    children,
    ...props
}: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean
    }) {
    const Comp = asChild ? Slot : "button"

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        >
            {children}
        </Comp>
    )
}

export { Button, buttonVariants }

