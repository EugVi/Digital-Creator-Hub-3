"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutDashboard, Wrench, Target, Settings, Menu, X, DollarSign, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { db } from "../lib/database"
import { useTranslations } from "../lib/translations"
import { SyncStatus } from "./sync-status"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const language = db.getCurrentLanguage()
  const t = useTranslations(language)

  const navItems = [
    { name: t.dashboard, icon: LayoutDashboard, href: "/", active: false },
    { name: t.tools, icon: Wrench, href: "/tools", active: false },
    { name: t.goals, icon: Target, href: "/goals", active: false },
    { name: t.earnings, icon: DollarSign, href: "/earnings", active: false },
    { name: t.accounts, icon: Users, href: "/accounts", active: false },
    { name: t.settings, icon: Settings, href: "/settings", active: false },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-electric-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">DC</span>
              </div>
              <span className="font-display font-bold text-xl bg-gradient-to-r from-purple-600 to-electric-600 bg-clip-text text-transparent">
                Digital Creator Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`relative ${
                      isActive
                        ? "bg-gradient-to-r from-purple-500 to-electric-500 text-white shadow-lg"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                    )}
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <SyncStatus />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-electric-500 text-white">
                      {db.getCurrentUser()?.displayName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{db.getCurrentUser()?.displayName || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      @{db.getCurrentUser()?.username || "user"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>{language === "pt" ? "Perfil" : "Profile"}</DropdownMenuItem>
                <DropdownMenuItem>{language === "pt" ? "Configurações" : "Settings"}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>{language === "pt" ? "Sair" : "Log out"}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white dark:bg-gray-900 py-4 animate-slide-in transition-colors duration-300">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`justify-start w-full ${
                        isActive
                          ? "bg-gradient-to-r from-purple-500 to-electric-500 text-white"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
