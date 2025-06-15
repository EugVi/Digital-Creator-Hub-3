"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Sparkles, RefreshCw } from "lucide-react"

const productIdeas = [
  {
    title: "AI-Powered Email Templates",
    category: "SaaS",
    potential: "High",
    description: "Automated email sequences for different industries",
  },
  {
    title: "Social Media Scheduler Pro",
    category: "Tool",
    potential: "Medium",
    description: "Advanced scheduling with AI-generated captions",
  },
  {
    title: "Creator Analytics Dashboard",
    category: "Analytics",
    potential: "High",
    description: "Unified view of all social media metrics",
  },
  {
    title: "Digital Course Builder",
    category: "Education",
    potential: "High",
    description: "No-code platform for creating online courses",
  },
]

export function ProductIdeaGenerator() {
  const [currentIdea, setCurrentIdea] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateNewIdea = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setCurrentIdea((prev) => (prev + 1) % productIdeas.length)
      setIsGenerating(false)
    }, 1000)
  }

  const idea = productIdeas[currentIdea]

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-electric-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-display">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-electric-500">
            <Lightbulb className="h-4 w-4 text-white" />
          </div>
          Product Idea Generator
          <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-white/80 backdrop-blur-sm border border-purple-100">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{idea.title}</h3>
            <Badge
              variant="secondary"
              className={`${
                idea.potential === "High" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {idea.potential} Potential
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-3">{idea.description}</p>
          <Badge variant="outline" className="text-xs">
            {idea.category}
          </Badge>
        </div>

        <Button
          onClick={generateNewIdea}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-purple-500 to-electric-500 hover:from-purple-600 hover:to-electric-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate New Idea
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
