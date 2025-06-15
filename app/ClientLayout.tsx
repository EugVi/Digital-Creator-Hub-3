"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { AuthDialog } from "../components/auth-dialog"
import { db } from "../lib/database"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, LogOut, Globe, Users, Bell, Search } from "lucide-react"
import { useTranslations } from "../lib/translations"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
})

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [language, setLanguage] = useState<"en" | "pt">("en")
  const [isLoading, setIsLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(3)

  const t = useTranslations(language)

  useEffect(() => {
    checkAuthStatus()

    // Aplicar dark mode no carregamento inicial
    const applyInitialDarkMode = () => {
      if (db.isUserLoggedIn()) {
        const darkMode = db.isDarkMode()
        setIsDarkMode(darkMode)
        applyDarkModeToDocument(darkMode)
      }
    }

    // Pequeno delay para garantir que o DOM está pronto
    setTimeout(applyInitialDarkMode, 100)
  }, [])

  // Aplicar dark mode ao documento
  const applyDarkModeToDocument = (darkMode: boolean) => {
    if (typeof document !== "undefined") {
      if (darkMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }

  const checkAuthStatus = () => {
    setIsLoading(true)
    try {
      const user = db.getCurrentUser()
      setCurrentUser(user)

      if (user) {
        // Carregar configurações do usuário
        const userLanguage = db.getCurrentLanguage()
        const userDarkMode = db.isDarkMode()

        setLanguage(userLanguage)
        setIsDarkMode(userDarkMode)

        // Aplicar dark mode
        applyDarkModeToDocument(userDarkMode)

        // Simular notificações (em uma app real, viria de uma API)
        setNotifications(Math.floor(Math.random() * 5) + 1)
      } else {
        // Se não há usuário logado, mostrar dialog de auth
        setIsAuthOpen(true)
      }
    } catch (error) {
      console.error("Erro ao verificar status de autenticação:", error)
      setIsAuthOpen(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAuthSuccess = () => {
    checkAuthStatus()
    setIsAuthOpen(false)

    // Aplicar configurações após login
    setTimeout(() => {
      const darkMode = db.isDarkMode()
      setIsDarkMode(darkMode)
      applyDarkModeToDocument(darkMode)
    }, 100)
  }

  const handleLogout = () => {
    const confirmMessage = language === "pt" ? "Tem certeza que deseja sair?" : "Are you sure you want to logout?"

    if (confirm(confirmMessage)) {
      db.logoutUser()
      setCurrentUser(null)
      setIsDarkMode(false)
      applyDarkModeToDocument(false)
      setIsAuthOpen(true)
    }
  }

  const handleLanguageChange = (newLanguage: "en" | "pt") => {
    setLanguage(newLanguage)
    if (db.isUserLoggedIn()) {
      db.updateLanguage(newLanguage)
    }
  }

  const handleSwitchUser = () => {
    setIsAuthOpen(true)
  }

  const handleSearch = () => {
    const searchTerm = prompt(language === "pt" ? "O que você está procurando?" : "What are you looking for?")

    if (searchTerm) {
      alert(
        language === "pt"
          ? `Procurando por: "${searchTerm}"\n\nEsta funcionalidade será implementada em breve!`
          : `Searching for: "${searchTerm}"\n\nThis feature will be implemented soon!`,
      )
    }
  }

  const handleNotifications = () => {
    const messages =
      language === "pt"
        ? [
            "🎯 Você tem 2 metas próximas do prazo",
            "📅 3 tarefas pendentes para hoje",
            "💰 Novo ganho registrado: $150",
            "🔔 Backup automático realizado com sucesso",
            "📊 Relatório semanal disponível",
          ]
        : [
            "🎯 You have 2 goals approaching deadline",
            "📅 3 pending tasks for today",
            "💰 New earning recorded: $150",
            "🔔 Automatic backup completed successfully",
            "📊 Weekly report available",
          ]

    const randomMessages = messages.slice(0, notifications).join("\n\n")

    alert((language === "pt" ? "🔔 Notificações:\n\n" : "🔔 Notifications:\n\n") + randomMessages)

    // Reduzir contador de notificações
    setNotifications(0)
  }

  if (isLoading) {
    return (
      <html lang={language}>
        <body className={`${inter.variable} ${poppins.variable} font-sans`}>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">{language === "pt" ? "Carregando..." : "Loading..."}</p>
            </div>
          </div>
        </body>
      </html>
    )
  }

  return (
    <html lang={language} className={isDarkMode ? "dark" : ""}>
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        {currentUser ? (
          <>
            {/* User Bar */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-2 transition-colors duration-300">
              <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-electric-500 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{currentUser.displayName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">@{currentUser.username}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {language === "pt" ? "Conectado" : "Connected"}
                  </Badge>
                </div>

                <div className="flex items-center gap-4">
                  {/* Search Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={handleSearch}
                    title={language === "pt" ? "Pesquisar" : "Search"}
                  >
                    <Search className="h-4 w-4" />
                  </Button>

                  {/* Notifications Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={handleNotifications}
                    title={language === "pt" ? "Notificações" : "Notifications"}
                  >
                    <Bell className="h-4 w-4" />
                    {notifications > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-electric-500 text-xs text-white">
                        {notifications}
                      </Badge>
                    )}
                  </Button>

                  {/* Language Selector */}
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Select value={language} onValueChange={handleLanguageChange}>
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">🇺🇸 English</SelectItem>
                        <SelectItem value="pt">🇧🇷 Português</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* User Actions */}
                  <Button variant="ghost" size="sm" onClick={handleSwitchUser}>
                    <Users className="h-4 w-4 mr-1" />
                    {language === "pt" ? "Trocar" : "Switch"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-1" />
                    {language === "pt" ? "Sair" : "Logout"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="min-h-[calc(100vh-60px)] bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
              {children}
            </div>
          </>
        ) : (
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center transition-colors duration-300">
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-purple-500 to-electric-500 flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-xl">DC</span>
                </div>
                <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-purple-600 to-electric-600 bg-clip-text text-transparent">
                  Digital Creator Hub
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                  {language === "pt"
                    ? "Gerencie seu império digital com múltiplos perfis de usuário"
                    : "Manage your digital empire with multiple user profiles"}
                </p>
              </div>

              {/* Language Selector for non-logged users */}
              <div className="flex items-center justify-center gap-2">
                <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">🇺🇸 English</SelectItem>
                    <SelectItem value="pt">🇧🇷 Português</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={() => setIsAuthOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-electric-500 text-white px-8 py-3"
              >
                <User className="h-4 w-4 mr-2" />
                {language === "pt" ? "Acessar Perfis" : "Access Profiles"}
              </Button>
            </div>
          </div>
        )}

        <AuthDialog
          open={isAuthOpen}
          onOpenChange={setIsAuthOpen}
          onAuthSuccess={handleAuthSuccess}
          language={language}
        />
      </body>
    </html>
  )
}
