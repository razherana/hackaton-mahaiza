import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default:
          "bg-[#3a8a2a] text-white shadow-lg shadow-[#3a8a2a]/30 hover:bg-[#317025] focus-visible:ring-[#3a8a2a]",
        secondary:
          "bg-white text-[#1b1b1b] border border-[#1b1b1b]/10 hover:bg-[#f3f3f3] focus-visible:ring-[#3a8a2a]",
        outline:
          "border border-[#3a8a2a] text-[#3a8a2a] hover:bg-[#3a8a2a]/10 focus-visible:ring-[#3a8a2a]",
        ghost: "text-[#1b1b1b] hover:bg-[#1b1b1b]/5"
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-6",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
export { Button }
