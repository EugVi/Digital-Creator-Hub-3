"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, ExternalLink, Plus } from "lucide-react"
import { db } from "../lib/database"
import Link from "next/link"

export function AffiliateTracker() {
  const [affiliateData, setAffiliateData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAffiliateData()
  }, [])

  const loadAffiliateData = () => {
    try {
      const realData = db.getAffiliateTrackerData()

      // Se não há dados reais, usar dados de exemplo
      if (realData.length === 0) {
        setAffiliateData([
          { name: "Add Your Sales Platforms", earnings: 0, target: 5000, growth: 0, isPlaceholder: true },
        ])
      } else {
        setAffiliateData(realData)
      }
    } catch (error) {
      console.error("Erro ao carregar dados de afiliados:", error)
      setAffiliateData([])
    } finally {
      setIsLoading(false)
    }
  }

  const totalEarnings = affiliateData.reduce((sum, item) => sum + (item.earnings || 0), 0)
  const totalTarget = affiliateData.reduce((sum, item) => sum + (item.target || 0), 0)
  const overallProgress = totalTarget > 0 ? (totalEarnings / totalTarget) * 100 : 0

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-electric-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-display">
            <div className="p-2 rounded-lg bg-gradient-to-br from-electric-500 to-purple-500">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            Affiliate Earnings Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-500"></div>
          <span className="ml-2 text-gray-600">Loading earnings...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-electric-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-display">
          <div className="p-2 rounded-lg bg-gradient-to-br from-electric-500 to-purple-500">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          Affiliate Earnings Tracker
          <Link href="/accounts" className="ml-auto">
            <Button variant="ghost" size="sm" className="text-xs">
              <ExternalLink className="h-3 w-3 mr-1" />
              Manage
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {affiliateData.length > 0 && !affiliateData[0].isPlaceholder ? (
          <>
            <div className="p-4 rounded-lg bg-white/80 backdrop-blur-sm border border-electric-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Total Progress</span>
                <span className="text-sm font-bold text-gray-900">
                  ${totalEarnings.toLocaleString()} / ${totalTarget.toLocaleString()}
                </span>
              </div>
              <Progress value={overallProgress} className="h-3 mb-2" />
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{overallProgress.toFixed(1)}% Complete</span>
                <span>${(totalTarget - totalEarnings).toLocaleString()} remaining</span>
              </div>
            </div>

            <div className="space-y-3">
              {affiliateData.map((affiliate, index) => {
                const progress = affiliate.target > 0 ? (affiliate.earnings / affiliate.target) * 100 : 0
                return (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-100 hover:bg-white/80 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{affiliate.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            affiliate.growth > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {affiliate.growth > 0 ? "+" : ""}
                          {affiliate.growth.toFixed(1)}%
                        </Badge>
                        <span className="text-xs font-semibold text-gray-900">
                          ${affiliate.earnings.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          // Empty State
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Sales Platforms Connected</h3>
            <p className="text-gray-500 mb-4 text-sm">
              Add your sales platforms in the Accounts page to see real earnings data here.
            </p>
            <Link href="/accounts">
              <Button className="bg-gradient-to-r from-electric-500 to-purple-500 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Sales Platform
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
