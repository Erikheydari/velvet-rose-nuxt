import { cva, type VariantProps } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  'inline-flex items-center cursor-pointer leading-none justify-center gap-2 whitespace-nowrap font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*=\'size-\'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border border-primary text-primary shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-primary dark:hover:bg-input/50 [&_svg]:stroke-primary',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-primary dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
        tonal: 'bg-secondary/40 text-primary hover:bg-secondary/20',
        tonalDestructive: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
      },
      size: {
        default: 'h-10 px-4 pt-1.5 pb-2 has-[>svg]:px-3 text-base rounded-full',
        sm: 'h-9 rounded-full gap-1.5 px-3 pt-1.5 pb-2 has-[>svg]:px-2.5 text-sm',
        lg: 'h-12 rounded-full px-6 pb-2.5 pt-1  has-[>svg]:px-4 text-lg [&_svg]:size-5',
        icon: 'size-9 rounded-full',
        'icon-lg': 'size-12 [&_svg]:size-5 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
