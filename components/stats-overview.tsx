"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DollarSign, TrendingUp, Users, Target, ArrowUpRight, ArrowDownRight, Plus } from "lucide-react"
import { db } from "../lib/database"

export function StatsOverview() {
  const [stats, setStats] = useState({
    totalLockedSavings: 0,
    monthlyRevenue: 0,
    activeAffiliates: 0,
    goalProgress: 0,
  })

  const [changes, setChanges] = useState({
    savings: "0%",
    revenue: "0%",
    affiliates: "0%",
    goals: "0%",
  })

  const [isFirstTime, setIsFirstTime] = useState(true)

  useEffect(() => {
    // Carregar dados reais do banco
    const settings = db.getSettings()
    const overview = db.getEarningsOverview()
    const goals = db.getGoals()

    // Calcular progresso das metas
    let totalProgress = 0
    if (goals.length > 0) {
      const progressSum = goals.reduce((sum, goal) => {
        const progress = (goal.current / goal.target) * 100
        return sum + Math.min(progress, 100)
      }, 0)
      totalProgress = Math.round(progressSum / goals.length)
    }

    setStats({
      totalLockedSavings: settings.totalLockedSavings,
      monthlyRevenue: settings.monthlyRevenue,
      activeAffiliates: settings.activeAffiliates,
      goalProgress: totalProgress,
    })

    setIsFirstTime(overview.isFirstTime)

    // Calcular mudanças baseadas nos dados históricos
    const monthlyStats = db.getMonthlyStats()
    if (monthlyStats.length >= 2) {
      const currentMonth = monthlyStats[0]
      const previousMonth = monthlyStats[1]

      const revenueChange =
        previousMonth.totalEarnings > 0
          ? ((currentMonth.totalEarnings - previousMonth.totalEarnings) / previousMonth.totalEarnings) * 100
          : 0

      const affiliateChange =
        previousMonth.activeAffiliates > 0
          ? ((currentMonth.activeAffiliates - previousMonth.activeAffiliates) / previousMonth.activeAffiliates) * 100
          : 0

      setChanges({
        savings: settings.totalLockedSavings > 0 ? "+100%" : "0%", // Sempre positivo pois só acumula
        revenue: revenueChange !== 0 ? `${revenueChange > 0 ? "+" : ""}${revenueChange.toFixed(1)}%` : "0%",
        affiliates: affiliateChange !== 0 ? `${affiliateChange > 0 ? "+" : ""}${affiliateChange.toFixed(1)}%` : "0%",
        goals: totalProgress > 0 ? `${totalProgress}%` : "0%",
      })
    } else {
      // Se não há dados históricos, mostrar zeros
      setChanges({
        savings: settings.totalLockedSavings > 0 ? "New!" : "0%",
        revenue: settings.monthlyRevenue > 0 ? "New!" : "0%",
        affiliates: settings.activeAffiliates > 0 ? "New!" : "0%",
        goals: totalProgress > 0 ? "New!" : "0%",
      })
    }
  }, [])

  const statsData = [
    {
      title: "Locked Savings",
      value: stats.totalLockedSavings > 0 ? `$${stats.totalLockedSavings.toLocaleString()}` : "$0",
      change: changes.savings,
      changeType: (stats.totalLockedSavings > 0 ? "positive" : "neutral") as const,
      icon: DollarSign,
      description: stats.totalLockedSavings > 0 ? "Total secured funds" : "Start earning to see progress",
      isEmpty: stats.totalLockedSavings === 0,
    },
    {
      title: "Monthly Revenue",
      value: stats.monthlyRevenue > 0 ? `$${stats.monthlyRevenue.toLocaleString()}` : "$0",
      change: changes.revenue,
      changeType: (stats.monthlyRevenue > 0 ? "positive" : "neutral") as const,
      icon: TrendingUp,
      description: stats.monthlyRevenue > 0 ? "Best month record" : "No revenue recorded yet",
      isEmpty: stats.monthlyRevenue === 0,
    },
    {
      title: "Active Affiliates",
      value: stats.activeAffiliates > 0 ? stats.activeAffiliates.toLocaleString() : "0",
      change: changes.affiliates,
      changeType: (stats.activeAffiliates > 0 ? "positive" : "neutral") as const,
      icon: Users,
      description: stats.activeAffiliates > 0 ? "Current partners" : "Add affiliates in Earnings",
      isEmpty: stats.activeAffiliates === 0,
    },
    {
      title: "Goal Progress",
      value: `${stats.goalProgress}%`,
      change: changes.goals,
      changeType: (stats.goalProgress > 0 ? "positive" : "neutral") as const,
      icon: Target,
      description: stats.goalProgress > 0 ? "Average goal completion" : "Create goals to track progress",
      isEmpty: stats.goalProgress === 0,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <Card
          key={stat.title}
          className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in ${
            stat.isEmpty ? "bg-gradient-to-br from-gray-50 to-gray-100" : "bg-gradient-to-br from-white to-gray-50"
          }`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            <div
              className={`p-2 rounded-lg ${
                stat.isEmpty
                  ? "bg-gray-200"
                  : stat.changeType === "positive"
                    ? "bg-gradient-to-br from-purple-100 to-electric-100"
                    : "bg-gray-200"
              }`}
            >
              <stat.icon
                className={`h-4 w-4 ${
                  stat.isEmpty ? "text-gray-400" : stat.changeType === "positive" ? "text-purple-600" : "text-gray-500"
                }`}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div
                  className={`text-2xl font-bold font-display ${
                    stat.isEmpty
                      ? "text-gray-400"
                      : "bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                  }`}
                >
                  {stat.value}
                </div>
                <p className={`text-xs mt-1 ${stat.isEmpty ? "text-gray-400" : "text-gray-500"}`}>{stat.description}</p>
              </div>
              <Badge
                variant="secondary"
                className={`${
                  stat.isEmpty
                    ? "bg-gray-100 text-gray-500"
                    : stat.changeType === "positive"
                      ? "bg-green-100 text-green-700 hover:bg-green-100"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {stat.isEmpty ? (
                  <Plus className="h-3 w-3 mr-1" />
                ) : stat.changeType === "positive" ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                {stat.change}
              </Badge>
            </div>
            {stat.title === "Goal Progress" && (
              <Progress
                value={stats.goalProgress}
                className="mt-3 h-2"
                style={{
                  background:
                    stats.goalProgress > 0
                      ? "linear-gradient(to right, rgb(168, 85, 247), rgb(14, 165, 233))"
                      : "#e5e7eb",
                }}
              />
            )}
          </CardContent>
          <div
            className={`absolute top-0 right-0 w-20 h-20 rounded-full -translate-y-10 translate-x-10 ${
              stat.isEmpty
                ? "bg-gradient-to-br from-gray-300/10 to-gray-400/10"
                : "bg-gradient-to-br from-purple-500/10 to-electric-500/10"
            }`}
          />
        </Card>
      ))}
    </div>
  )
}
