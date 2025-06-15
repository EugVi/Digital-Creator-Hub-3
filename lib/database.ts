// Sistema de banco de dados local para persistência com suporte a múltiplos usuários e sincronização multi-dispositivo
import { syncService } from "./sync-service"

interface ProductIdea {
  id: string
  title: string
  niche: string
  potential: string
  difficulty: string
  estimatedRevenue: string
  description: string
  keywords: string[]
  topic: string
  region: string
  productType: string
  createdAt: string
}

interface TrendingProduct {
  id: string
  title: string
  category: string
  trend: string
  avgPrice: string
  competition: string
  demand: string
  region: string
  description: string
  topic: string
  productType: string
  createdAt: string
}

interface AffiliateKit {
  id: string
  title: string
  components: string[]
  commission: string
  conversionRate: string
  description: string
  productName: string
  topic: string
  createdAt: string
}

interface Goal {
  id: string
  title: string
  description: string
  category: string
  target: number
  current: number
  deadline: string
  status: string
  icon: string
  milestones: Array<{ amount: number; completed: boolean }>
  createdAt: string
}

interface Task {
  id: string
  title: string
  time: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  category: string
  description?: string
  date: string // YYYY-MM-DD
  createdAt: string
}

interface Account {
  id: string
  name: string
  type: "sales" | "social"
  platform: string
  username: string
  email: string
  url?: string
  isActive: boolean
  earnings?: number
  followers?: number
  lastUpdate: string
  password?: string // Será criptografada/protegida
  notes?: string
  createdAt: string
}

interface DailyEarning {
  id: string
  date: string // YYYY-MM-DD
  amount: number
  source: string
  description: string
  createdAt: string
}

interface MonthlyStats {
  month: string // YYYY-MM
  totalEarnings: number
  dailyEarnings: DailyEarning[]
  activeAffiliates: number
  createdAt: string
}

// Nova interface para usuários
interface User {
  id: string
  username: string
  password: string // Hash da senha
  displayName: string
  createdAt: string
  lastLogin: string
  cloudSync?: boolean // Indica se o usuário usa sincronização na nuvem
}

// Atualizar a interface UserData para incluir configurações mais detalhadas
interface UserData {
  productIdeas: ProductIdea[]
  trendingProducts: TrendingProduct[]
  affiliateKits: AffiliateKit[]
  goals: Goal[]
  dailyEarnings: DailyEarning[]
  monthlyStats: MonthlyStats[]
  tasks: Task[]
  accounts: Account[]
  settings: {
    // Profile Settings
    displayName: string
    email: string
    bio: string
    avatar?: string

    // Notifications
    emailNotifications: boolean
    pushNotifications: boolean
    goalReminders: boolean
    taskReminders: boolean
    weeklyReports: boolean

    // Appearance
    darkMode: boolean
    compactView: boolean
    animations: boolean
    language: "en" | "pt"

    // Privacy & Data
    dataAnalytics: boolean
    autoBackup: boolean
    cloudSync: boolean // Nova configuração para sincronização na nuvem

    // System
    region: string
    lastAccess: string
    totalLockedSavings: number
    monthlyRevenue: number
    activeAffiliates: number
    isFirstTime: boolean
    passwordProtectionEnabled: boolean
  }
}

// Interface para dados globais (usuários e configurações globais)
interface GlobalData {
  users: User[]
  currentUser: string | null
  globalSettings: {
    defaultLanguage: "en" | "pt"
    allowUserRegistration: boolean
    cloudSyncEnabled: boolean // Nova configuração global
  }
}

class LocalDatabase {
  private readonly STORAGE_KEY = "digital-creator-hub-data"
  private readonly GLOBAL_STORAGE_KEY = "digital-creator-hub-global"
  private readonly USERS_STORAGE_PREFIX = "digital-creator-hub-user-"

  // Hash simples para senhas (em produção, usar bcrypt ou similar)
  private hashPassword(password: string): string {
    let hash = 0
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return hash.toString(36)
  }

  // Verificar senha
  private verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash
  }

  // Obter dados globais
  private getGlobalData(): GlobalData {
    try {
      const stored = localStorage.getItem(this.GLOBAL_STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error("Erro ao carregar dados globais:", error)
    }

    const defaultGlobalData: GlobalData = {
      users: [],
      currentUser: null,
      globalSettings: {
        defaultLanguage: "en",
        allowUserRegistration: true,
        cloudSyncEnabled: true, // Habilitar sincronização por padrão
      },
    }

    this.saveGlobalData(defaultGlobalData)
    return defaultGlobalData
  }

  // Salvar dados globais
  private saveGlobalData(data: GlobalData): void {
    try {
      localStorage.setItem(this.GLOBAL_STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error("Erro ao salvar dados globais:", error)
    }
  }

  // Obter chave de storage do usuário
  private getUserStorageKey(userId: string): string {
    return `${this.USERS_STORAGE_PREFIX}${userId}`
  }

  // Inicializar dados COMPLETAMENTE ZERADOS para um usuário
  private getDefaultData(): UserData {
    return {
      productIdeas: [],
      trendingProducts: [],
      affiliateKits: [],
      goals: [],
      dailyEarnings: [],
      monthlyStats: [],
      tasks: [],
      accounts: [],
      settings: {
        // Profile Settings
        displayName: "",
        email: "",
        bio: "",
        avatar: undefined,

        // Notifications
        emailNotifications: true,
        pushNotifications: true,
        goalReminders: true,
        taskReminders: true,
        weeklyReports: false,

        // Appearance
        darkMode: false,
        compactView: false,
        animations: true,
        language: "en",

        // Privacy & Data
        dataAnalytics: true,
        autoBackup: true,
        cloudSync: true, // Habilitar sincronização por padrão

        // System
        region: "Brasil",
        lastAccess: new Date().toISOString(),
        totalLockedSavings: 0,
        monthlyRevenue: 0,
        activeAffiliates: 0,
        isFirstTime: true,
        passwordProtectionEnabled: false,
      },
    }
  }

  // === USER MANAGEMENT COM SINCRONIZAÇÃO ===

  // Registrar novo usuário com sincronização
  async registerUser(
    username: string,
    password: string,
    displayName: string,
    enableCloudSync = true,
  ): Promise<{ success: boolean; message: string; user?: User }> {
    const globalData = this.getGlobalData()

    // Verificar se username já existe localmente
    if (globalData.users.find((u) => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, message: "Username already exists locally" }
    }

    // If sincronização está habilitada, verificar na nuvem também
    if (enableCloudSync && syncService.isOnlineStatus()) {
      try {
        const existsInCloud = await syncService.checkUserExists(username)
        if (existsInCloud) {
          return { success: false, message: "Username already exists in cloud" }
        }
      } catch (error) {
        console.warn("Could not check cloud for existing user:", error)
        // Continue with registration even if cloud check fails
      }
    }

    // Validações
    if (username.length < 3) {
      return { success: false, message: "Username must be at least 3 characters" }
    }

    if (password.length < 4) {
      return { success: false, message: "Password must be at least 4 characters" }
    }

    if (displayName.length < 2) {
      return { success: false, message: "Display name must be at least 2 characters" }
    }

    // Criar novo usuário
    const newUser: User = {
      id: this.generateId(),
      username: username.toLowerCase(),
      password: this.hashPassword(password),
      displayName,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      cloudSync: enableCloudSync,
    }

    // Adicionar usuário localmente
    globalData.users.push(newUser)
    this.saveGlobalData(globalData)

    // Criar dados padrão para o usuário
    const userData = this.getDefaultData()
    userData.settings.cloudSync = enableCloudSync
    userData.settings.displayName = displayName
    this.saveUserData(newUser.id, userData)

    // Sincronizar com a nuvem se habilitado
    if (enableCloudSync) {
      try {
        const syncResult = await syncService.syncToCloud(username, {
          user: newUser,
          userData: userData,
        })

        if (syncResult.success) {
          console.log("✅ Usuário registrado e sincronizado com a nuvem")
        } else {
          console.warn("⚠️ Usuário registrado localmente, mas falha na sincronização:", syncResult.error)
        }
      } catch (error) {
        console.warn("⚠️ Erro na sincronização durante registro:", error)
      }
    }

    console.log("Usuário registrado:", newUser.username)
    return { success: true, message: "User registered successfully", user: newUser }
  }

  // Login de usuário com sincronização
  async loginUser(username: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
    const globalData = this.getGlobalData()

    // Primeiro, tentar encontrar usuário localmente
    let user = globalData.users.find((u) => u.username.toLowerCase() === username.toLowerCase())

    // Se não encontrou localmente e está online, tentar buscar na nuvem
    if (!user && syncService.isOnlineStatus()) {
      console.log("🔍 Usuário não encontrado localmente, buscando na nuvem...")

      try {
        const cloudResult = await syncService.syncFromCloud(username)

        if (cloudResult.success && cloudResult.data) {
          const cloudUser = cloudResult.data.user
          const cloudUserData = cloudResult.data.userData

          // Verificar senha
          if (this.verifyPassword(password, cloudUser.password)) {
            // Adicionar usuário localmente
            globalData.users.push(cloudUser)
            this.saveGlobalData(globalData)

            // Salvar dados do usuário localmente
            this.saveUserData(cloudUser.id, cloudUserData)

            user = cloudUser
            console.log("✅ Usuário baixado da nuvem e salvo localmente")
          } else {
            return { success: false, message: "Invalid password" }
          }
        }
      } catch (error) {
        console.error("❌ Erro ao buscar usuário na nuvem:", error)
      }
    }

    // Se ainda não encontrou o usuário
    if (!user) {
      return { success: false, message: "User not found" }
    }

    // Verificar senha
    if (!this.verifyPassword(password, user.password)) {
      return { success: false, message: "Invalid password" }
    }

    // Atualizar último login
    user.lastLogin = new Date().toISOString()
    globalData.currentUser = user.id
    this.saveGlobalData(globalData)

    // Se o usuário tem sincronização habilitada, sincronizar dados
    if (user.cloudSync && syncService.isOnlineStatus()) {
      try {
        const cloudResult = await syncService.syncFromCloud(username)

        if (cloudResult.success && cloudResult.data) {
          // Mesclar dados da nuvem com dados locais
          const cloudUserData = cloudResult.data.userData
          const localUserData = this.loadUserData(user.id)

          // Usar dados mais recentes (baseado em lastAccess)
          const cloudLastAccess = new Date(cloudUserData?.settings?.lastAccess || 0)
          const localLastAccess = new Date(localUserData.settings.lastAccess || 0)

          if (cloudLastAccess > localLastAccess) {
            console.log("📥 Using cloud data (more recent)")
            this.saveUserData(user.id, cloudUserData)
          } else {
            console.log("📤 Syncing local data to cloud")
            await syncService.syncToCloud(username, {
              user: user,
              userData: localUserData,
            })
          }
        }
      } catch (error) {
        console.warn("⚠️ Error during login sync:", error)
      }
    }

    console.log("Login realizado:", user.username)
    return { success: true, message: "Login successful", user }
  }

  // Logout
  logoutUser(): void {
    const globalData = this.getGlobalData()
    globalData.currentUser = null
    this.saveGlobalData(globalData)
    console.log("Logout realizado")
  }

  // Adicionar método para verificar e restaurar sessão no carregamento
  checkAndRestoreSession(): boolean {
    try {
      const globalData = this.getGlobalData()

      // Se há um usuário atual definido, verificar se ainda existe
      if (globalData.currentUser) {
        const user = globalData.users.find((u) => u.id === globalData.currentUser)
        if (user) {
          // Usuário ainda existe, sessão válida
          return true
        } else {
          // Usuário não existe mais, limpar sessão
          globalData.currentUser = null
          this.saveGlobalData(globalData)
          return false
        }
      }

      return false
    } catch (error) {
      console.error("Erro ao verificar sessão:", error)
      return false
    }
  }

  // Melhorar o método getCurrentUser para ser mais robusto
  getCurrentUser(): User | null {
    try {
      const globalData = this.getGlobalData()
      if (!globalData.currentUser) return null

      const user = globalData.users.find((u) => u.id === globalData.currentUser)

      // Se o usuário não existe mais, limpar a sessão
      if (!user && globalData.currentUser) {
        globalData.currentUser = null
        this.saveGlobalData(globalData)
        return null
      }

      return user || null
    } catch (error) {
      console.error("Erro ao obter usuário atual:", error)
      return null
    }
  }

  // Verificar se há usuário logado
  isUserLoggedIn(): boolean {
    return this.getCurrentUser() !== null
  }

  // Adicionar método para manter sessão ativa e sincronizar
  async keepSessionAlive(): Promise<void> {
    const currentUser = this.getCurrentUser()
    if (currentUser) {
      // Atualizar último acesso
      const data = this.loadData()
      data.settings.lastAccess = new Date().toISOString()
      this.saveData(data)

      // Sincronizar se habilitado
      if (currentUser.cloudSync && syncService.isOnlineStatus()) {
        try {
          await syncService.syncToCloud(currentUser.username, {
            user: currentUser,
            userData: data,
          })
        } catch (error) {
          console.warn("⚠️ Erro na sincronização automática:", error)
        }
      }
    }
  }

  // Obter todos os usuários (para admin)
  getAllUsers(): User[] {
    return this.getGlobalData().users
  }

  // Deletar usuário
  async deleteUser(userId: string): Promise<boolean> {
    const globalData = this.getGlobalData()
    const user = globalData.users.find((u) => u.id === userId)

    if (!user) return false

    const initialLength = globalData.users.length
    globalData.users = globalData.users.filter((u) => u.id !== userId)

    if (globalData.users.length < initialLength) {
      // Se o usuário deletado era o atual, fazer logout
      if (globalData.currentUser === userId) {
        globalData.currentUser = null
      }

      this.saveGlobalData(globalData)

      // Deletar dados do usuário localmente
      try {
        localStorage.removeItem(this.getUserStorageKey(userId))
      } catch (error) {
        console.error("Erro ao deletar dados do usuário:", error)
      }

      // Limpar dados de sincronização se habilitado
      if (user.cloudSync) {
        syncService.clearSyncData(user.username)
      }

      return true
    }
    return false
  }

  // === USER DATA MANAGEMENT COM SINCRONIZAÇÃO ===

  // Carregar dados do usuário atual
  loadData(): UserData {
    const currentUser = this.getCurrentUser()
    if (!currentUser) {
      // Se não há usuário logado, retornar dados padrão (modo guest)
      return this.getDefaultData()
    }

    return this.loadUserData(currentUser.id)
  }

  // Carregar dados de um usuário específico
  loadUserData(userId: string): UserData {
    try {
      const stored = localStorage.getItem(this.getUserStorageKey(userId))
      if (stored) {
        const data = JSON.parse(stored)

        // Garantir que todos os campos existem (para compatibilidade)
        const defaultData = this.getDefaultData()
        const mergedData = {
          ...defaultData,
          ...data,
          settings: {
            ...defaultData.settings,
            ...data.settings,
            lastAccess: new Date().toISOString(),
          },
        }

        // Salvar dados atualizados
        this.saveUserData(userId, mergedData)
        return mergedData
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error)
    }

    // Se não há dados salvos, criar dados padrão e salvar
    const defaultData = this.getDefaultData()
    this.saveUserData(userId, defaultData)
    return defaultData
  }

  // Salvar dados do usuário atual com sincronização
  async saveData(data: UserData): Promise<void> {
    const currentUser = this.getCurrentUser()
    if (!currentUser) {
      console.warn("Tentativa de salvar dados sem usuário logado")
      return
    }

    this.saveUserData(currentUser.id, data)

    // Sincronizar se habilitado
    if (currentUser.cloudSync && data.settings.cloudSync && syncService.isOnlineStatus()) {
      try {
        await syncService.syncToCloud(currentUser.username, {
          user: currentUser,
          userData: data,
        })
      } catch (error) {
        console.warn("⚠️ Erro na sincronização automática:", error)
      }
    }
  }

  // Salvar dados de um usuário específico
  saveUserData(userId: string, data: UserData): void {
    try {
      const jsonData = JSON.stringify(data)
      localStorage.setItem(this.getUserStorageKey(userId), jsonData)

      // Verificar se foi salvo corretamente
      const saved = localStorage.getItem(this.getUserStorageKey(userId))
      if (!saved) {
        console.error("Falha ao salvar dados do usuário no localStorage")
      }
    } catch (error) {
      console.error("Erro ao salvar dados do usuário:", error)
    }
  }

  // Método para forçar sincronização manual
  async forceSyncToCloud(): Promise<{ success: boolean; message: string }> {
    const currentUser = this.getCurrentUser()
    if (!currentUser) {
      return { success: false, message: "No user logged in" }
    }

    if (!currentUser.cloudSync) {
      return { success: false, message: "Cloud sync is disabled for this user" }
    }

    if (!syncService.isOnlineStatus()) {
      return { success: false, message: "Device is offline" }
    }

    try {
      const userData = this.loadData()
      const result = await syncService.syncToCloud(currentUser.username, {
        user: currentUser,
        userData: userData,
      })

      if (result.success) {
        return { success: true, message: "Data synchronized successfully" }
      } else {
        return { success: false, message: result.error || "Sync failed" }
      }
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  // Método para obter status de sincronização
  getSyncStatus(): {
    isEnabled: boolean
    isOnline: boolean
    lastSync?: string
    synced: boolean
    deviceId: string
  } {
    const currentUser = this.getCurrentUser()
    if (!currentUser) {
      return {
        isEnabled: false,
        isOnline: false,
        synced: false,
        deviceId: "unknown",
      }
    }

    const syncStatus = syncService.getSyncStatus(currentUser.username)

    return {
      isEnabled: currentUser.cloudSync || false,
      isOnline: syncService.isOnlineStatus(),
      lastSync: syncStatus.lastSync,
      synced: syncStatus.synced,
      deviceId: localStorage.getItem("device-id") || "unknown",
    }
  }

  // Habilitar/desabilitar sincronização na nuvem
  async toggleCloudSync(enabled: boolean): Promise<{ success: boolean; message: string }> {
    const currentUser = this.getCurrentUser()
    if (!currentUser) {
      return { success: false, message: "No user logged in" }
    }

    // Atualizar configuração do usuário
    currentUser.cloudSync = enabled
    const globalData = this.getGlobalData()
    const userIndex = globalData.users.findIndex((u) => u.id === currentUser.id)
    if (userIndex !== -1) {
      globalData.users[userIndex] = currentUser
      this.saveGlobalData(globalData)
    }

    // Atualizar configuração nos dados do usuário
    const userData = this.loadData()
    userData.settings.cloudSync = enabled
    this.saveUserData(currentUser.id, userData)

    if (enabled) {
      // Se habilitando, fazer sincronização inicial
      try {
        const result = await syncService.syncToCloud(currentUser.username, {
          user: currentUser,
          userData: userData,
        })

        if (result.success) {
          return { success: true, message: "Cloud sync enabled and data synchronized" }
        } else {
          return { success: false, message: "Cloud sync enabled but initial sync failed: " + result.error }
        }
      } catch (error) {
        return {
          success: false,
          message:
            "Cloud sync enabled but initial sync failed: " + (error instanceof Error ? error.message : "Unknown error"),
        }
      }
    } else {
      // Se desabilitando, limpar dados de sync
      syncService.clearSyncData(currentUser.username)
      return { success: true, message: "Cloud sync disabled" }
    }
  }

  // === MÉTODOS EXISTENTES (mantidos iguais, mas com sincronização automática) ===

  // === TASK STATS FOR DAILY MOTIVATION ===

  // Obter progresso das tarefas do dia para Daily Motivation
  getDailyTaskProgress(): number {
    const data = this.loadData()
    const today = new Date().toISOString().split("T")[0]
    const todayTasks = (data.tasks || []).filter((task) => task.date === today)

    if (todayTasks.length === 0) return 0

    const completedTasks = todayTasks.filter((task) => task.status === "completed").length
    return Math.round((completedTasks / todayTasks.length) * 100)
  }

  // === LANGUAGE MANAGEMENT ===

  // Obter idioma atual
  getCurrentLanguage(): "en" | "pt" {
    const data = this.loadData()
    return data.settings.language || "en"
  }

  // Atualizar idioma
  async updateLanguage(language: "en" | "pt"): Promise<void> {
    const data = this.loadData()
    data.settings.language = language
    await this.saveData(data)
  }

  // === EXISTING METHODS (mantidos iguais, mas agora usando saveData assíncrono para sincronização) ===

  // === EARNINGS MANAGEMENT ===

  // Adicionar ganho diário
  async addDailyEarning(earning: Omit<DailyEarning, "id" | "createdAt">): Promise<DailyEarning> {
    const data = this.loadData()
    const newEarning: DailyEarning = {
      ...earning,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
    }

    data.dailyEarnings.push(newEarning)

    // Atualizar total locked savings
    data.settings.totalLockedSavings += earning.amount

    // Processar estatísticas mensais
    this.updateMonthlyStats(data, newEarning)

    // Marcar que não é mais primeira vez
    data.settings.isFirstTime = false

    await this.saveData(data)
    return newEarning
  }

  // Atualizar estatísticas mensais
  private updateMonthlyStats(data: UserData, earning: DailyEarning): void {
    const month = earning.date.substring(0, 7) // YYYY-MM

    // Encontrar ou criar estatística mensal
    let monthlyStats = data.monthlyStats.find((stats) => stats.month === month)

    if (!monthlyStats) {
      monthlyStats = {
        month,
        totalEarnings: 0,
        dailyEarnings: [],
        activeAffiliates: data.settings.activeAffiliates,
        createdAt: new Date().toISOString(),
      }
      data.monthlyStats.push(monthlyStats)
    }

    // Adicionar ganho ao mês
    monthlyStats.dailyEarnings.push(earning)
    monthlyStats.totalEarnings += earning.amount

    // Verificar se este mês superou o monthly revenue atual
    if (monthlyStats.totalEarnings > data.settings.monthlyRevenue) {
      data.settings.monthlyRevenue = monthlyStats.totalEarnings
    }

    // Ordenar por mês (mais recente primeiro)
    data.monthlyStats.sort((a, b) => b.month.localeCompare(a.month))
  }

  // Obter ganhos do dia atual
  getTodayEarnings(): DailyEarning[] {
    const data = this.loadData()
    const today = new Date().toISOString().split("T")[0]
    return data.dailyEarnings.filter((earning) => earning.date === today)
  }

  // Obter ganhos por mês
  getEarningsByMonth(month: string): DailyEarning[] {
    const data = this.loadData()
    return data.dailyEarnings.filter((earning) => earning.date.startsWith(month))
  }

  // Obter estatísticas mensais
  getMonthlyStats(): MonthlyStats[] {
    return this.loadData().monthlyStats
  }

  // Obter estatística de um mês específico
  getMonthlyStatsForMonth(month: string): MonthlyStats | null {
    const data = this.loadData()
    return data.monthlyStats.find((stats) => stats.month === month) || null
  }

  // Atualizar número de afiliados ativos
  async updateActiveAffiliates(count: number): Promise<void> {
    const data = this.loadData()
    data.settings.activeAffiliates = count

    // Atualizar também no mês atual se existir
    const currentMonth = new Date().toISOString().substring(0, 7)
    const monthlyStats = data.monthlyStats.find((stats) => stats.month === currentMonth)
    if (monthlyStats) {
      monthlyStats.activeAffiliates = count
    }

    await this.saveData(data)
  }

  // Obter resumo de earnings
  getEarningsOverview() {
    const data = this.loadData()
    const today = new Date().toISOString().split("T")[0]
    const currentMonth = today.substring(0, 7)

    const todayEarnings = this.getTodayEarnings()
    const monthEarnings = this.getEarningsByMonth(currentMonth)

    const todayTotal = todayEarnings.reduce((sum, earning) => sum + earning.amount, 0)
    const monthTotal = monthEarnings.reduce((sum, earning) => sum + earning.amount, 0)

    return {
      todayTotal,
      monthTotal,
      totalLockedSavings: data.settings.totalLockedSavings,
      monthlyRevenue: data.settings.monthlyRevenue,
      activeAffiliates: data.settings.activeAffiliates,
      todayCount: todayEarnings.length,
      monthCount: monthEarnings.length,
      isFirstTime: data.settings.isFirstTime,
    }
  }

  // === EXISTING METHODS ===

  // Adicionar nova ideia de produto
  async addProductIdea(idea: Omit<ProductIdea, "id" | "createdAt">): Promise<ProductIdea> {
    const data = this.loadData()
    const newIdea: ProductIdea = {
      ...idea,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
    }
    data.productIdeas.push(newIdea)
    data.settings.isFirstTime = false
    await this.saveData(data)
    return newIdea
  }

  // Adicionar produto em alta
  async addTrendingProduct(product: Omit<TrendingProduct, "id" | "createdAt">): Promise<TrendingProduct> {
    const data = this.loadData()
    const newProduct: TrendingProduct = {
      ...product,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
    }
    data.trendingProducts.push(newProduct)
    data.settings.isFirstTime = false
    await this.saveData(data)
    return newProduct
  }

  // Adicionar kit de afiliado
  async addAffiliateKit(kit: Omit<AffiliateKit, "id" | "createdAt">): Promise<AffiliateKit> {
    const data = this.loadData()
    const newKit: AffiliateKit = {
      ...kit,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
    }
    data.affiliateKits.push(newKit)
    data.settings.isFirstTime = false
    await this.saveData(data)
    return newKit
  }

  // Buscar ideias por tópico
  getProductIdeasByTopic(topic: string, region: string, productType: string): ProductIdea[] {
    const data = this.loadData()
    return data.productIdeas.filter(
      (idea) =>
        idea.topic.toLowerCase() === topic.toLowerCase() && idea.region === region && idea.productType === productType,
    )
  }

  // Buscar produtos em alta por tópico
  getTrendingProductsByTopic(topic: string, region: string, productType: string): TrendingProduct[] {
    const data = this.loadData()
    return data.trendingProducts.filter(
      (product) =>
        product.topic.toLowerCase() === topic.toLowerCase() &&
        product.region === region &&
        product.productType === productType,
    )
  }

  // Buscar kits por produto
  getAffiliateKitsByProduct(productName: string, topic: string): AffiliateKit[] {
    const data = this.loadData()
    return data.affiliateKits.filter(
      (kit) =>
        kit.productName.toLowerCase() === productName.toLowerCase() && kit.topic.toLowerCase() === topic.toLowerCase(),
    )
  }

  // Obter todas as ideias
  getAllProductIdeas(): ProductIdea[] {
    return this.loadData().productIdeas
  }

  // Obter todos os produtos em alta
  getAllTrendingProducts(): TrendingProduct[] {
    return this.loadData().trendingProducts
  }

  // Obter todos os kits
  getAllAffiliateKits(): AffiliateKit[] {
    return this.loadData().affiliateKits
  }

  // === GOALS MANAGEMENT ===

  // Obter todas as metas
  getGoals(): Goal[] {
    const data = this.loadData()
    return data.goals || []
  }

  // Adicionar nova meta
  async addGoal(goal: Omit<Goal, "id" | "createdAt">): Promise<Goal> {
    const data = this.loadData()
    const newGoal: Goal = {
      ...goal,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
    }

    // Garantir que goals é um array
    if (!Array.isArray(data.goals)) {
      data.goals = []
    }

    data.goals.push(newGoal)
    data.settings.isFirstTime = false

    console.log("Nova meta adicionada:", newGoal)
    console.log("Total de metas:", data.goals.length)

    await this.saveData(data)
    return newGoal
  }

  // Atualizar meta existente
  async updateGoal(goalId: string, updates: Partial<Goal>): Promise<Goal | null> {
    const data = this.loadData()

    if (!Array.isArray(data.goals)) {
      data.goals = []
      return null
    }

    const goalIndex = data.goals.findIndex((g) => g.id === goalId)
    if (goalIndex !== -1) {
      data.goals[goalIndex] = { ...data.goals[goalIndex], ...updates }
      await this.saveData(data)
      console.log("Meta atualizada:", data.goals[goalIndex])
      return data.goals[goalIndex]
    }
    return null
  }

  // Deletar meta
  async deleteGoal(goalId: string): Promise<boolean> {
    const data = this.loadData()

    if (!Array.isArray(data.goals)) {
      return false
    }

    const initialLength = data.goals.length
    data.goals = data.goals.filter((g) => g.id !== goalId)

    if (data.goals.length < initialLength) {
      await this.saveData(data)
      console.log("Meta deletada. Total restante:", data.goals.length)
      return true
    }
    return false
  }

  // Atualizar progresso de uma meta
  async updateGoalProgress(goalId: string, newCurrent: number): Promise<Goal | null> {
    const data = this.loadData()

    if (!Array.isArray(data.goals)) {
      return null
    }

    const goalIndex = data.goals.findIndex((g) => g.id === goalId)
    if (goalIndex !== -1) {
      const goal = data.goals[goalIndex]
      goal.current = newCurrent

      // Atualizar milestones automaticamente
      goal.milestones.forEach((milestone) => {
        milestone.completed = newCurrent >= milestone.amount
      })

      // Atualizar status baseado no progresso
      const progress = (newCurrent / goal.target) * 100
      if (progress >= 100) {
        goal.status = "completed"
      } else if (progress >= 75) {
        goal.status = "on-track"
      } else if (progress >= 50) {
        goal.status = "on-track"
      } else {
        goal.status = "behind"
      }

      await this.saveData(data)
      console.log("Progresso da meta atualizado:", goal)
      return goal
    }
    return null
  }

  // === TASKS MANAGEMENT ===

  // Obter todas as tarefas
  getTasks(): Task[] {
    const data = this.loadData()
    return data.tasks || []
  }

  // Obter tarefas de uma data específica
  getTasksByDate(date: string): Task[] {
    const data = this.loadData()
    return (data.tasks || []).filter((task) => task.date === date)
  }

  // Obter tarefas de hoje
  getTodayTasks(): Task[] {
    const today = new Date().toISOString().split("T")[0]
    return this.getTasksByDate(today)
  }

  // Adicionar nova tarefa
  async addTask(task: Omit<Task, "id" | "createdAt">): Promise<Task> {
    const data = this.loadData()
    const newTask: Task = {
      ...task,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
    }

    // Garantir que tasks é um array
    if (!Array.isArray(data.tasks)) {
      data.tasks = []
    }

    data.tasks.push(newTask)
    data.settings.isFirstTime = false

    console.log("Nova tarefa adicionada:", newTask)
    console.log("Total de tarefas:", data.tasks.length)

    await this.saveData(data)
    return newTask
  }

  // Atualizar tarefa existente
  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task | null> {
    const data = this.loadData()

    if (!Array.isArray(data.tasks)) {
      data.tasks = []
      return null
    }

    const taskIndex = data.tasks.findIndex((t) => t.id === taskId)
    if (taskIndex !== -1) {
      data.tasks[taskIndex] = { ...data.tasks[taskIndex], ...updates }
      await this.saveData(data)
      console.log("Tarefa atualizada:", data.tasks[taskIndex])
      return data.tasks[taskIndex]
    }
    return null
  }

  // Deletar tarefa
  async deleteTask(taskId: string): Promise<boolean> {
    const data = this.loadData()

    if (!Array.isArray(data.tasks)) {
      return false
    }

    const initialLength = data.tasks.length
    data.tasks = data.tasks.filter((t) => t.id !== taskId)

    if (data.tasks.length < initialLength) {
      await this.saveData(data)
      console.log("Tarefa deletada. Total restante:", data.tasks.length)
      return true
    }
    return false
  }

  // Marcar tarefa como completa/incompleta
  async toggleTaskStatus(taskId: string): Promise<Task | null> {
    const data = this.loadData()

    if (!Array.isArray(data.tasks)) {
      return null
    }

    const taskIndex = data.tasks.findIndex((t) => t.id === taskId)
    if (taskIndex !== -1) {
      const task = data.tasks[taskIndex]

      // Alternar status
      if (task.status === "completed") {
        task.status = "pending"
      } else if (task.status === "pending") {
        task.status = "in-progress"
      } else {
        task.status = "completed"
      }

      await this.saveData(data)
      console.log("Status da tarefa alterado:", task)
      return task
    }
    return null
  }

  // Obter estatísticas de tarefas
  getTaskStats() {
    const data = this.loadData()
    const tasks = data.tasks || []
    const today = new Date().toISOString().split("T")[0]
    const todayTasks = tasks.filter((task) => task.date === today)

    return {
      totalTasks: tasks.length,
      todayTasks: todayTasks.length,
      completedToday: todayTasks.filter((t) => t.status === "completed").length,
      pendingToday: todayTasks.filter((t) => t.status === "pending").length,
      inProgressToday: todayTasks.filter((t) => t.status === "in-progress").length,
      completionRate:
        todayTasks.length > 0
          ? Math.round((todayTasks.filter((t) => t.status === "completed").length / todayTasks.length) * 100)
          : 0,
    }
  }

  // === ACCOUNTS MANAGEMENT ===

  // Obter todas as contas
  getAccounts(): Account[] {
    const data = this.loadData()
    return data.accounts || []
  }

  // Obter contas por tipo
  getAccountsByType(type: "sales" | "social"): Account[] {
    const data = this.loadData()
    return (data.accounts || []).filter((account) => account.type === type)
  }

  // Adicionar nova conta
  async addAccount(account: Omit<Account, "id" | "createdAt">): Promise<Account> {
    const data = this.loadData()
    const newAccount: Account = {
      ...account,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
    }

    // Garantir que accounts é um array
    if (!Array.isArray(data.accounts)) {
      data.accounts = []
    }

    data.accounts.push(newAccount)
    data.settings.isFirstTime = false

    console.log("Nova conta adicionada:", newAccount)
    console.log("Total de contas:", data.accounts.length)

    await this.saveData(data)
    return newAccount
  }

  // Atualizar conta existente
  async updateAccount(accountId: string, updates: Partial<Account>): Promise<Account | null> {
    const data = this.loadData()

    if (!Array.isArray(data.accounts)) {
      data.accounts = []
      return null
    }

    const accountIndex = data.accounts.findIndex((a) => a.id === accountId)
    if (accountIndex !== -1) {
      data.accounts[accountIndex] = {
        ...data.accounts[accountIndex],
        ...updates,
        lastUpdate: new Date().toISOString(),
      }
      await this.saveData(data)
      console.log("Conta atualizada:", data.accounts[accountIndex])
      return data.accounts[accountIndex]
    }
    return null
  }

  // Deletar conta
  async deleteAccount(accountId: string): Promise<boolean> {
    const data = this.loadData()

    if (!Array.isArray(data.accounts)) {
      return false
    }

    const initialLength = data.accounts.length
    data.accounts = data.accounts.filter((a) => a.id !== accountId)

    if (data.accounts.length < initialLength) {
      await this.saveData(data)
      console.log("Conta deletada. Total restante:", data.accounts.length)
      return true
    }
    return false
  }

  // Obter dados para Affiliate Tracker (baseado nas contas reais)
  getAffiliateTrackerData() {
    const data = this.loadData()
    const salesAccounts = (data.accounts || []).filter((account) => account.type === "sales" && account.isActive)

    return salesAccounts.map((account) => ({
      name: account.platform,
      earnings: account.earnings || 0,
      target: Math.round((account.earnings || 1000) * 1.5), // Target 50% maior que earnings atual
      growth: Math.random() * 20 - 5, // Growth aleatório entre -5% e +15%
    }))
  }

  // Verificar código de acesso para senhas (removido - não será mais usado)
  verifyAccessCode(code: string): boolean {
    return code === "ViLove"
  }

  // Configurações
  getSettings() {
    return this.loadData().settings
  }

  async updateSettings(settings: Partial<UserData["settings"]>) {
    const data = this.loadData()
    data.settings = { ...data.settings, ...settings }
    await this.saveData(data)
  }

  // Atualizar configurações de perfil
  async updateProfileSettings(profileData: {
    displayName?: string
    email?: string
    bio?: string
    avatar?: string
  }): Promise<void> {
    const data = this.loadData()

    if (profileData.displayName) data.settings.displayName = profileData.displayName
    if (profileData.email) data.settings.email = profileData.email
    if (profileData.bio) data.settings.bio = profileData.bio
    if (profileData.avatar !== undefined) data.settings.avatar = profileData.avatar

    await this.saveData(data)

    // Atualizar também o displayName do usuário global se mudou
    if (profileData.displayName) {
      const globalData = this.getGlobalData()
      const currentUser = this.getCurrentUser()
      if (currentUser) {
        const userIndex = globalData.users.findIndex((u) => u.id === currentUser.id)
        if (userIndex !== -1) {
          globalData.users[userIndex].displayName = profileData.displayName
          this.saveGlobalData(globalData)
        }
      }
    }
  }

  // Alternar dark mode
  async toggleDarkMode(): Promise<boolean> {
    const data = this.loadData()
    data.settings.darkMode = !data.settings.darkMode
    await this.saveData(data)

    // Aplicar dark mode no documento
    if (typeof document !== "undefined") {
      if (data.settings.darkMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }

    return data.settings.darkMode
  }

  // Obter configuração de dark mode
  isDarkMode(): boolean {
    return this.loadData().settings.darkMode
  }

  // Aplicar dark mode no carregamento
  applyDarkMode(): void {
    if (typeof document !== "undefined") {
      const isDark = this.isDarkMode()
      if (isDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }

  // Atualizar configurações de notificação
  async updateNotificationSettings(notifications: {
    emailNotifications?: boolean
    pushNotifications?: boolean
    goalReminders?: boolean
    taskReminders?: boolean
    weeklyReports?: boolean
  }): Promise<void> {
    const data = this.loadData()

    Object.keys(notifications).forEach((key) => {
      if (notifications[key as keyof typeof notifications] !== undefined) {
        ;(data.settings as any)[key] = notifications[key as keyof typeof notifications]
      }
    })

    await this.saveData(data)
  }

  // Atualizar configurações de aparência
  async updateAppearanceSettings(appearance: {
    compactView?: boolean
    animations?: boolean
  }): Promise<void> {
    const data = this.loadData()

    if (appearance.compactView !== undefined) data.settings.compactView = appearance.compactView
    if (appearance.animations !== undefined) data.settings.animations = appearance.animations

    await this.saveData(data)
  }

  // Atualizar configurações de privacidade
  async updatePrivacySettings(privacy: {
    dataAnalytics?: boolean
    autoBackup?: boolean
  }): Promise<void> {
    const data = this.loadData()

    if (privacy.dataAnalytics !== undefined) data.settings.dataAnalytics = privacy.dataAnalytics
    if (privacy.autoBackup !== undefined) data.settings.autoBackup = privacy.autoBackup

    await this.saveData(data)
  }

  // Backup automático (se habilitado)
  async performAutoBackup(): Promise<void> {
    const data = this.loadData()
    if (data.settings.autoBackup) {
      try {
        const backupData = this.exportData()
        const backupKey = `backup-${this.getCurrentUser()?.id}-${Date.now()}`
        localStorage.setItem(backupKey, backupData)

        // Manter apenas os 5 backups mais recentes
        const allKeys = Object.keys(localStorage)
        const backupKeys = allKeys.filter((key) => key.startsWith(`backup-${this.getCurrentUser()?.id}-`)).sort()

        if (backupKeys.length > 5) {
          backupKeys.slice(0, -5).forEach((key) => {
            localStorage.removeItem(key)
          })
        }

        console.log("Backup automático realizado")
      } catch (error) {
        console.error("Erro no backup automático:", error)
      }
    }
  }

  // Obter lista de backups
  getBackups(): Array<{ key: string; date: Date; size: string }> {
    const currentUser = this.getCurrentUser()
    if (!currentUser) return []

    const allKeys = Object.keys(localStorage)
    const backupKeys = allKeys
      .filter((key) => key.startsWith(`backup-${currentUser.id}-`))
      .sort()
      .reverse()

    return backupKeys.map((key) => {
      const timestamp = key.split("-").pop()
      const data = localStorage.getItem(key) || ""
      return {
        key,
        date: new Date(Number.parseInt(timestamp || "0")),
        size: `${Math.round(data.length / 1024)}KB`,
      }
    })
  }

  // Restaurar backup
  async restoreBackup(backupKey: string): Promise<boolean> {
    try {
      const backupData = localStorage.getItem(backupKey)
      if (backupData) {
        return await this.importData(backupData)
      }
      return false
    } catch (error) {
      console.error("Erro ao restaurar backup:", error)
      return false
    }
  }

  // RESETAR TODOS OS DADOS (função para zerar tudo do usuário atual)
  async resetAllData(): Promise<void> {
    try {
      const currentUser = this.getCurrentUser()
      if (!currentUser) {
        console.warn("Tentativa de resetar dados sem usuário logado")
        return
      }

      // Limpar dados do usuário atual
      localStorage.removeItem(this.getUserStorageKey(currentUser.id))

      // Criar dados padrão zerados
      const defaultData = this.getDefaultData()
      this.saveUserData(currentUser.id, defaultData)

      // Sincronizar reset se habilitado
      if (currentUser.cloudSync) {
        await syncService.syncToCloud(currentUser.username, {
          user: currentUser,
          userData: defaultData,
        })
      }

      console.log("✅ Todos os dados foram resetados para o estado inicial")
      console.log("Goals após reset:", defaultData.goals.length)
    } catch (error) {
      console.error("❌ Erro ao resetar dados:", error)
      throw error
    }
  }

  // Limpar localStorage completamente (todos os usuários)
  clearAllData(): void {
    localStorage.clear()
    console.log("Todos os dados removidos do localStorage")
  }

  // Exportar dados do usuário atual
  exportData(): string {
    return JSON.stringify(this.loadData(), null, 2)
  }

  // Importar dados para o usuário atual
  async importData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData)
      await this.saveData(data)
      return true
    } catch (error) {
      console.error("Erro ao importar dados:", error)
      return false
    }
  }

  // Gerar ID único
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Estatísticas
  getStats() {
    const data = this.loadData()
    return {
      totalIdeas: data.productIdeas.length,
      totalTrendingProducts: data.trendingProducts.length,
      totalKits: data.affiliateKits.length,
      totalGoals: data.goals?.length || 0,
      completedGoals: data.goals?.filter((g) => g.status === "completed").length || 0,
      totalTasks: data.tasks?.length || 0,
      completedTasks: data.tasks?.filter((t) => t.status === "completed").length || 0,
      totalAccounts: data.accounts?.length || 0,
      activeAccounts: data.accounts?.filter((a) => a.isActive).length || 0,
      totalEarnings: data.dailyEarnings.reduce((sum, earning) => sum + earning.amount, 0),
      lastAccess: data.settings.lastAccess,
      isFirstTime: data.settings.isFirstTime,
    }
  }

  // Verificar se há dados salvos
  hasData(): boolean {
    const currentUser = this.getCurrentUser()
    if (!currentUser) return false

    try {
      const stored = localStorage.getItem(this.getUserStorageKey(currentUser.id))
      return !!stored
    } catch {
      return false
    }
  }

  // Verificar integridade dos dados
  validateData(): boolean {
    try {
      const data = this.loadData()
      return !!(
        data.settings &&
        Array.isArray(data.dailyEarnings) &&
        Array.isArray(data.productIdeas) &&
        Array.isArray(data.goals) &&
        Array.isArray(data.tasks) &&
        Array.isArray(data.accounts)
      )
    } catch {
      return false
    }
  }
}

export const db = new LocalDatabase()
export type {
  ProductIdea,
  TrendingProduct,
  AffiliateKit,
  Goal,
  UserData,
  DailyEarning,
  MonthlyStats,
  Task,
  Account,
  User,
}
