"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Calendar, Clock, AlertCircle, CheckCircle, Video, ImageIcon, FileText, Megaphone } from "lucide-react"
import { db } from "../lib/database"

const taskCategories = [
  { value: "Content Creation", label: "Content Creation", icon: Video, description: "Videos, posts, articles" },
  { value: "Design", label: "Design", icon: ImageIcon, description: "Graphics, thumbnails, banners" },
  { value: "Writing", label: "Writing", icon: FileText, description: "Scripts, blogs, captions" },
  { value: "Marketing", label: "Marketing", icon: Megaphone, description: "Promotion, ads, outreach" },
  { value: "Planning", label: "Planning", icon: Calendar, description: "Strategy, scheduling, research" },
  { value: "Other", label: "Other", icon: Clock, description: "General tasks" },
]

const priorities = [
  { value: "low", label: "Low Priority", color: "text-gray-600" },
  { value: "medium", label: "Medium Priority", color: "text-yellow-600" },
  { value: "high", label: "High Priority", color: "text-red-600" },
]

const statuses = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
]

interface AddTaskDialogProps {
  onTaskAdded: () => void
  defaultDate?: string
}

export function AddTaskDialog({ onTaskAdded, defaultDate }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const today = new Date().toISOString().split("T")[0]

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    status: "pending",
    time: "",
    date: defaultDate || today,
  })

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      priority: "medium",
      status: "pending",
      time: "",
      date: defaultDate || today,
    })
    setError("")
    setSuccess("")
  }

  const handleSubmit = async () => {
    setError("")
    setSuccess("")

    // Validações
    if (!formData.title.trim()) {
      setError("Task title is required")
      return
    }

    if (!formData.category) {
      setError("Please select a category")
      return
    }

    if (!formData.time) {
      setError("Please select a time")
      return
    }

    if (!formData.date) {
      setError("Please select a date")
      return
    }

    // Verificar se a data não é muito no passado (mais de 7 dias)
    const taskDate = new Date(formData.date)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    if (taskDate < sevenDaysAgo) {
      setError("Task date cannot be more than 7 days in the past")
      return
    }

    setIsSubmitting(true)

    try {
      const newTask = {
        title: formData.title.trim(),
        description: formData.description.trim() || `${formData.category} task: ${formData.title}`,
        category: formData.category,
        priority: formData.priority as "low" | "medium" | "high",
        status: formData.status as "pending" | "in-progress" | "completed",
        time: formData.time,
        date: formData.date,
      }

      const savedTask = db.addTask(newTask)

      setSuccess(`Task "${savedTask.title}" created successfully!`)

      // Aguardar um pouco para mostrar o sucesso
      setTimeout(() => {
        setOpen(false)
        resetForm()
        onTaskAdded() // Callback para atualizar a lista
      }, 1500)
    } catch (error) {
      console.error("Error creating task:", error)
      setError("Failed to create task. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedCategory = taskCategories.find((cat) => cat.value === formData.category)

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) {
          resetForm()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-950 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-5 w-5 text-gray-600" />
            Add New Task
          </DialogTitle>
          <DialogDescription>Create a new task for your content calendar and stay organized.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Create YouTube video script"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {taskCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center gap-2">
                      <category.icon className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{category.label}</div>
                        <div className="text-xs text-gray-500">{category.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                min={new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
              />
            </div>
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <span className={priority.color}>{priority.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Initial Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add details about this task..."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Preview */}
          {selectedCategory && formData.title && formData.time && (
            <div className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                {selectedCategory.icon && <selectedCategory.icon className="h-4 w-4" />}
                Task Preview
              </h4>
              <div className="text-sm space-y-1">
                <div>
                  <strong>Title:</strong> {formData.title}
                </div>
                <div>
                  <strong>Time:</strong> {formData.time} on {new Date(formData.date).toLocaleDateString()}
                </div>
                <div>
                  <strong>Category:</strong> {formData.category}
                </div>
                <div>
                  <strong>Priority:</strong>{" "}
                  <span
                    className={
                      formData.priority === "high"
                        ? "text-red-600"
                        : formData.priority === "medium"
                          ? "text-yellow-600"
                          : "text-gray-600"
                    }
                  >
                    {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error/Success Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-gray-700 to-gray-900 text-white"
          >
            {isSubmitting ? "Creating..." : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
