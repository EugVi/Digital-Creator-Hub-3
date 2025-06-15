"use client"

import { useState, useEffect } from "react"
import { Navigation } from "../../components/navigation"
import { AddAccountDialog } from "../../components/add-account-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Store,
  Users,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  MoreHorizontal,
  ExternalLink,
  DollarSign,
  TrendingUp,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { db, type Account } from "../../lib/database"
import { useTranslations } from "../../lib/translations"

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showPasswords, setShowPasswords] = useState(false)
  const [language, setLanguage] = useState<"en" | "pt">("en")

  const t = useTranslations(language)

  useEffect(() => {
    // Carregar idioma atual
    const currentLanguage = db.getCurrentLanguage()
    setLanguage(currentLanguage)
    loadAccounts()
  }, [])

  const loadAccounts = () => {
    setIsLoading(true)
    try {
      const loadedAccounts = db.getAccounts()
      console.log("Contas carregadas:", loadedAccounts)
      setAccounts(loadedAccounts)
    } catch (error) {
      console.error("Erro ao carregar contas:", error)
      setAccounts([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = (accountId: string) => {
    const account = accounts.find((a) => a.id === accountId)
    const confirmMessage =
      language === "pt"
        ? `Tem certeza que deseja excluir "${account?.name}"? Esta ação não pode ser desfeita e afetará os dados do seu rastreador de afiliados.`
        : `Are you sure you want to delete "${account?.name}"? This action cannot be undone and will affect your affiliate tracker data.`

    if (confirm(confirmMessage)) {
      const success = db.deleteAccount(accountId)
      if (success) {
        loadAccounts() // Recarregar lista
      } else {
        const errorMessage =
          language === "pt" ? "Falha ao excluir conta. Tente novamente." : "Failed to delete account. Please try again."
        alert(errorMessage)
      }
    }
  }

  const handleToggleStatus = (accountId: string) => {
    const account = accounts.find((a) => a.id === accountId)
    if (!account) return

    const updatedAccount = db.updateAccount(accountId, { isActive: !account.isActive })
    if (updatedAccount) {
      loadAccounts() // Recarregar lista
    } else {
      const errorMessage =
        language === "pt"
          ? "Falha ao atualizar status da conta. Tente novamente."
          : "Failed to update account status. Please try again."
      alert(errorMessage)
    }
  }

  const handleUpdateEarnings = (accountId: string) => {
    const account = accounts.find((a) => a.id === accountId)
    if (!account) return

    const currentValue = account.type === "sales" ? account.earnings || 0 : account.followers || 0
    const label =
      account.type === "sales"
        ? language === "pt"
          ? "ganhos"
          : "earnings"
        : language === "pt"
          ? "seguidores"
          : "followers"

    const promptMessage =
      language === "pt"
        ? `Atualizar ${label} para "${account.name}"\nAtual: ${currentValue.toLocaleString()}\n\nDigite o novo valor de ${label}:`
        : `Update ${label} for "${account.name}"\nCurrent: ${currentValue.toLocaleString()}\n\nEnter new ${label}:`

    const newValue = prompt(promptMessage, currentValue.toString())

    if (newValue !== null) {
      const numValue = Number.parseFloat(newValue)
      if (!isNaN(numValue) && numValue >= 0) {
        const updates = account.type === "sales" ? { earnings: numValue } : { followers: Math.round(numValue) }
        const updatedAccount = db.updateAccount(accountId, updates)
        if (updatedAccount) {
          loadAccounts() // Recarregar lista
        } else {
          const errorMessage =
            language === "pt"
              ? "Falha ao atualizar conta. Tente novamente."
              : "Failed to update account. Please try again."
          alert(errorMessage)
        }
      } else {
        const errorMessage = language === "pt" ? "Por favor, digite um número válido." : "Please enter a valid number."
        alert(errorMessage)
      }
    }
  }

  const calculateStats = () => {
    const salesAccounts = accounts.filter((a) => a.type === "sales")
    const socialAccounts = accounts.filter((a) => a.type === "social")

    const totalEarnings = salesAccounts.reduce((sum, account) => sum + (account.earnings || 0), 0)
    const totalFollowers = socialAccounts.reduce((sum, account) => sum + (account.followers || 0), 0)
    const activeAccounts = accounts.filter((a) => a.isActive).length

    return {
      totalAccounts: accounts.length,
      activeAccounts,
      salesAccounts: salesAccounts.length,
      socialAccounts: socialAccounts.length,
      totalEarnings,
      totalFollowers,
    }
  }

  const stats = calculateStats()

  const salesAccounts = accounts.filter((a) => a.type === "sales")
  const socialAccounts = accounts.filter((a) => a.type === "social")

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t.loading}...</p>
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
            {t.accountManager}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">{t.manageAccounts}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-electric-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t.totalAccounts}</p>
                  <p className="text-2xl font-bold font-display text-purple-700">{stats.totalAccounts}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.activeAccounts} {t.active.toLowerCase()}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500">
                  <Users className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t.salesPlatforms}</p>
                  <p className="text-2xl font-bold font-display text-green-700">{stats.salesAccounts}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    ${stats.totalEarnings.toLocaleString()} {t.total.toLowerCase()}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-500">
                  <Store className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t.socialMedia}</p>
                  <p className="text-2xl font-bold font-display text-blue-700">{stats.socialAccounts}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.totalFollowers.toLocaleString()} {t.followers.toLowerCase()}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500">
                  <Users className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t.totalRevenue}</p>
                  <p className="text-2xl font-bold font-display text-orange-700">
                    ${stats.totalEarnings.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {language === "pt" ? "Das plataformas de vendas" : "From sales platforms"}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-orange-500">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Password Toggle Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {language === "pt" ? "Mostrar Senhas" : "Show Passwords"}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === "pt"
                    ? "Ative para visualizar as senhas das contas cadastradas"
                    : "Enable to view passwords of registered accounts"}
                </p>
              </div>
              <Switch checked={showPasswords} onCheckedChange={setShowPasswords} />
            </div>
          </CardContent>
        </Card>

        {/* Accounts Tabs */}
        <Tabs defaultValue="sales" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="sales" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                {t.salesPlatforms} ({salesAccounts.length})
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t.socialMedia} ({socialAccounts.length})
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <AddAccountDialog onAccountAdded={loadAccounts} defaultType="sales" />
              <AddAccountDialog onAccountAdded={loadAccounts} defaultType="social" />
            </div>
          </div>

          <TabsContent value="sales" className="space-y-4">
            {salesAccounts.length > 0 ? (
              <div className="grid gap-6 lg:grid-cols-2">
                {salesAccounts.map((account, index) => (
                  <Card
                    key={account.id}
                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in bg-gradient-to-br from-white to-gray-50"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                            <Store className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-display">{account.name}</CardTitle>
                            <p className="text-sm text-gray-600">{account.platform}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className={`${
                              account.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                          >
                            {account.isActive ? t.active : t.inactive}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleUpdateEarnings(account.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                {language === "pt" ? "Atualizar Ganhos" : "Update Earnings"}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleStatus(account.id)}>
                                <TrendingUp className="h-4 w-4 mr-2" />
                                {account.isActive
                                  ? language === "pt"
                                    ? "Desativar"
                                    : "Deactivate"
                                  : language === "pt"
                                    ? "Ativar"
                                    : "Activate"}
                              </DropdownMenuItem>
                              {account.url && (
                                <DropdownMenuItem onClick={() => window.open(account.url, "_blank")}>
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  {language === "pt" ? "Abrir Loja" : "Open Store"}
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleDeleteAccount(account.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {language === "pt" ? "Excluir Conta" : "Delete Account"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">{t.username}:</span>
                          <p className="font-medium">{account.username}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">{t.email}:</span>
                          <p className="font-medium">{account.email}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">
                            {language === "pt" ? "Ganhos Atuais" : "Current Earnings"}:
                          </span>
                          <p className="font-medium text-green-600">${(account.earnings || 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">
                            {language === "pt" ? "Última Atualização" : "Last Updated"}:
                          </span>
                          <p className="font-medium">{new Date(account.lastUpdate).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {account.password && (
                        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-blue-700">{t.password}:</span>
                            <div className="flex items-center gap-2">
                              {showPasswords ? (
                                <span className="text-sm font-mono bg-white px-2 py-1 rounded border">
                                  {account.password}
                                </span>
                              ) : (
                                <span className="text-sm text-gray-500">••••••••</span>
                              )}
                              <Button variant="ghost" size="sm" onClick={() => setShowPasswords(!showPasswords)}>
                                {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {account.notes && (
                        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                          <span className="text-sm font-medium text-gray-700">{t.notes}:</span>
                          <p className="text-sm text-gray-600 mt-1">{account.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white">
                <CardContent className="p-12 text-center">
                  <Store className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-xl font-display font-semibold text-gray-900 mb-4">
                    {language === "pt" ? "Nenhuma Plataforma de Vendas Ainda" : "No Sales Platforms Yet"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {language === "pt"
                      ? "Adicione sua primeira plataforma de vendas para começar a rastrear suas vendas de produtos digitais e ganhos."
                      : "Add your first sales platform to start tracking your digital product sales and earnings."}
                  </p>
                  <AddAccountDialog onAccountAdded={loadAccounts} defaultType="sales" />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            {socialAccounts.length > 0 ? (
              <div className="grid gap-6 lg:grid-cols-2">
                {socialAccounts.map((account, index) => (
                  <Card
                    key={account.id}
                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in bg-gradient-to-br from-white to-gray-50"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                            <Users className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-display">{account.name}</CardTitle>
                            <p className="text-sm text-gray-600">{account.platform}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className={`${
                              account.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                          >
                            {account.isActive ? t.active : t.inactive}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleUpdateEarnings(account.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                {language === "pt" ? "Atualizar Seguidores" : "Update Followers"}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleStatus(account.id)}>
                                <TrendingUp className="h-4 w-4 mr-2" />
                                {account.isActive
                                  ? language === "pt"
                                    ? "Desativar"
                                    : "Deactivate"
                                  : language === "pt"
                                    ? "Ativar"
                                    : "Activate"}
                              </DropdownMenuItem>
                              {account.url && (
                                <DropdownMenuItem onClick={() => window.open(account.url, "_blank")}>
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  {language === "pt" ? "Abrir Perfil" : "Open Profile"}
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleDeleteAccount(account.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {language === "pt" ? "Excluir Conta" : "Delete Account"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">{t.username}:</span>
                          <p className="font-medium">{account.username}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">{t.email}:</span>
                          <p className="font-medium">{account.email}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">{t.followers}:</span>
                          <p className="font-medium text-blue-600">{(account.followers || 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">
                            {language === "pt" ? "Última Atualização" : "Last Updated"}:
                          </span>
                          <p className="font-medium">{new Date(account.lastUpdate).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {account.password && (
                        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-blue-700">{t.password}:</span>
                            <div className="flex items-center gap-2">
                              {showPasswords ? (
                                <span className="text-sm font-mono bg-white px-2 py-1 rounded border">
                                  {account.password}
                                </span>
                              ) : (
                                <span className="text-sm text-gray-500">••••••••</span>
                              )}
                              <Button variant="ghost" size="sm" onClick={() => setShowPasswords(!showPasswords)}>
                                {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {account.notes && (
                        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                          <span className="text-sm font-medium text-gray-700">{t.notes}:</span>
                          <p className="text-sm text-gray-600 mt-1">{account.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white">
                <CardContent className="p-12 text-center">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-xl font-display font-semibold text-gray-900 mb-4">
                    {language === "pt" ? "Nenhuma Conta de Rede Social Ainda" : "No Social Media Accounts Yet"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {language === "pt"
                      ? "Adicione suas contas de redes sociais para rastrear o crescimento da sua audiência e gerenciar sua presença online."
                      : "Add your social media accounts to track your audience growth and manage your online presence."}
                  </p>
                  <AddAccountDialog onAccountAdded={loadAccounts} defaultType="social" />
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
