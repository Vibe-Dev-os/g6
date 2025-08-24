"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Film, Plus, Home } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/",
      label: "Watchlist",
      icon: Home,
    },
    {
      href: "/add",
      label: "Add Movie",
      icon: Plus,
    },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Film className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">Movie Watchlist</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "default" : "ghost"}
                  asChild
                  className="flex items-center gap-2 h-9 px-4"
                >
                  <Link href={item.href}>
                    <Icon className="h-4 w-4" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                </Button>
              )
            })}
            <ThemeToggle />
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className="h-8 px-3 text-xs flex items-center gap-1.5"
                >
                  <Link href={item.href}>
                    <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="font-medium whitespace-nowrap">{item.label}</span>
                  </Link>
                </Button>
              )
            })}
            <div className="ml-1">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
