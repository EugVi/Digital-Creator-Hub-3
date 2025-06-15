"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
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
import { Plus, Store, Users, AlertCircle, CheckCircle, ShoppingCart, Instagram, Youtube, Music } from "lucide-react"
import { db } from "../lib/database"

const salesPlatforms = [
  { value: "Whop", label: "Whop", icon: Store, description: "Digital products marketplace" },
  { value: "Gumroad", label: "Gumroad", icon: ShoppingCart, description: "Creator commerce platform" },
  { value: "Payhip", label: "Payhip", icon: Store, description: "Digital product sales" },
  { value: "Etsy", label: "Etsy", icon: Store, description: "Creative marketplace" },
  { value: "Shopify", label: "Shopify", icon: ShoppingCart, description: "E-commerce platform" },
  { value: "Other Sales", label: "Other Sales Platform", icon: Store, description: "Custom sales platform" },
]

const socialPlatforms = [
  { value: "Instagram", label: "Instagram", icon: Instagram, description: "Photo & video sharing" },
  { value: "TikTok", label: "TikTok", icon: Music, description: "Short-form videos" },
  { value: "YouTube", label: "YouTube", icon: Youtube, description: "Video content platform" },
  { value: "Twitter", label: "Twitter/X", icon: Users, description: "Social networking" },
  { value: "LinkedIn", label: "LinkedIn", icon: Users, description: "Professional network" },
  { value: "Facebook", label: "Facebook", icon: Users, description: "Social media platform" },
  { value: "Pinterest", label: "Pinterest", icon: Users, description: "Visual discovery" },
  { value: "Other Social", label: "Other Social Platform", icon: Users, description: "Custom social platform" },
]

interface AddAccountDialogProps {
  onAccountAdded: () => void
  defaultType?: "sales" | "social"
}

export function AddAccountDialog({ onAccountAdded, defaultType }: AddAccountDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    type: defaultType || ("sales" as "sales" | "social"),
    platform: "",
    username: "",
    email: "",
    url: "",
    isActive: true,
    earnings: "",
    followers: "",
    password: "",
    notes: "",
  })

  const resetForm = () => {
    setFormData({
      name: "",
      type: defaultType || "sales",
      platform: "",
      username: "",
      email: "",
      url: "",
      isActive: true,
      earnings: "",
      followers: "",
      password: "",
      notes: "",
    })
    setError("")
    setSuccess("")
  }

  const handleSubmit = async () => {
    setError("")
    setSuccess("")

    // Validações
    if (!formData.name.trim()) {
      setError("Account name is required")
      return
    }

    if (!formData.platform) {
      setError("Please select a platform")
      return
    }

    if (!formData.username.trim()) {
      setError("Username is required")
      return
    }

    if (!formData.email.trim()) {
      setError("Email is required")
      return
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)

    try {
      const newAccount = {
        name: formData.name.trim(),
        type: formData.type,
        platform: formData.platform,
        username: formData.username.trim(),
        email: formData.email.trim(),
        url: formData.url.trim() || undefined,
        isActive: formData.isActive,
        earnings: formData.earnings ? Number.parseFloat(formData.earnings) : undefined,
        followers: formData.followers ? Number.parseInt(formData.followers) : undefined,
        password: formData.password.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        lastUpdate: new Date().toISOString(),
      }

      const savedAccount = db.addAccount(newAccount)

      setSuccess(`Account "${savedAccount.name}" created successfully!`)

      // Aguardar um pouco para mostrar o sucesso
      setTimeout(() => {
        setOpen(false)
        resetForm()
        onAccountAdded() // Callback para atualizar a lista
      }, 1500)
    } catch (error) {
      console.error("Error creating account:", error)
      setError("Failed to create account. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const availablePlatforms = formData.type === "sales" ? salesPlatforms : socialPlatforms
  const selectedPlatform = availablePlatforms.find((p) => p.value === formData.platform)

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
          Add Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {formData.type === "sales" ? (
              <Store className="h-5 w-5 text-purple-600" />
            ) : (
              <Users className="h-5 w-5 text-electric-600" />
            )}
            Add New {formData.type === "sales" ? "Sales" : "Social"} Account
          </DialogTitle>
          <DialogDescription>
            Add a new {formData.type === "sales" ? "sales platform" : "social media"} account to track your digital
            presence.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Account Type */}
          <div className="space-y-2">
            <Label>Account Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "sales" | "social") => {
                setFormData((prev) => ({ ...prev, type: value, platform: "" }))
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    Sales Platform
                  </div>
                </SelectItem>
                <SelectItem value="social">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Social Media
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Platform */}
          <div className="space-y-2">
            <Label>Platform *</Label>
            <Select
              value={formData.platform}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, platform: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a platform" />
              </SelectTrigger>
              <SelectContent>
                {availablePlatforms.map((platform) => (
                  <SelectItem key={platform.value} value={platform.value}>
                    <div className="flex items-center gap-2">
                      <platform.icon className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{platform.label}</div>
                        <div className="text-xs text-gray-500">{platform.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Account Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Account Name *</Label>
            <Input
              id="name"
              placeholder="e.g., My Business Whop Store"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>

          {/* Username and Email */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                placeholder="@username"
                value={formData.username}
                onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="account@example.com"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>

          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="url">Profile/Store URL (Optional)</Label>
            <Input
              id="url"
              placeholder="https://..."
              value={formData.url}
              onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
            />
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4">
            {formData.type === "sales" ? (
              <div className="space-y-2">
                <Label htmlFor="earnings">Current Earnings (USD)</Label>
                <Input
                  id="earnings"
                  type="number"
                  placeholder="1500.00"
                  value={formData.earnings}
                  onChange={(e) => setFormData((prev) => ({ ...prev, earnings: e.target.value }))}
                  min="0"
                  step="0.01"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="followers">Followers/Subscribers</Label>
                <Input
                  id="followers"
                  type="number"
                  placeholder="10000"
                  value={formData.followers}
                  onChange={(e) => setFormData((prev) => ({ ...prev, followers: e.target.value }))}
                  min="0"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Password (Optional)</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
              />
              <p className="text-xs text-gray-500">Will be protected by access code</p>
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Account Status</Label>
              <p className="text-sm text-gray-500">Is this account currently active?</p>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about this account..."
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Preview */}
          {selectedPlatform && formData.name && formData.username && (
            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-electric-50 border border-purple-200">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <selectedPlatform.icon className="h-4 w-4" />
                Account Preview
              </h4>
              <div className="text-sm space-y-1">
                <div>
                  <strong>Name:</strong> {formData.name}
                </div>
                <div>
                  <strong>Platform:</strong> {formData.platform}
                </div>
                <div>
                  <strong>Username:</strong> {formData.username}
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  <span className={formData.isActive ? "text-green-600" : "text-red-600"}>
                    {formData.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                {formData.type === "sales" && formData.earnings && (
                  <div>
                    <strong>Earnings:</strong> ${Number(formData.earnings).toLocaleString()}
                  </div>
                )}
                {formData.type === "social" && formData.followers && (
                  <div>
                    <strong>Followers:</strong> {Number(formData.followers).toLocaleString()}
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
            {isSubmitting ? "Creating..." : "Create Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
