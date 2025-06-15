"use client"

import { useState, useEffect } from "react"
import { Navigation } from "../../components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Calendar, Plus, CheckCircle, AlertCircle, BarChart3, Wallet, Target, Award } from "lucide-react"
import { db, type DailyEarning, type MonthlyStats } from "../../lib/database"

const earningsSources = [
  "Product Sales",
  "Affiliate Commissions",
  "Course Sales",
  "Consulting",
  "Sponsorships",
  "Ad Revenue",
  "Subscription",
  "Other",
]

export default function EarningsPage() {
  const [amount, setAmount] = useState("")
  const [source, setSource] = useState("Product Sales")
  const [description, setDescription] = useState("")
  const [activeAffiliates, setActiveAffiliates] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const [todayEarnings, setTodayEarnings] = useState<DailyEarning[]>([])
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([])
  const [overview, setOverview] = useState({
    todayTotal: 0,
    monthTotal: 0,
    totalLockedSavings: 0,
    monthlyRevenue: 0,
    activeAffiliates: 0,
    todayCount: 0,
    monthCount: 0,
  })

  // Carregar dados ao inicializar
  useEffect(() => {
    loadEarningsData()
  }, [])

  const loadEarningsData = () => {
    setTodayEarnings(db.getTodayEarnings())
    setMonthlyStats(db.getMonthlyStats())
    setOverview(db.getEarningsOverview())
    setActiveAffiliates(db.getSettings().activeAffiliates.toString())
  }

  const handleAddEarning = async () => {
    if (!amount || !source) {
      setError("Please fill in amount and source")
      return
    }

    const numAmount = Number.parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount")
      return
    }

    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const today = new Date().toISOString().split("T")[0]

      const newEarning = db.addDailyEarning({
        date: today,
        amount: numAmount,
        source,
        description: description || `${source} earning`,
      })

      setSuccess(`Successfully added $${numAmount.toLocaleString()} to your earnings!`)
      setAmount("")
      setDescription("")
      loadEarningsData()
    } catch (error) {
      setError("Error adding earning. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateAffiliates = () => {
    const numAffiliates = Number.parseInt(activeAffiliates)
    if (isNaN(numAffiliates) || numAffiliates < 0) {
      setError("Please enter a valid number of affiliates")
      return
    }

    db.updateActiveAffiliates(numAffiliates)
    setSuccess(`Updated active affiliates to ${numAffiliates}`)
    loadEarningsData()
  }

  const getCurrentMonth = () => {
    return new Date().toISOString().substring(0, 7)
  }

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split("-")
    const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" })
  }

  const getBestMonth = () => {
    if (monthlyStats.length === 0) return null
    return monthlyStats.reduce((best, current) => (current.totalEarnings > best.totalEarnings ? current : best))
  }

  const bestMonth = getBestMonth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navigation />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 bg-clip-text text-transparent">
            Earnings Tracker 💰
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Track your daily earnings and watch your empire grow. All earnings automatically update your dashboard
            stats.
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Earnings</p>
                  <p className="text-2xl font-bold font-display text-green-700">
                    ${overview.todayTotal.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{overview.todayCount} transactions</p>
                </div>
                <div className="p-3 rounded-lg bg-green-500">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold font-display text-blue-700">
                    ${overview.monthTotal.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{overview.monthCount} transactions</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Locked Savings</p>
                  <p className="text-2xl font-bold font-display text-purple-700">
                    ${overview.totalLockedSavings.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Total accumulated</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Best Month</p>
                  <p className="text-2xl font-bold font-display text-orange-700">
                    ${overview.monthlyRevenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {bestMonth ? formatMonth(bestMonth.month) : "Current record"}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-orange-500">
                  <Award className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Add Earnings Form */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-display">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  Add Today's Earnings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Amount (USD) *</Label>
                    <Input
                      type="number"
                      placeholder="1500.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="mt-1"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <Label>Source *</Label>
                    <Select value={source} onValueChange={setSource}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {earningsSources.map((src) => (
                          <SelectItem key={src} value={src}>
                            {src}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Description (Optional)</Label>
                    <Textarea
                      placeholder="Course launch, affiliate commission from XYZ..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>

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

                <Button
                  onClick={handleAddEarning}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isSubmitting ? "Adding..." : "Add Earning"}
                </Button>

                {/* Affiliate Management */}
                <div className="pt-4 border-t border-green-200">
                  <Label>Active Affiliates</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="number"
                      placeholder="1247"
                      value={activeAffiliates}
                      onChange={(e) => setActiveAffiliates(e.target.value)}
                      min="0"
                    />
                    <Button onClick={handleUpdateAffiliates} variant="outline">
                      Update
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">This updates your dashboard stats</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Earnings History */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-display">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  Earnings History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="today" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="today">Today ({todayEarnings.length})</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly Stats</TabsTrigger>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                  </TabsList>

                  <TabsContent value="today" className="space-y-4">
                    {todayEarnings.length > 0 ? (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {todayEarnings.reverse().map((earning) => (
                          <div
                            key={earning.id}
                            className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">${earning.amount.toLocaleString()}</h4>
                              <Badge className="bg-green-100 text-green-700">{earning.source}</Badge>
                            </div>
                            <p className="text-sm text-gray-600">{earning.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(earning.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No earnings recorded for today yet.</p>
                        <p className="text-sm text-gray-400">Add your first earning using the form on the left!</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="monthly" className="space-y-4">
                    {monthlyStats.length > 0 ? (
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {monthlyStats.map((stats) => (
                          <div
                            key={stats.month}
                            className={`p-4 rounded-lg border ${
                              stats.totalEarnings === overview.monthlyRevenue
                                ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200"
                                : "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">{formatMonth(stats.month)}</h4>
                              <div className="flex items-center gap-2">
                                {stats.totalEarnings === overview.monthlyRevenue && (
                                  <Badge className="bg-yellow-100 text-yellow-700">
                                    <Award className="h-3 w-3 mr-1" />
                                    Best Month
                                  </Badge>
                                )}
                                <Badge className="bg-blue-100 text-blue-700">
                                  ${stats.totalEarnings.toLocaleString()}
                                </Badge>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Transactions:</span>
                                <p className="font-medium">{stats.dailyEarnings.length}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Active Affiliates:</span>
                                <p className="font-medium">{stats.activeAffiliates.toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No monthly statistics yet.</p>
                        <p className="text-sm text-gray-400">Start adding earnings to see monthly trends!</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200">
                        <h4 className="font-semibold text-gray-900 mb-2">Financial Overview</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Locked Savings:</span>
                            <span className="font-medium">${overview.totalLockedSavings.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Best Monthly Revenue:</span>
                            <span className="font-medium">${overview.monthlyRevenue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Current Month:</span>
                            <span className="font-medium">${overview.monthTotal.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200">
                        <h4 className="font-semibold text-gray-900 mb-2">Business Metrics</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Active Affiliates:</span>
                            <span className="font-medium">{overview.activeAffiliates.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Months Tracked:</span>
                            <span className="font-medium">{monthlyStats.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Transactions:</span>
                            <span className="font-medium">
                              {monthlyStats.reduce((sum, stats) => sum + stats.dailyEarnings.length, 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Alert className="border-blue-200 bg-blue-50">
                      <Target className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-700">
                        <strong>Dashboard Integration:</strong> Your earnings automatically update the Locked Savings,
                        Monthly Revenue (when you beat your record), and Active Affiliates shown on your main dashboard.
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
