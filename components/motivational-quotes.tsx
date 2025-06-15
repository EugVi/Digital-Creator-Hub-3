"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RefreshCw, Target, Calendar } from "lucide-react"
import { db } from "../lib/database"
import { useTranslations } from "../lib/translations"

const motivationalQuotes = {
  en: [
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The way to get started is to quit talking and begin doing.",
    "Don't be afraid to give up the good to go for the great.",
    "Innovation distinguishes between a leader and a follower.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "It is during our darkest moments that we must focus to see the light.",
    "Success is walking from failure to failure with no loss of enthusiasm.",
    "The only impossible journey is the one you never begin.",
    "In the middle of difficulty lies opportunity.",
    "Believe you can and you're halfway there.",
  ],
  pt: [
    "O sucesso não é final, o fracasso não é fatal: é a coragem de continuar que conta.",
    "A maneira de começar é parar de falar e começar a fazer.",
    "Não tenha medo de desistir do bom para buscar o excelente.",
    "A inovação distingue um líder de um seguidor.",
    "O futuro pertence àqueles que acreditam na beleza de seus sonhos.",
    "É durante nossos momentos mais sombrios que devemos focar para ver a luz.",
    "Sucesso é caminhar de fracasso em fracasso sem perder o entusiasmo.",
    "A única jornada impossível é aquela que você nunca começa.",
    "No meio da dificuldade está a oportunidade.",
    "Acredite que você pode e você já está na metade do caminho.",
  ],
}

export function MotivationalQuotes() {
  const [currentQuote, setCurrentQuote] = useState("")
  const [dailyProgress, setDailyProgress] = useState(0)
  const [taskStats, setTaskStats] = useState({ completed: 0, total: 0 })
  const language = db.getCurrentLanguage()
  const t = useTranslations(language)

  useEffect(() => {
    loadQuoteAndProgress()
  }, [language])

  const loadQuoteAndProgress = () => {
    // Carregar frase motivacional
    const quotes = motivationalQuotes[language]
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
    setCurrentQuote(randomQuote)

    // Carregar progresso das tarefas do dia
    const progress = db.getDailyTaskProgress()
    setDailyProgress(progress)

    // Carregar estatísticas das tarefas
    const stats = db.getTaskStats()
    setTaskStats({
      completed: stats.completedToday,
      total: stats.todayTasks,
    })
  }

  const getMotivationalMessage = () => {
    if (language === "pt") {
      if (dailyProgress === 100) {
        return "🎉 Parabéns! Você completou todas as tarefas de hoje!"
      } else if (dailyProgress >= 75) {
        return `🔥 Excelente! Você está a ${100 - dailyProgress}% da sua meta diária.`
      } else if (dailyProgress >= 50) {
        return `💪 Continue assim! Você está a ${100 - dailyProgress}% da sua meta diária.`
      } else if (dailyProgress > 0) {
        return `🚀 Bom começo! Você está a ${100 - dailyProgress}% da sua meta diária.`
      } else {
        return "🌟 Comece seu dia completando suas primeiras tarefas!"
      }
    } else {
      if (dailyProgress === 100) {
        return "🎉 Congratulations! You've completed all today's tasks!"
      } else if (dailyProgress >= 75) {
        return `🔥 Excellent! You're ${100 - dailyProgress}% away from your daily target.`
      } else if (dailyProgress >= 50) {
        return `💪 Keep going! You're ${100 - dailyProgress}% away from your daily target.`
      } else if (dailyProgress > 0) {
        return `🚀 Good start! You're ${100 - dailyProgress}% away from your daily target.`
      } else {
        return "🌟 Start your day by completing your first tasks!"
      }
    }
  }

  const getProgressColor = () => {
    if (dailyProgress >= 75) return "bg-green-500"
    if (dailyProgress >= 50) return "bg-yellow-500"
    if (dailyProgress >= 25) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-electric-500">
              <Target className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-display font-semibold text-lg">
              {language === "pt" ? "Motivação Diária" : "Daily Motivation"}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadQuoteAndProgress}
            className="hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Daily Goal Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">
                {language === "pt" ? "Progresso da Meta Diária" : "Daily Goal Progress"}
              </span>
            </div>
            <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
              {taskStats.completed}/{taskStats.total} {language === "pt" ? "tarefas" : "tasks"}
            </span>
          </div>

          <div className="space-y-2">
            <Progress value={dailyProgress} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>0%</span>
              <span className="font-medium">{dailyProgress}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-electric-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-100 dark:border-purple-800">
          <p className="text-sm font-medium text-purple-800 dark:text-purple-200 text-center">
            {getMotivationalMessage()}
          </p>
        </div>

        {/* Motivational Quote */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-electric-500 rounded-full"></div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {language === "pt" ? "Frase Inspiradora" : "Inspirational Quote"}
            </span>
          </div>
          <blockquote className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
            "{currentQuote}"
          </blockquote>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center pt-2">
          <div className={`h-2 w-16 rounded-full ${getProgressColor()} opacity-60`}></div>
        </div>
      </CardContent>
    </Card>
  )
}
