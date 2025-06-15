"use client"

// Sistema de traduções para suporte a múltiplos idiomas

export type Language = "en" | "pt"

export interface Translations {
  // Navigation
  dashboard: string
  tools: string
  goals: string
  earnings: string
  accounts: string
  settings: string

  // Common
  add: string
  edit: string
  delete: string
  save: string
  cancel: string
  loading: string
  success: string
  error: string
  active: string
  inactive: string
  completed: string
  pending: string
  "in-progress": string
  high: string
  medium: string
  low: string
  today: string
  yesterday: string
  thisMonth: string
  total: string
  progress: string
  target: string
  current: string

  // Dashboard
  welcomeBack: string
  digitalEmpire: string
  performanceOverview: string
  todaysContentSchedule: string
  lockedSavings: string
  monthlyRevenue: string
  activeAffiliates: string
  goalProgress: string
  dailyMotivation: string
  dailyGoalProgress: string
  keepPushing: string
  awayFromTarget: string

  // Goals
  yourGoals: string
  setFirstGoals: string
  trackProgress: string
  buildDigitalEmpire: string
  goalsCompleted: string
  inProgress: string
  successRate: string
  daysToNextMilestone: string
  addNewGoal: string
  createNewGoal: string
  goalTitle: string
  category: string
  deadline: string
  description: string
  initialStatus: string
  goalPreview: string
  createGoal: string

  // Tasks
  contentCalendar: string
  addNewTask: string
  taskTitle: string
  priority: string
  status: string
  noTasksToday: string
  organizingDay: string
  addFirstTask: string

  // Accounts
  accountManager: string
  manageAccounts: string
  totalAccounts: string
  salesPlatforms: string
  socialMedia: string
  totalRevenue: string
  addAccount: string
  accountName: string
  username: string
  email: string
  password: string
  followers: string
  earnings: string
  accountStatus: string
  notes: string
  accountPreview: string
  createAccount: string

  // Earnings
  earningsTracker: string
  trackDailyEarnings: string
  todaysEarnings: string
  thisMonthEarnings: string
  bestMonth: string
  addTodaysEarnings: string
  amount: string
  source: string
  earningsHistory: string
  monthlyStats: string
  overview: string

  // Settings
  profileSettings: string
  notifications: string
  appearance: string
  language: string
  english: string
  portuguese: string
  privacySecurity: string
  resetAllData: string
  dangerZone: string
  deleteAllData: string
  exportData: string

  // User Management
  login: string
  register: string
  logout: string
  createAccount: string
  loginToAccount: string
  displayName: string
  confirmPassword: string
  userProfiles: string
  switchUser: string
  createNewProfile: string
  deleteProfile: string

  // Motivational Quotes
  newQuote: string

  // Categories
  financial: string
  audience: string
  products: string
  social: string
  contentCreation: string
  design: string
  writing: string
  marketing: string
  planning: string
  other: string

  // Platforms
  whop: string
  gumroad: string
  payhip: string
  instagram: string
  tiktok: string
  youtube: string
  twitter: string
  linkedin: string
  facebook: string
  pinterest: string

  // Messages
  usernameRequired: string
  passwordRequired: string
  emailRequired: string
  invalidEmail: string
  passwordTooShort: string
  usernameTooShort: string
  displayNameTooShort: string
  usernameExists: string
  userNotFound: string
  invalidPassword: string
  loginSuccessful: string
  registerSuccessful: string
  dataResetWarning: string
  dataResetSuccess: string
  taskCreated: string
  goalCreated: string
  accountCreated: string
  earningAdded: string

  // Settings specific
  profile_settings: string
  privacy_data: string
  data_management: string
  danger_zone: string
  display_name: string
  bio: string
  your_full_name: string
  your_email: string
  tell_about_yourself: string
  email_notifications: string
  push_notifications: string
  goal_reminders: string
  task_reminders: string
  weekly_reports: string
  dark_mode: string
  compact_view: string
  animations: string
  switch_theme: string
  denser_interface: string
  visual_effects: string
  data_analytics: string
  auto_backup: string
  allow_data_collection: string
  create_auto_backups: string
  export_data: string
  import_data: string
  backups: string
  create: string
  no_backups_found: string
  data_exported: string
  data_imported: string
  backup_created: string
  backup_restored: string
  error_exporting: string
  error_importing: string
  error_restoring: string
  invalid_file: string
  confirm_restore: string
  reset_all_data: string
  reset_warning: string
  reset_confirm: string
  data_reset_success: string
  error_resetting: string
  saving: string
  loading_settings: string
  connected: string
}

export const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    tools: "Tools",
    goals: "Goals",
    earnings: "Earnings",
    accounts: "Accounts",
    settings: "Settings",

    // Common
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    loading: "Loading",
    success: "Success",
    error: "Error",
    active: "Active",
    inactive: "Inactive",
    completed: "Completed",
    pending: "Pending",
    "in-progress": "In Progress",
    high: "High",
    medium: "Medium",
    low: "Low",
    today: "Today",
    yesterday: "Yesterday",
    thisMonth: "This Month",
    total: "Total",
    progress: "Progress",
    target: "Target",
    current: "Current",

    // Dashboard
    welcomeBack: "Welcome back, Creator! 🚀",
    digitalEmpire:
      "Your digital empire awaits. Track your progress, generate ideas, and achieve your entrepreneurial goals.",
    performanceOverview: "📊 Performance Overview",
    todaysContentSchedule: "📅 Today's Content Schedule",
    lockedSavings: "Locked Savings",
    monthlyRevenue: "Monthly Revenue",
    activeAffiliates: "Active Affiliates",
    goalProgress: "Goal Progress",
    dailyMotivation: "Daily Motivation",
    dailyGoalProgress: "Daily Goal Progress",
    keepPushing: "Keep pushing! You're",
    awayFromTarget: "% away from your daily target.",

    // Goals
    yourGoals: "Your Goals 🎯",
    setFirstGoals: "Set your first goals and start building your digital empire",
    trackProgress: "Track your progress and achieve your entrepreneurial dreams",
    buildDigitalEmpire: "Set your first goals and start building your digital empire",
    goalsCompleted: "Goals Completed",
    inProgress: "In Progress",
    successRate: "Success Rate",
    daysToNextMilestone: "Days to Next Milestone",
    addNewGoal: "Add New Goal",
    createNewGoal: "Create New Goal",
    goalTitle: "Goal Title",
    category: "Category",
    deadline: "Deadline",
    description: "Description",
    initialStatus: "Initial Status",
    goalPreview: "Goal Preview",
    createGoal: "Create Goal",

    // Tasks
    contentCalendar: "Content Calendar",
    addNewTask: "Add New Task",
    taskTitle: "Task Title",
    priority: "Priority",
    status: "Status",
    noTasksToday: "No tasks for today",
    organizingDay: "Start organizing your day by adding your first task!",
    addFirstTask: "Add your first task",

    // Accounts
    accountManager: "Account Manager 🔐",
    manageAccounts: "Manage all your sales platforms and social media accounts in one secure place",
    totalAccounts: "Total Accounts",
    salesPlatforms: "Sales Platforms",
    socialMedia: "Social Media",
    totalRevenue: "Total Revenue",
    addAccount: "Add Account",
    accountName: "Account Name",
    username: "Username",
    email: "Email",
    password: "Password",
    followers: "Followers",
    earnings: "Earnings",
    accountStatus: "Account Status",
    notes: "Notes",
    accountPreview: "Account Preview",
    createAccount: "Create Account",

    // Earnings
    earningsTracker: "Earnings Tracker 💰",
    trackDailyEarnings:
      "Track your daily earnings and watch your empire grow. All earnings automatically update your dashboard stats.",
    todaysEarnings: "Today's Earnings",
    thisMonthEarnings: "This Month",
    bestMonth: "Best Month",
    addTodaysEarnings: "Add Today's Earnings",
    amount: "Amount",
    source: "Source",
    earningsHistory: "Earnings History",
    monthlyStats: "Monthly Stats",
    overview: "Overview",

    // Settings
    profileSettings: "Profile Settings",
    notifications: "Notifications",
    appearance: "Appearance",
    language: "Language",
    english: "English",
    portuguese: "Portuguese",
    privacySecurity: "Privacy & Security",
    resetAllData: "Reset All Data",
    dangerZone: "Danger Zone",
    deleteAllData:
      "This will permanently delete all your data including earnings, goals, product ideas, and settings. This action cannot be undone.",
    exportData: "Export Data",

    // User Management
    login: "Login",
    register: "Register",
    logout: "Logout",
    createAccount: "Create Account",
    loginToAccount: "Login to Account",
    displayName: "Display Name",
    confirmPassword: "Confirm Password",
    userProfiles: "User Profiles",
    switchUser: "Switch User",
    createNewProfile: "Create New Profile",
    deleteProfile: "Delete Profile",

    // Motivational Quotes
    newQuote: "New Quote",

    // Categories
    financial: "Financial",
    audience: "Audience",
    products: "Products",
    social: "Social Media",
    contentCreation: "Content Creation",
    design: "Design",
    writing: "Writing",
    marketing: "Marketing",
    planning: "Planning",
    other: "Other",

    // Platforms
    whop: "Whop",
    gumroad: "Gumroad",
    payhip: "Payhip",
    instagram: "Instagram",
    tiktok: "TikTok",
    youtube: "YouTube",
    twitter: "Twitter/X",
    linkedin: "LinkedIn",
    facebook: "Facebook",
    pinterest: "Pinterest",

    // Messages
    usernameRequired: "Username is required",
    passwordRequired: "Password is required",
    emailRequired: "Email is required",
    invalidEmail: "Please enter a valid email address",
    passwordTooShort: "Password must be at least 4 characters",
    usernameTooShort: "Username must be at least 3 characters",
    displayNameTooShort: "Display name must be at least 2 characters",
    usernameExists: "Username already exists",
    userNotFound: "User not found",
    invalidPassword: "Invalid password",
    loginSuccessful: "Login successful",
    registerSuccessful: "Account created successfully",
    dataResetWarning:
      "⚠️ WARNING: This will delete ALL your data!\n\n• All earnings\n• All goals\n• All generated ideas\n• All settings\n\nThis action CANNOT be undone!\n\nAre you sure you want to continue?",
    dataResetSuccess: "✅ All data has been reset successfully!",
    taskCreated: "Task created successfully!",
    goalCreated: "Goal created successfully!",
    accountCreated: "Account created successfully!",
    earningAdded: "Earning added successfully!",

    // Settings specific
    profile_settings: "Profile Settings",
    privacy_data: "Privacy & Data",
    data_management: "Data Management",
    danger_zone: "Danger Zone",
    display_name: "Display Name",
    bio: "Bio",
    your_full_name: "Your full name",
    your_email: "your@email.com",
    tell_about_yourself: "Tell us about yourself...",
    email_notifications: "Email Notifications",
    push_notifications: "Push Notifications",
    goal_reminders: "Goal Reminders",
    task_reminders: "Task Reminders",
    weekly_reports: "Weekly Reports",
    dark_mode: "Dark Mode",
    compact_view: "Compact View",
    animations: "Animations",
    switch_theme: "Switch between light and dark theme",
    denser_interface: "Denser interface with less spacing",
    visual_effects: "Visual effects and transitions",
    data_analytics: "Data Analytics",
    auto_backup: "Auto Backup",
    allow_data_collection: "Allow data collection to improve experience",
    create_auto_backups: "Create automatic backups of your data",
    export_data: "Export Data",
    import_data: "Import Data",
    backups: "Backups",
    create: "Create",
    no_backups_found: "No backups found",
    data_exported: "Data exported successfully!",
    data_imported: "Data imported successfully!",
    backup_created: "Backup created successfully!",
    backup_restored: "Backup restored successfully!",
    error_exporting: "Error exporting data",
    error_importing: "Error importing data",
    error_restoring: "Error restoring backup",
    invalid_file: "Invalid file",
    confirm_restore: "Are you sure you want to restore this backup? All current data will be replaced.",
    reset_all_data: "Reset All Data",
    reset_warning:
      "This will permanently delete all your data including earnings, goals, product ideas, and settings. This action cannot be undone.",
    reset_confirm:
      "⚠️ WARNING: This will delete ALL your data!\n\n• All earnings\n• All goals\n• All generated ideas\n• All settings\n\nThis action CANNOT be undone!\n\nAre you sure you want to continue?",
    data_reset_success: "✅ All data has been reset successfully!",
    error_resetting: "❌ Error resetting data. Please try again.",
    saving: "Saving...",
    loading_settings: "Loading settings...",
    connected: "Connected",
  },

  pt: {
    // Navigation
    dashboard: "Painel",
    tools: "Ferramentas",
    goals: "Metas",
    earnings: "Ganhos",
    accounts: "Contas",
    settings: "Configurações",

    // Common
    add: "Adicionar",
    edit: "Editar",
    delete: "Excluir",
    save: "Salvar",
    cancel: "Cancelar",
    loading: "Carregando",
    success: "Sucesso",
    error: "Erro",
    active: "Ativo",
    inactive: "Inativo",
    completed: "Concluído",
    pending: "Pendente",
    "in-progress": "Em Progresso",
    high: "Alta",
    medium: "Média",
    low: "Baixa",
    today: "Hoje",
    yesterday: "Ontem",
    thisMonth: "Este Mês",
    total: "Total",
    progress: "Progresso",
    target: "Meta",
    current: "Atual",

    // Dashboard
    welcomeBack: "Bem-vindo de volta, Criador! 🚀",
    digitalEmpire:
      "Seu império digital te aguarda. Acompanhe seu progresso, gere ideias e alcance seus objetivos empreendedores.",
    performanceOverview: "📊 Visão Geral do Desempenho",
    todaysContentSchedule: "📅 Cronograma de Conteúdo de Hoje",
    lockedSavings: "Poupança Bloqueada",
    monthlyRevenue: "Receita Mensal",
    activeAffiliates: "Afiliados Ativos",
    goalProgress: "Progresso das Metas",
    dailyMotivation: "Motivação Diária",
    dailyGoalProgress: "Progresso da Meta Diária",
    keepPushing: "Continue se esforçando! Você está a",
    awayFromTarget: "% da sua meta diária.",

    // Goals
    yourGoals: "Suas Metas 🎯",
    setFirstGoals: "Defina suas primeiras metas e comece a construir seu império digital",
    trackProgress: "Acompanhe seu progresso e alcance seus sonhos empreendedores",
    buildDigitalEmpire: "Defina suas primeiras metas e comece a construir seu império digital",
    goalsCompleted: "Metas Concluídas",
    inProgress: "Em Progresso",
    successRate: "Taxa de Sucesso",
    daysToNextMilestone: "Dias para Próximo Marco",
    addNewGoal: "Adicionar Nova Meta",
    createNewGoal: "Criar Nova Meta",
    goalTitle: "Título da Meta",
    category: "Categoria",
    deadline: "Prazo",
    description: "Descrição",
    initialStatus: "Status Inicial",
    goalPreview: "Visualização da Meta",
    createGoal: "Criar Meta",

    // Tasks
    contentCalendar: "Calendário de Conteúdo",
    addNewTask: "Adicionar Nova Tarefa",
    taskTitle: "Título da Tarefa",
    priority: "Prioridade",
    status: "Status",
    noTasksToday: "Nenhuma tarefa para hoje",
    organizingDay: "Comece a organizar seu dia adicionando sua primeira tarefa!",
    addFirstTask: "Adicionar primeira tarefa",

    // Accounts
    accountManager: "Gerenciador de Contas 🔐",
    manageAccounts: "Gerencie todas as suas plataformas de vendas e contas de redes sociais em um local seguro",
    totalAccounts: "Total de Contas",
    salesPlatforms: "Plataformas de Vendas",
    socialMedia: "Redes Sociais",
    totalRevenue: "Receita Total",
    addAccount: "Adicionar Conta",
    accountName: "Nome da Conta",
    username: "Nome de Usuário",
    email: "Email",
    password: "Senha",
    followers: "Seguidores",
    earnings: "Ganhos",
    accountStatus: "Status da Conta",
    notes: "Notas",
    accountPreview: "Visualização da Conta",
    createAccount: "Criar Conta",

    // Earnings
    earningsTracker: "Rastreador de Ganhos 💰",
    trackDailyEarnings:
      "Acompanhe seus ganhos diários e veja seu império crescer. Todos os ganhos atualizam automaticamente as estatísticas do painel.",
    todaysEarnings: "Ganhos de Hoje",
    thisMonthEarnings: "Este Mês",
    bestMonth: "Melhor Mês",
    addTodaysEarnings: "Adicionar Ganhos de Hoje",
    amount: "Valor",
    source: "Fonte",
    earningsHistory: "Histórico de Ganhos",
    monthlyStats: "Estatísticas Mensais",
    overview: "Visão Geral",

    // Settings
    profileSettings: "Configurações do Perfil",
    notifications: "Notificações",
    appearance: "Aparência",
    language: "Idioma",
    english: "Inglês",
    portuguese: "Português",
    privacySecurity: "Privacidade e Segurança",
    resetAllData: "Resetar Todos os Dados",
    dangerZone: "Zona de Perigo",
    deleteAllData:
      "Isso irá deletar permanentemente todos os seus dados incluindo ganhos, metas, ideias de produtos e configurações. Esta ação não pode ser desfeita.",
    exportData: "Exportar Dados",

    // User Management
    login: "Entrar",
    register: "Registrar",
    logout: "Sair",
    createAccount: "Criar Conta",
    loginToAccount: "Entrar na Conta",
    displayName: "Nome de Exibição",
    confirmPassword: "Confirmar Senha",
    userProfiles: "Perfis de Usuário",
    switchUser: "Trocar Usuário",
    createNewProfile: "Criar Novo Perfil",
    deleteProfile: "Excluir Perfil",

    // Motivational Quotes
    newQuote: "Nova Frase",

    // Categories
    financial: "Financeiro",
    audience: "Audiência",
    products: "Produtos",
    social: "Redes Sociais",
    contentCreation: "Criação de Conteúdo",
    design: "Design",
    writing: "Escrita",
    marketing: "Marketing",
    planning: "Planejamento",
    other: "Outro",

    // Platforms
    whop: "Whop",
    gumroad: "Gumroad",
    payhip: "Payhip",
    instagram: "Instagram",
    tiktok: "TikTok",
    youtube: "YouTube",
    twitter: "Twitter/X",
    linkedin: "LinkedIn",
    facebook: "Facebook",
    pinterest: "Pinterest",

    // Messages
    usernameRequired: "Nome de usuário é obrigatório",
    passwordRequired: "Senha é obrigatória",
    emailRequired: "Email é obrigatório",
    invalidEmail: "Por favor, insira um email válido",
    passwordTooShort: "A senha deve ter pelo menos 4 caracteres",
    usernameTooShort: "O nome de usuário deve ter pelo menos 3 caracteres",
    displayNameTooShort: "O nome de exibição deve ter pelo menos 2 caracteres",
    usernameExists: "Nome de usuário já existe",
    userNotFound: "Usuário não encontrado",
    invalidPassword: "Senha inválida",
    loginSuccessful: "Login realizado com sucesso",
    registerSuccessful: "Conta criada com sucesso",
    dataResetWarning:
      "⚠️ ATENÇÃO: Isso vai apagar TODOS os seus dados!\n\n• Todos os ganhos\n• Todas as metas\n• Todas as ideias geradas\n• Todas as configurações\n\nEsta ação NÃO PODE ser desfeita!\n\nTem certeza que quer continuar?",
    dataResetSuccess: "✅ Todos os dados foram resetados com sucesso!",
    taskCreated: "Tarefa criada com sucesso!",
    goalCreated: "Meta criada com sucesso!",
    accountCreated: "Conta criada com sucesso!",
    earningAdded: "Ganho adicionado com sucesso!",

    // Settings specific
    profile_settings: "Configurações do Perfil",
    privacy_data: "Privacidade e Dados",
    data_management: "Gerenciamento de Dados",
    danger_zone: "Zona de Perigo",
    display_name: "Nome de Exibição",
    bio: "Bio",
    your_full_name: "Seu nome completo",
    your_email: "seu@email.com",
    tell_about_yourself: "Conte um pouco sobre você...",
    email_notifications: "Notificações por Email",
    push_notifications: "Notificações Push",
    goal_reminders: "Lembretes de Metas",
    task_reminders: "Lembretes de Tarefas",
    weekly_reports: "Relatórios Semanais",
    dark_mode: "Modo Escuro",
    compact_view: "Visualização Compacta",
    animations: "Animações",
    switch_theme: "Alternar entre tema claro e escuro",
    denser_interface: "Interface mais densa com menos espaçamento",
    visual_effects: "Efeitos visuais e transições",
    data_analytics: "Análise de Dados",
    auto_backup: "Backup Automático",
    allow_data_collection: "Permitir coleta de dados para melhorar a experiência",
    create_auto_backups: "Criar backups automáticos dos seus dados",
    export_data: "Exportar Dados",
    import_data: "Importar Dados",
    backups: "Backups",
    create: "Criar",
    no_backups_found: "Nenhum backup encontrado",
    data_exported: "Dados exportados com sucesso!",
    data_imported: "Dados importados com sucesso!",
    backup_created: "Backup criado com sucesso!",
    backup_restored: "Backup restaurado com sucesso!",
    error_exporting: "Erro ao exportar dados",
    error_importing: "Erro ao importar dados",
    error_restoring: "Erro ao restaurar backup",
    invalid_file: "Arquivo inválido",
    confirm_restore: "Tem certeza que deseja restaurar este backup? Todos os dados atuais serão substituídos.",
    reset_all_data: "Resetar Todos os Dados",
    reset_warning:
      "Isso irá apagar permanentemente todos os seus dados incluindo ganhos, metas, ideias de produtos e configurações. Esta ação não pode ser desfeita.",
    reset_confirm:
      "⚠️ ATENÇÃO: Isso vai apagar TODOS os seus dados!\n\n• Todos os ganhos\n• Todas as metas\n• Todas as ideias geradas\n• Todas as configurações\n\nEsta ação NÃO PODE ser desfeita!\n\nTem certeza que quer continuar?",
    data_reset_success: "✅ Todos os dados foram resetados com sucesso!",
    error_resetting: "❌ Erro ao resetar dados. Tente novamente.",
    saving: "Salvando...",
    loading_settings: "Carregando configurações...",
    connected: "Conectado",
  },
}

// Hook para usar traduções
export function useTranslations(language: Language): Translations {
  return translations[language]
}

// Função para obter tradução específica
export function t(key: keyof Translations, language: Language): string {
  return translations[language][key] || translations.en[key] || key
}
