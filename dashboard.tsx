"use client"

import { useState, useEffect } from "react"
import { Navigation } from "./components/navigation"
import { StatsOverview } from "./components/stats-overview"
import { ProductIdeaGenerator } from "./components/product-idea-generator"
import { AffiliateTracker } from "./components/affiliate-tracker"
import { ContentCalendar } from "./components/content-calendar"
import { MotivationalQuotes } from "./components/motivational-quotes"
import { db } from "./lib/database"
import { useTranslations } from "./lib/translations"

export default function Dashboard() {
  const [language, setLanguage] = useState<"en" | "pt">("en")

  useEffect(() => {
    // Carregar idioma atual
    const currentLanguage = db.getCurrentLanguage()
    setLanguage(currentLanguage)
  }, [])

  const t = useTranslations(language)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navigation />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-purple-600 via-electric-600 to-purple-600 bg-clip-text text-transparent">
            {t.welcomeBack}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">{t.digitalEmpire}</p>
        </div>

        {/* Stats Overview */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-semibold text-gray-900 flex items-center gap-2">
            {t.performanceOverview}
          </h2>
          <StatsOverview />
        </section>

        {/* Main Widgets Grid */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ProductIdeaGenerator />
          </div>
          <div className="lg:col-span-1">
            <AffiliateTracker />
          </div>
          <div className="lg:col-span-1">
            <MotivationalQuotes language={language} />
          </div>
        </section>

        {/* Content Calendar - Full Width */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-semibold text-gray-900 flex items-center gap-2">
            {t.todaysContentSchedule}
          </h2>
          <ContentCalendar />
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-gray-200 mt-12">
          <p className="text-gray-500 text-sm">
            {language === "pt"
              ? "© 2024 Digital Creator Hub. Construído para empreendedores ambiciosos."
              : "© 2024 Digital Creator Hub. Built for ambitious entrepreneurs."}
          </p>
        </footer>
      </main>
    </div>
  )
}
