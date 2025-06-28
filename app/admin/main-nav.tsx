'use client'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  {
    title: 'Admin',
    href: '/admin/overview'
  },
  {
    title: 'Products',
    href: '/admin/products'
  },
  {
    title: 'Orders',
    href: '/admin/orders'
  },
  {
    title: 'Users',
    href: '/admin/users'
  }
]

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname()
  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      {links.map((item) => (
        <Link
          href={item.href}
          key={item.title}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname.includes(item.href) ? '' : 'text-muted-foreground'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}

export default MainNav
