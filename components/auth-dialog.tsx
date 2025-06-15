"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, LogIn, UserPlus, AlertCircle, CheckCircle, Cloud, CloudOff } from "lucide-react"
import { db } from "../lib/database"
import { syncService } from "../lib/sync-service"
import { useTranslations } from "../lib/translations"

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAuthSuccess: () => void
  language: "en" | "pt"
}

export function AuthDialog({ open, onOpenChange, onAuthSuccess, language }: AuthDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState("login")

  const t = useTranslations(language)

  // Login state
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  })

  // Register state
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    enableSync: true,
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Validate inputs
      if (!loginData.username.trim()) {
        setError(language === "pt" ? "Nome de usuário é obrigatório" : "Username is required")
        return
      }

      if (!loginData.password) {
        setError(language === "pt" ? "Senha é obrigatória" : "Password is required")
        return
      }

      // Try to login
      const result = db.loginUser(loginData.username, loginData.password)

      if (result.success) {
        const user = db.getCurrentUser()

        // If user has sync enabled, try to sync from cloud
        if (user?.syncEnabled) {
          const syncStatus = syncService.getSyncStatus(user.username)
          if (syncStatus.enabled && syncStatus.binId) {
            try {
              const cloudData = await syncService.syncFromCloud(syncStatus.binId)
              if (cloudData) {
                // Import cloud data to local database
                console.log("📥 Importing cloud data...")
                // Here you would merge the cloud data with local data
              }
            } catch (syncError) {
              console.warn("Failed to sync from cloud:", syncError)
              // Continue with local data
            }
          }
        }

        setSuccess(language === "pt" ? "Login realizado com sucesso!" : "Login successful!")
        setTimeout(() => {
          onAuthSuccess()
          onOpenChange(false)
          resetForms()
        }, 1000)
      } else {
        const errorMessage =
          result.message === "User not found"
            ? language === "pt"
              ? "Usuário não encontrado"
              : "User not found"
            : result.message === "Invalid password"
              ? language === "pt"
                ? "Senha inválida"
                : "Invalid password"
              : result.message
        setError(errorMessage)
      }
    } catch (error) {
      console.error("Login error:", error)
      setError(language === "pt" ? "Erro interno. Tente novamente." : "Internal error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Validate inputs
      if (!registerData.username.trim()) {
        setError(language === "pt" ? "Nome de usuário é obrigatório" : "Username is required")
        return
      }

      if (registerData.username.length < 3) {
        setError(
          language === "pt"
            ? "Nome de usuário deve ter pelo menos 3 caracteres"
            : "Username must be at least 3 characters",
        )
        return
      }

      if (!registerData.displayName.trim()) {
        setError(language === "pt" ? "Nome de exibição é obrigatório" : "Display name is required")
        return
      }

      if (!registerData.password) {
        setError(language === "pt" ? "Senha é obrigatória" : "Password is required")
        return
      }

      if (registerData.password.length < 4) {
        setError(
          language === "pt" ? "Senha deve ter pelo menos 4 caracteres" : "Password must be at least 4 characters",
        )
        return
      }

      if (registerData.password !== registerData.confirmPassword) {
        setError(language === "pt" ? "Senhas não coincidem" : "Passwords do not match")
        return
      }

      // Try to register user
      const result = db.registerUser(registerData.username, registerData.password, registerData.displayName)

      if (result.success) {
        let syncBinId = null

        // If sync is enabled, create sync bin
        if (registerData.enableSync) {
          try {
            const initialData = {
              users: [],
              goals: db.getGoals(),
              tasks: db.getTasks(),
              accounts: db.getAccounts(),
              settings: db.getSettings(),
              lastSync: Date.now(),
            }

            syncBinId = await syncService.createUserBin(registerData.username, initialData)

            // Update user with sync info
            const user = db.getCurrentUser()
            if (user) {
              user.syncEnabled = true
              user.syncBinId = syncBinId
              db.updateCurrentUser(user)
            }

            console.log("✅ Sync enabled for new user")
          } catch (syncError) {
            console.warn("Failed to enable sync, continuing without it:", syncError)
            // Continue without sync - don't fail registration
          }
        }

        setSuccess(language === "pt" ? "Conta criada com sucesso!" : "Account created successfully!")

        // Auto-login after registration
        setTimeout(() => {
          const loginResult = db.loginUser(registerData.username, registerData.password)
          if (loginResult.success) {
            onAuthSuccess()
            onOpenChange(false)
            resetForms()
          }
        }, 1000)
      } else {
        const errorMessage =
          result.message === "Username already exists"
            ? language === "pt"
              ? "Nome de usuário já existe"
              : "Username already exists"
            : result.message
        setError(errorMessage)
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError(language === "pt" ? "Erro interno. Tente novamente." : "Internal error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForms = () => {
    setLoginData({ username: "", password: "" })
    setRegisterData({ username: "", password: "", confirmPassword: "", displayName: "", enableSync: true })
    setError("")
    setSuccess("")
    setActiveTab("login")
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setError("")
    setSuccess("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center justify-center">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            {language === "pt" ? "Perfis de Usuário" : "User Profiles"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              {language === "pt" ? "Entrar" : "Login"}
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              {language === "pt" ? "Registrar" : "Register"}
            </TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{language === "pt" ? "Entrar na Conta" : "Login to Account"}</CardTitle>
                <CardDescription>
                  {language === "pt"
                    ? "Entre com suas credenciais para acessar seus dados"
                    : "Enter your credentials to access your data"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">{language === "pt" ? "Nome de Usuário" : "Username"}</Label>
                    <Input
                      id="login-username"
                      type="text"
                      value={loginData.username}
                      onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      placeholder={language === "pt" ? "seu_usuario" : "your_username"}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">{language === "pt" ? "Senha" : "Password"}</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
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
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {language === "pt" ? "Entrando..." : "Logging in..."}
                      </>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4 mr-2" />
                        {language === "pt" ? "Entrar" : "Login"}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === "pt" ? "Criar Nova Conta" : "Create New Account"}
                </CardTitle>
                <CardDescription>
                  {language === "pt"
                    ? "Crie um novo perfil para começar a usar o Digital Creator Hub"
                    : "Create a new profile to start using Digital Creator Hub"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-displayName">
                      {language === "pt" ? "Nome de Exibição" : "Display Name"}
                    </Label>
                    <Input
                      id="register-displayName"
                      type="text"
                      value={registerData.displayName}
                      onChange={(e) => setRegisterData({ ...registerData, displayName: e.target.value })}
                      placeholder={language === "pt" ? "Seu Nome Completo" : "Your Full Name"}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-username">{language === "pt" ? "Nome de Usuário" : "Username"}</Label>
                    <Input
                      id="register-username"
                      type="text"
                      value={registerData.username}
                      onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                      placeholder={language === "pt" ? "seu_usuario" : "your_username"}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">{language === "pt" ? "Senha" : "Password"}</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirmPassword">
                      {language === "pt" ? "Confirmar Senha" : "Confirm Password"}
                    </Label>
                    <Input
                      id="register-confirmPassword"
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                    <Checkbox
                      id="enable-sync"
                      checked={registerData.enableSync}
                      onCheckedChange={(checked) =>
                        setRegisterData({ ...registerData, enableSync: checked as boolean })
                      }
                    />
                    <div className="flex items-center space-x-2">
                      {registerData.enableSync ? (
                        <Cloud className="h-4 w-4 text-blue-600" />
                      ) : (
                        <CloudOff className="h-4 w-4 text-gray-400" />
                      )}
                      <Label htmlFor="enable-sync" className="text-sm">
                        {language === "pt" ? "Ativar sincronização na nuvem" : "Enable cloud synchronization"}
                      </Label>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {registerData.enableSync
                      ? language === "pt"
                        ? "Seus dados serão sincronizados entre todos os seus dispositivos"
                        : "Your data will be synchronized across all your devices"
                      : language === "pt"
                        ? "Dados serão armazenados apenas neste dispositivo"
                        : "Data will only be stored on this device"}
                  </p>

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
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {language === "pt" ? "Criando..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        {language === "pt" ? "Criar Conta" : "Create Account"}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Existing users list (for development) */}
        {db.getAllUsers().length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {language === "pt" ? "Usuários existentes:" : "Existing users:"}
            </p>
            <div className="space-y-1">
              {db.getAllUsers().map((user) => (
                <div key={user.id} className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  @{user.username} - {user.displayName}
                  {user.syncEnabled && <Cloud className="h-3 w-3 text-blue-500" />}
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
