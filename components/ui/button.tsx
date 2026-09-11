import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Note: no whitespace-nowrap — our CTAs are full sentences, not single words,
  // and nowrap text inside a grid/flex child forces the child's intrinsic
  // (min-width: auto) size past its container on narrow viewports.
  "inline-flex items-center justify-center gap-2 text-center rounded-md text-sm font-semibold font-display transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-md hover:bg-raven-purple3 hover:shadow-lg',
        onGradient: 'bg-white text-primary shadow-lg hover:bg-gray-100',
        outline: 'border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground',
        outlineOnGradient: 'border-2 border-white/70 bg-transparent text-white hover:bg-white/10',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        // min-h (not h-) + py so a long CTA sentence can wrap to 2 lines on
        // narrow viewports without clipping.
        default: 'min-h-12 px-6 py-3 text-base',
        sm: 'min-h-10 px-4 py-2 text-sm',
        lg: 'min-h-14 px-8 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
