"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AddTaskDialog } from "./add-task-dialog"
import { Calendar, Clock, CheckCircle, MoreHorizontal, Edit, Trash2, Play, Pause } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { db, type Task } from "../lib/database"

export function ContentCalendar() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = () => {
    setIsLoading(true)
    try {
      const todayTasks = db.getTodayTasks()
      console.log("Tarefas de hoje carregadas:", todayTasks)
      setTasks(todayTasks)
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error)
      setTasks([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleStatus = (taskId: string) => {
    const updatedTask = db.toggleTaskStatus(taskId)
    if (updatedTask) {
      loadTasks() // Recarregar lista
    } else {
      alert("Failed to update task status. Please try again.")
    }
  }

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      const success = db.deleteTask(taskId)
      if (success) {
        loadTasks() // Recarregar lista
      } else {
        alert("Failed to delete task. Please try again.")
      }
    }
  }

  const handleEditTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    const newTitle = prompt(`Edit task title:`, task.title)
    if (newTitle !== null && newTitle.trim() !== "") {
      const updatedTask = db.updateTask(taskId, { title: newTitle.trim() })
      if (updatedTask) {
        loadTasks() // Recarregar lista
      } else {
        alert("Failed to update task. Please try again.")
      }
    }
  }

  const calculateProgress = () => {
    if (tasks.length === 0) return 0
    const completedTasks = tasks.filter((task) => task.status === "completed").length
    return Math.round((completedTasks / tasks.length) * 100)
  }

  const completionRate = calculateProgress()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-3 w-3 text-white" />
      case "in-progress":
        return <Play className="h-3 w-3 text-white" />
      default:
        return <Clock className="h-3 w-3 text-white" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-yellow-500"
      default:
        return "bg-gray-300"
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 border-green-200"
      case "in-progress":
        return "bg-yellow-50 border-yellow-200"
      default:
        return "bg-white border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 text-red-700"
      case "medium":
        return "border-yellow-200 text-yellow-700"
      default:
        return "border-gray-200 text-gray-700"
    }
  }

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-display">
            <div className="p-2 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            Content Calendar
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
          <span className="ml-2 text-gray-600">Loading tasks...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-display">
          <div className="p-2 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900">
            <Calendar className="h-4 w-4 text-white" />
          </div>
          Content Calendar
          <Badge variant="secondary" className="ml-auto">
            {tasks.filter((t) => t.status === "completed").length}/{tasks.length} Done
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.length > 0 ? (
          <>
            {/* Progress Bar */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-100 to-electric-100 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Today's Progress</span>
                <span className="text-sm font-bold text-gray-900">{completionRate}%</span>
              </div>
              <div className="w-full bg-white/50 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-electric-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {tasks
                .sort((a, b) => {
                  // Ordenar por status (pending/in-progress primeiro) e depois por horário
                  if (a.status === "completed" && b.status !== "completed") return 1
                  if (a.status !== "completed" && b.status === "completed") return -1
                  return a.time.localeCompare(b.time)
                })
                .map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${getStatusBg(task.status)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <button
                          onClick={() => handleToggleStatus(task.id)}
                          className={`p-1 rounded-full ${getStatusColor(task.status)} hover:opacity-80 transition-opacity`}
                        >
                          {getStatusIcon(task.status)}
                        </button>
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${
                              task.status === "completed" ? "line-through text-gray-500" : "text-gray-900"
                            }`}
                          >
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-gray-500">{task.time}</p>
                            <Badge variant="outline" className="text-xs">
                              {task.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleToggleStatus(task.id)}>
                              {task.status === "completed" ? (
                                <>
                                  <Pause className="h-4 w-4 mr-2" />
                                  Mark as Pending
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark as Complete
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditTask(task.id)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Task
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteTask(task.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Task
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    {task.description && task.description !== `${task.category} task: ${task.title}` && (
                      <p className="text-xs text-gray-500 mt-2 ml-8">{task.description}</p>
                    )}
                  </div>
                ))}
            </div>

            <AddTaskDialog onTaskAdded={loadTasks} />
          </>
        ) : (
          // Empty State
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks for today</h3>
            <p className="text-gray-500 mb-4">Start organizing your day by adding your first task!</p>
            <AddTaskDialog onTaskAdded={loadTasks} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
