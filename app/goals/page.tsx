"use client"

import { useState, useEffect } from "react"
import { Navigation } from "../../components/navigation"
import { AddGoalDialog } from "../../components/add-goal-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Target,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Eye,
  CheckCircle,
  Clock,
  Flag,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { db, type Goal } from "../../lib/database"

const iconMap = {
  Financial: DollarSign,
  Audience: Users,
  Products: Target,
  Social: Eye,
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = () => {
    setIsLoading(true)
    try {
      const loadedGoals = db.getGoals()
      console.log("Goals carregadas:", loadedGoals)
      setGoals(loadedGoals)
    } catch (error) {
      console.error("Erro ao carregar goals:", error)
      setGoals([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteGoal = (goalId: string) => {
    if (confirm("Are you sure you want to delete this goal? This action cannot be undone.")) {
      const success = db.deleteGoal(goalId)
      if (success) {
        loadGoals() // Recarregar lista
      } else {
        alert("Failed to delete goal. Please try again.")
      }
    }
  }

  const handleUpdateProgress = (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId)
    if (!goal) return

    const newProgress = prompt(
      `Update progress for "${goal.title}"\nCurrent: ${goal.current.toLocaleString()}\nTarget: ${goal.target.toLocaleString()}\n\nEnter new progress:`,
      goal.current.toString(),
    )

    if (newProgress !== null) {
      const numProgress = Number.parseFloat(newProgress)
      if (!isNaN(numProgress) && numProgress >= 0) {
        const updatedGoal = db.updateGoalProgress(goalId, numProgress)
        if (updatedGoal) {
          loadGoals() // Recarregar lista
        } else {
          alert("Failed to update progress. Please try again.")
        }
      } else {
        alert("Please enter a valid number.")
      }
    }
  }

  const calculateQuickStats = () => {
    const completedGoals = goals.filter((goal) => goal.status === "completed").length
    const inProgressGoals = goals.filter((goal) => goal.status === "on-track" || goal.status === "behind").length

    let successRate = 0
    if (goals.length > 0) {
      successRate = Math.round((completedGoals / goals.length) * 100)
    }

    // Calcular dias até próximo milestone
    let daysToNextMilestone = 0
    let nextMilestoneGoal = ""

    for (const goal of goals) {
      const nextMilestone = goal.milestones.find((m) => !m.completed)
      if (nextMilestone) {
        const deadline = new Date(goal.deadline)
        const today = new Date()
        const diffTime = deadline.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays > 0 && (daysToNextMilestone === 0 || diffDays < daysToNextMilestone)) {
          daysToNextMilestone = diffDays
          nextMilestoneGoal = goal.title
        }
      }
    }

    return {
      completedGoals,
      inProgressGoals,
      successRate,
      daysToNextMilestone,
      nextMilestoneGoal,
    }
  }

  const stats = calculateQuickStats()

  const quickStats = [
    {
      label: "Goals Completed",
      value: stats.completedGoals.toString(),
      change: goals.length > 0 ? `${stats.completedGoals} of ${goals.length}` : "No goals yet",
      icon: CheckCircle,
    },
    {
      label: "In Progress",
      value: stats.inProgressGoals.toString(),
      change: stats.inProgressGoals > 0 ? "Active goals" : "Create your first goal",
      icon: Clock,
    },
    {
      label: "Success Rate",
      value: `${stats.successRate}%`,
      change: goals.length > 0 ? "Overall completion" : "Start tracking goals",
      icon: TrendingUp,
    },
    {
      label: "Days to Next Milestone",
      value: stats.daysToNextMilestone > 0 ? stats.daysToNextMilestone.toString() : "0",
      change: stats.nextMilestoneGoal || "No active milestones",
      icon: Calendar,
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your goals...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navigation />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-purple-600 via-electric-600 to-purple-600 bg-clip-text text-transparent">
            Your Goals 🎯
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {goals.length > 0
              ? "Track your progress and achieve your entrepreneurial dreams"
              : "Set your first goals and start building your digital empire"}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat, index) => (
            <Card
              key={stat.label}
              className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in ${
                goals.length === 0
                  ? "bg-gradient-to-br from-gray-50 to-gray-100"
                  : "bg-gradient-to-br from-white to-gray-50"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p
                      className={`text-2xl font-bold font-display ${
                        goals.length === 0 ? "text-gray-400" : "text-gray-900"
                      }`}
                    >
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      goals.length === 0 ? "bg-gray-200" : "bg-gradient-to-br from-purple-100 to-electric-100"
                    }`}
                  >
                    <stat.icon className={`h-5 w-5 ${goals.length === 0 ? "text-gray-400" : "text-purple-600"}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Goals Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-semibold text-gray-900">
              {goals.length > 0 ? "Active Goals" : "Your Goals"}
            </h2>
            <AddGoalDialog onGoalAdded={loadGoals} />
          </div>

          {goals.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {goals.map((goal, index) => {
                const progress = (goal.current / goal.target) * 100
                const completedMilestones = goal.milestones.filter((m) => m.completed).length
                const IconComponent = iconMap[goal.category as keyof typeof iconMap] || Target

                return (
                  <Card
                    key={goal.id}
                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in bg-gradient-to-br from-white to-gray-50"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-electric-500">
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-display">{goal.title}</CardTitle>
                            <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className={`${
                              goal.status === "on-track"
                                ? "bg-green-100 text-green-700"
                                : goal.status === "behind"
                                  ? "bg-red-100 text-red-700"
                                  : goal.status === "completed"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {goal.status === "on-track"
                              ? "On Track"
                              : goal.status === "behind"
                                ? "Behind"
                                : goal.status === "completed"
                                  ? "Completed"
                                  : "At Risk"}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleUpdateProgress(goal.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Update Progress
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteGoal(goal.id)} className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Goal
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">
                            {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
                            {goal.category === "Financial" && " USD"}
                          </span>
                        </div>
                        <Progress value={progress} className="h-3" />
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{progress.toFixed(1)}% Complete</span>
                          <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          <Flag className="h-4 w-4" />
                          Milestones ({completedMilestones}/{goal.milestones.length})
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {goal.milestones.map((milestone, idx) => (
                            <div
                              key={idx}
                              className={`p-2 rounded-lg border text-xs flex items-center gap-2 ${
                                milestone.completed
                                  ? "bg-green-50 border-green-200 text-green-700"
                                  : "bg-gray-50 border-gray-200 text-gray-600"
                              }`}
                            >
                              {milestone.completed ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <div className="h-3 w-3 rounded-full border-2 border-gray-300" />
                              )}
                              {milestone.amount.toLocaleString()}
                              {goal.category === "Financial" && "$"}
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full border-purple-200 hover:bg-purple-50 hover:border-purple-300"
                        onClick={() => handleUpdateProgress(goal.id)}
                      >
                        Update Progress
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            // Empty State
            <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white">
              <CardContent className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <Target className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-xl font-display font-semibold text-gray-900 mb-4">No Goals Set Yet</h3>
                  <p className="text-gray-600 mb-6">
                    Start your journey by setting your first goal. Whether it's financial targets, audience growth, or
                    product launches - every great achievement starts with a clear goal.
                  </p>
                  <AddGoalDialog onGoalAdded={loadGoals} />

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
                      <DollarSign className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                      <p className="font-medium text-gray-900">Financial Goals</p>
                      <p className="text-gray-600 text-xs">Revenue targets, savings goals</p>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                      <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                      <p className="font-medium text-gray-900">Audience Goals</p>
                      <p className="text-gray-600 text-xs">Subscribers, followers, reach</p>
                    </div>
                    <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                      <Eye className="h-6 w-6 text-green-500 mx-auto mb-2" />
                      <p className="font-medium text-gray-900">Product Goals</p>
                      <p className="text-gray-600 text-xs">Launches, sales, features</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
