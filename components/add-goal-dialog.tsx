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
import { Plus, Target, DollarSign, Users, Eye, AlertCircle, CheckCircle } from "lucide-react"
import { db } from "../lib/database"

const goalCategories = [
  { value: "Financial", label: "Financial", icon: DollarSign, description: "Revenue, profit, savings goals" },
  { value: "Audience", label: "Audience", icon: Users, description: "Subscribers, followers, community" },
  { value: "Products", label: "Products", icon: Target, description: "Launches, sales, features" },
  { value: "Social", label: "Social Media", icon: Eye, description: "Reach, engagement, views" },
]

const goalStatuses = [
  { value: "on-track", label: "On Track" },
  { value: "behind", label: "Behind Schedule" },
  { value: "at-risk", label: "At Risk" },
]

interface AddGoalDialogProps {
  onGoalAdded: () => void
}

export function AddGoalDialog({ onGoalAdded }: AddGoalDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    target: "",
    current: "",
    deadline: "",
    status: "on-track",
  })

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      target: "",
      current: "",
      deadline: "",
      status: "on-track",
    })
    setError("")
    setSuccess("")
  }

  const generateMilestones = (target: number, category: string) => {
    const milestones = []

    if (category === "Financial") {
      // Para metas financeiras, criar milestones em 25%, 50%, 75%, 100%
      milestones.push(
        { amount: Math.round(target * 0.25), completed: false },
        { amount: Math.round(target * 0.5), completed: false },
        { amount: Math.round(target * 0.75), completed: false },
        { amount: target, completed: false },
      )
    } else {
      // Para outras metas, criar milestones mais específicos
      const quarter = Math.round(target / 4)
      milestones.push(
        { amount: quarter, completed: false },
        { amount: quarter * 2, completed: false },
        { amount: quarter * 3, completed: false },
        { amount: target, completed: false },
      )
    }

    return milestones
  }

  const handleSubmit = async () => {
    setError("")
    setSuccess("")

    // Validações
    if (!formData.title.trim()) {
      setError("Goal title is required")
      return
    }

    if (!formData.category) {
      setError("Please select a category")
      return
    }

    const targetNum = Number.parseFloat(formData.target)
    if (isNaN(targetNum) || targetNum <= 0) {
      setError("Please enter a valid target number")
      return
    }

    const currentNum = Number.parseFloat(formData.current || "0")
    if (isNaN(currentNum) || currentNum < 0) {
      setError("Please enter a valid current progress")
      return
    }

    if (currentNum > targetNum) {
      setError("Current progress cannot be greater than target")
      return
    }

    if (!formData.deadline) {
      setError("Please select a deadline")
      return
    }

    // Verificar se a data não é no passado
    const deadlineDate = new Date(formData.deadline)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (deadlineDate < today) {
      setError("Deadline cannot be in the past")
      return
    }

    setIsSubmitting(true)

    try {
      const milestones = generateMilestones(targetNum, formData.category)

      // Marcar milestones como completos baseado no progresso atual
      milestones.forEach((milestone) => {
        milestone.completed = currentNum >= milestone.amount
      })

      const newGoal = {
        title: formData.title.trim(),
        description: formData.description.trim() || `${formData.category} goal: ${formData.title}`,
        category: formData.category,
        target: targetNum,
        current: currentNum,
        deadline: formData.deadline,
        status: formData.status,
        icon: formData.category, // Será mapeado para o ícone correto
        milestones,
      }

      const savedGoal = db.addGoal(newGoal)

      setSuccess(`Goal "${savedGoal.title}" created successfully!`)

      // Aguardar um pouco para mostrar o sucesso
      setTimeout(() => {
        setOpen(false)
        resetForm()
        onGoalAdded() // Callback para atualizar a lista
      }, 1500)
    } catch (error) {
      console.error("Error creating goal:", error)
      setError("Failed to create goal. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedCategory = goalCategories.find((cat) => cat.value === formData.category)

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
        <Button className="bg-gradient-to-r from-purple-500 to-electric-500 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add New Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Target className="h-5 w-5 text-purple-600" />
            Create New Goal
          </DialogTitle>
          <DialogDescription>
            Set a new goal to track your progress and achieve your entrepreneurial dreams.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Goal Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Reach $100K in Revenue"
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
                {goalCategories.map((category) => (
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

          {/* Target and Current */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">Target {formData.category === "Financial" ? "(USD)" : "Amount"} *</Label>
              <Input
                id="target"
                type="number"
                placeholder="100000"
                value={formData.target}
                onChange={(e) => setFormData((prev) => ({ ...prev, target: e.target.value }))}
                min="1"
                step={formData.category === "Financial" ? "0.01" : "1"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current">Current Progress {formData.category === "Financial" ? "(USD)" : ""}</Label>
              <Input
                id="current"
                type="number"
                placeholder="0"
                value={formData.current}
                onChange={(e) => setFormData((prev) => ({ ...prev, current: e.target.value }))}
                min="0"
                step={formData.category === "Financial" ? "0.01" : "1"}
              />
            </div>
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline *</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe your goal and how you plan to achieve it..."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Status */}
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
                {goalStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          {selectedCategory && formData.target && (
            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-electric-50 border border-purple-200">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <selectedCategory.icon className="h-4 w-4" />
                Goal Preview
              </h4>
              <div className="text-sm space-y-1">
                <div>
                  <strong>Target:</strong> {Number(formData.target || 0).toLocaleString()}
                  {formData.category === "Financial" ? " USD" : ""}
                </div>
                <div>
                  <strong>Current:</strong> {Number(formData.current || 0).toLocaleString()}
                  {formData.category === "Financial" ? " USD" : ""}
                </div>
                <div>
                  <strong>Progress:</strong>{" "}
                  {formData.target ? Math.round((Number(formData.current || 0) / Number(formData.target)) * 100) : 0}%
                </div>
                {formData.deadline && (
                  <div>
                    <strong>Deadline:</strong> {new Date(formData.deadline).toLocaleDateString()}
                  </div>
                )}
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
            className="bg-gradient-to-r from-purple-500 to-electric-500 text-white"
          >
            {isSubmitting ? "Creating..." : "Create Goal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
