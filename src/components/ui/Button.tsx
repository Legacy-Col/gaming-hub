import { type ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'outline' | 'gold'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
}

const sizeMap: Record<Size, string> = {
  sm: 'text-sm px-4 py-2',
  md: 'text-base px-6 py-2.5',
  lg: 'text-xl px-10 py-3.5',
}

const variantMap: Record<Variant, string> = {
  primary: 'btn-primary',
  outline: 'btn-outline',
  gold: 'btn-gold',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth, className = '', children, ...props }, ref) => (
    <button
      ref={ref}
      className={['font-bebas tracking-widest', variantMap[variant], sizeMap[size], fullWidth ? 'w-full' : '', className].join(' ')}
      {...props}
    >
      {children}
    </button>
  ),
)
Button.displayName = 'Button'
