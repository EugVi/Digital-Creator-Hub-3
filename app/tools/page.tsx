"use client"

import { useState, useEffect } from "react"
import { Navigation } from "../../components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Lightbulb,
  TrendingUp,
  Users,
  Sparkles,
  RefreshCw,
  Search,
  MapPin,
  DollarSign,
  Star,
  AlertCircle,
  CheckCircle,
  Zap,
  History,
  Database,
  Download,
} from "lucide-react"
import { generateProductIdeas, researchTrendingProducts, generateAffiliateKits } from "../../lib/gemini"
import { db, type ProductIdea, type TrendingProduct, type AffiliateKit } from "../../lib/database"

const regions = [
  { value: "Brasil", label: "Brasil" },
  { value: "Estados Unidos", label: "Estados Unidos" },
  { value: "Europa", label: "Europa" },
  { value: "América Latina", label: "América Latina" },
  { value: "Ásia", label: "Ásia" },
]

const productTypes = [
  { value: "E-book", label: "E-books" },
  { value: "Curso Online", label: "Cursos Online" },
  { value: "Audiobook", label: "Audiobooks" },
  { value: "Template", label: "Templates" },
  { value: "Software", label: "Software/Apps" },
]

const topicSuggestions = [
  "Marketing Digital",
  "Investimentos",
  "Fitness",
  "Culinária Saudável",
  "Programação",
  "Design Gráfico",
  "E-commerce",
  "Vendas",
  "Liderança",
  "Produtividade",
  "Idiomas",
  "Fotografia",
  "Música",
  "Empreendedorismo",
]

export default function ToolsPage() {
  const [selectedRegion, setSelectedRegion] = useState("Brasil")
  const [selectedProductType, setSelectedProductType] = useState("E-book")
  const [productName, setProductName] = useState("")
  const [topicIdeas, setTopicIdeas] = useState("")
  const [topicResearch, setTopicResearch] = useState("")
  const [topicKits, setTopicKits] = useState("")

  const [isGenerating, setIsGenerating] = useState({ ideas: false, research: false, kits: false })
  const [errors, setErrors] = useState({ ideas: "", research: "", kits: "" })
  const [success, setSuccess] = useState({ ideas: false, research: false, kits: false })

  const [currentProductIdeas, setCurrentProductIdeas] = useState<ProductIdea[]>([])
  const [currentTrendingProducts, setCurrentTrendingProducts] = useState<TrendingProduct[]>([])
  const [currentAffiliateKits, setCurrentAffiliateKits] = useState<AffiliateKit[]>([])

  // Histórico completo
  const [allProductIdeas, setAllProductIdeas] = useState<ProductIdea[]>([])
  const [allTrendingProducts, setAllTrendingProducts] = useState<TrendingProduct[]>([])
  const [allAffiliateKits, setAllAffiliateKits] = useState<AffiliateKit[]>([])

  // Carregar dados do banco ao inicializar
  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = () => {
    setAllProductIdeas(db.getAllProductIdeas())
    setAllTrendingProducts(db.getAllTrendingProducts())
    setAllAffiliateKits(db.getAllAffiliateKits())
  }

  const handleGenerateIdeas = async () => {
    if (!topicIdeas.trim()) {
      setErrors((prev) => ({ ...prev, ideas: "Por favor, digite um tópico específico" }))
      return
    }

    setIsGenerating((prev) => ({ ...prev, ideas: true }))
    setErrors((prev) => ({ ...prev, ideas: "" }))
    setSuccess((prev) => ({ ...prev, ideas: false }))

    try {
      const ideas = await generateProductIdeas(topicIdeas, selectedRegion, selectedProductType)
      setCurrentProductIdeas(ideas)
      setSuccess((prev) => ({ ...prev, ideas: true }))
      loadAllData() // Recarregar dados completos
    } catch (error) {
      setErrors((prev) => ({ ...prev, ideas: "Erro ao gerar ideias. Tente novamente." }))
    } finally {
      setIsGenerating((prev) => ({ ...prev, ideas: false }))
    }
  }

  const handleResearchProducts = async () => {
    if (!topicResearch.trim()) {
      setErrors((prev) => ({ ...prev, research: "Por favor, digite um tópico para pesquisar" }))
      return
    }

    setIsGenerating((prev) => ({ ...prev, research: true }))
    setErrors((prev) => ({ ...prev, research: "" }))
    setSuccess((prev) => ({ ...prev, research: false }))

    try {
      const products = await researchTrendingProducts(topicResearch, selectedRegion, selectedProductType)
      setCurrentTrendingProducts(products)
      setSuccess((prev) => ({ ...prev, research: true }))
      loadAllData()
    } catch (error) {
      setErrors((prev) => ({ ...prev, research: "Erro ao pesquisar produtos. Tente novamente." }))
    } finally {
      setIsGenerating((prev) => ({ ...prev, research: false }))
    }
  }

  const handleGenerateKits = async () => {
    if (!productName.trim() || !topicKits.trim()) {
      setErrors((prev) => ({ ...prev, kits: "Por favor, preencha o nome do produto e o tópico" }))
      return
    }

    setIsGenerating((prev) => ({ ...prev, kits: true }))
    setErrors((prev) => ({ ...prev, kits: "" }))
    setSuccess((prev) => ({ ...prev, kits: false }))

    try {
      const kits = await generateAffiliateKits(productName, topicKits)
      setCurrentAffiliateKits(kits)
      setSuccess((prev) => ({ ...prev, kits: true }))
      loadAllData()
    } catch (error) {
      setErrors((prev) => ({ ...prev, kits: "Erro ao gerar kits. Tente novamente." }))
    } finally {
      setIsGenerating((prev) => ({ ...prev, kits: false }))
    }
  }

  const exportData = () => {
    const data = db.exportData()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `digital-creator-hub-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const stats = db.getStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navigation />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-purple-600 via-electric-600 to-purple-600 bg-clip-text text-transparent">
            Ferramentas IA para Produtos Digitais 🤖
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Descubra oportunidades de alto potencial e crie estratégias vencedoras com inteligência artificial
          </p>

          {/* Estatísticas do Banco de Dados */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <Badge className="bg-gradient-to-r from-purple-500 to-electric-500 text-white">
              <Database className="h-3 w-3 mr-1" />
              {stats.totalIdeas} Ideias Salvas
            </Badge>
            <Badge className="bg-gradient-to-r from-electric-500 to-purple-500 text-white">
              <TrendingUp className="h-3 w-3 mr-1" />
              {stats.totalTrendingProducts} Produtos Pesquisados
            </Badge>
            <Badge className="bg-gradient-to-r from-gray-700 to-gray-900 text-white">
              <Users className="h-3 w-3 mr-1" />
              {stats.totalKits} Kits Criados
            </Badge>
            <Button onClick={exportData} variant="outline" size="sm">
              <Download className="h-3 w-3 mr-1" />
              Exportar Dados
            </Button>
          </div>

          {/* Topic Suggestions */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <span className="text-sm text-gray-500 mr-2">Tópicos populares:</span>
            {topicSuggestions.slice(0, 6).map((topic) => (
              <Badge
                key={topic}
                variant="outline"
                className="cursor-pointer hover:bg-purple-50 hover:border-purple-300 transition-colors"
                onClick={() => {
                  setTopicIdeas(topic)
                  setTopicResearch(topic)
                  setTopicKits(topic)
                }}
              >
                {topic}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tools com Tabs para mostrar histórico */}
        <div className="space-y-8">
          {/* 1. Gerador de Ideias de Produtos */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-electric-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-display">
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-electric-500">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                Gerador de Ideias de Produtos (IA)
                <Badge className="bg-gradient-to-r from-purple-500 to-electric-500 text-white">
                  <Zap className="h-3 w-3 mr-1" />
                  IA Simulada
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600">
                Nossa IA gera ideias únicas de produtos digitais. Cada nova geração com o mesmo tópico criará produtos
                diferentes, e todos ficam salvos automaticamente.
              </p>

              <div className="space-y-4">
                <div>
                  <Label>Tópico Específico *</Label>
                  <Input
                    placeholder="Ex: Marketing Digital, Investimentos, Culinária Saudável..."
                    value={topicIdeas}
                    onChange={(e) => setTopicIdeas(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Região de Interesse</Label>
                    <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region.value} value={region.value}>
                            {region.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Tipo de Produto</Label>
                    <Select value={selectedProductType} onValueChange={setSelectedProductType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {productTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {errors.ideas && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.ideas}</AlertDescription>
                </Alert>
              )}

              {success.ideas && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    ✅ Novas ideias geradas e salvas! Confira os resultados abaixo.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleGenerateIdeas}
                disabled={isGenerating.ideas}
                className="w-full bg-gradient-to-r from-purple-500 to-electric-500 hover:from-purple-600 hover:to-electric-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isGenerating.ideas ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Gerando Novas Ideias...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Gerar Novas Ideias
                  </>
                )}
              </Button>

              {/* Tabs para mostrar resultados atuais e histórico */}
              <Tabs defaultValue="current" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="current">Últimas Geradas ({currentProductIdeas.length})</TabsTrigger>
                  <TabsTrigger value="history">
                    <History className="h-4 w-4 mr-1" />
                    Histórico Completo ({allProductIdeas.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="current" className="space-y-4">
                  {currentProductIdeas.length > 0 ? (
                    currentProductIdeas.map((idea, index) => (
                      <div
                        key={idea.id}
                        className="p-4 rounded-lg bg-white/80 backdrop-blur-sm border border-purple-100 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{idea.title}</h4>
                          <Badge
                            className={`${idea.potential === "Muito Alto" ? "bg-green-100 text-green-700" : idea.potential === "Alto" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}
                          >
                            {idea.potential} Potencial
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{idea.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500">Nicho:</span>
                            <p className="font-medium">{idea.niche}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Dificuldade:</span>
                            <p className="font-medium">{idea.difficulty}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Receita Est.:</span>
                            <p className="font-medium text-green-600">{idea.estimatedRevenue}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Criado:</span>
                            <p className="font-medium">{new Date(idea.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Nenhuma ideia gerada ainda. Clique no botão acima para começar!
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="history" className="space-y-4 max-h-96 overflow-y-auto">
                  {allProductIdeas.length > 0 ? (
                    allProductIdeas.reverse().map((idea) => (
                      <div
                        key={idea.id}
                        className="p-3 rounded-lg bg-white/60 backdrop-blur-sm border border-purple-100 hover:bg-white/80 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <h5 className="font-medium text-gray-900 text-sm">{idea.title}</h5>
                          <Badge variant="outline" className="text-xs">
                            {idea.topic} | {idea.region}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{idea.description}</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{idea.estimatedRevenue}</span>
                          <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">Nenhuma ideia no histórico ainda.</p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* 2. Pesquisa de Produtos em Alta - Similar structure */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-electric-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-display">
                <div className="p-3 rounded-lg bg-gradient-to-br from-electric-500 to-purple-500">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                Pesquisa de Produtos em Alta (IA)
                <Badge className="bg-gradient-to-r from-electric-500 to-purple-500 text-white">
                  <Search className="h-3 w-3 mr-1" />
                  Análise Inteligente
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600">
                Descubra produtos digitais em alta. Cada pesquisa encontra novos produtos em tendência, todos salvos
                automaticamente.
              </p>

              <div className="space-y-4">
                <div>
                  <Label>Tópico para Pesquisar *</Label>
                  <Input
                    placeholder="Ex: Fitness, Finanças Pessoais, Design Gráfico..."
                    value={topicResearch}
                    onChange={(e) => setTopicResearch(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Região para Análise</Label>
                    <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region.value} value={region.value}>
                            <MapPin className="h-4 w-4 mr-2" />
                            {region.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Categoria de Produto</Label>
                    <Select value={selectedProductType} onValueChange={setSelectedProductType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {productTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {errors.research && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.research}</AlertDescription>
                </Alert>
              )}

              {success.research && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    ✅ Novos produtos encontrados e salvos! Veja os resultados abaixo.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleResearchProducts}
                disabled={isGenerating.research}
                className="w-full bg-gradient-to-r from-electric-500 to-purple-500 hover:from-electric-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isGenerating.research ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Pesquisando Novos Produtos...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Pesquisar Novos Produtos
                  </>
                )}
              </Button>

              <Tabs defaultValue="current" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="current">Últimos Encontrados ({currentTrendingProducts.length})</TabsTrigger>
                  <TabsTrigger value="history">
                    <History className="h-4 w-4 mr-1" />
                    Histórico Completo ({allTrendingProducts.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="current" className="space-y-4">
                  {currentTrendingProducts.length > 0 ? (
                    currentTrendingProducts.map((product) => (
                      <div
                        key={product.id}
                        className="p-4 rounded-lg bg-white/80 backdrop-blur-sm border border-electric-100 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{product.title}</h4>
                          <Badge className="bg-green-100 text-green-700">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {product.trend}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500">Categoria:</span>
                            <p className="font-medium">{product.category}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Preço Médio:</span>
                            <p className="font-medium text-green-600">{product.avgPrice}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Competição:</span>
                            <p className="font-medium">{product.competition}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Demanda:</span>
                            <p className="font-medium">{product.demand}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Criado:</span>
                            <p className="font-medium">{new Date(product.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Nenhum produto pesquisado ainda. Clique no botão acima para começar!
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="history" className="space-y-4 max-h-96 overflow-y-auto">
                  {allTrendingProducts.length > 0 ? (
                    allTrendingProducts.reverse().map((product) => (
                      <div
                        key={product.id}
                        className="p-3 rounded-lg bg-white/60 backdrop-blur-sm border border-electric-100 hover:bg-white/80 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <h5 className="font-medium text-gray-900 text-sm">{product.title}</h5>
                          <Badge variant="outline" className="text-xs">
                            {product.topic} | {product.region}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>
                            {product.avgPrice} | {product.trend}
                          </span>
                          <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">Nenhum produto no histórico ainda.</p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* 3. Gerador de Kits para Afiliados - Similar structure */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-display">
                <div className="p-3 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900">
                  <Users className="h-6 w-6 text-white" />
                </div>
                Gerador de Kits para Afiliados (IA)
                <Badge className="bg-gradient-to-r from-gray-700 to-gray-900 text-white">
                  <Star className="h-3 w-3 mr-1" />
                  Conversão Otimizada
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600">
                Crie kits únicos para afiliados. Cada geração com o mesmo produto cria kits diferentes, todos salvos
                automaticamente.
              </p>

              <div className="space-y-4">
                <div>
                  <Label>Nome do Seu Produto *</Label>
                  <Input
                    placeholder="Ex: Curso de Marketing Digital Avançado"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Tópico/Nicho do Produto *</Label>
                  <Input
                    placeholder="Ex: Marketing Digital, E-commerce, Vendas Online..."
                    value={topicKits}
                    onChange={(e) => setTopicKits(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              {errors.kits && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.kits}</AlertDescription>
                </Alert>
              )}

              {success.kits && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    ✅ Novos kits gerados e salvos! Veja os materiais abaixo.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleGenerateKits}
                disabled={isGenerating.kits}
                className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-950 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isGenerating.kits ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Criando Novos Kits...
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4 mr-2" />
                    Gerar Novos Kits
                  </>
                )}
              </Button>

              <Tabs defaultValue="current" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="current">Últimos Criados ({currentAffiliateKits.length})</TabsTrigger>
                  <TabsTrigger value="history">
                    <History className="h-4 w-4 mr-1" />
                    Histórico Completo ({allAffiliateKits.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="current" className="space-y-4">
                  {currentAffiliateKits.length > 0 ? (
                    currentAffiliateKits.map((kit) => (
                      <div
                        key={kit.id}
                        className="p-4 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{kit.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-700">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {kit.commission} Comissão
                            </Badge>
                            <Badge className="bg-blue-100 text-blue-700">{kit.conversionRate} Conversão</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{kit.description}</p>
                        <div>
                          <span className="text-gray-500 text-xs">Componentes do Kit:</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                            {kit.components?.map((component: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                                {component}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Nenhum kit gerado ainda. Clique no botão acima para começar!
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="history" className="space-y-4 max-h-96 overflow-y-auto">
                  {allAffiliateKits.length > 0 ? (
                    allAffiliateKits.reverse().map((kit) => (
                      <div
                        key={kit.id}
                        className="p-3 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-200 hover:bg-white/80 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <h5 className="font-medium text-gray-900 text-sm">{kit.title}</h5>
                          <Badge variant="outline" className="text-xs">
                            {kit.topic}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>
                            {kit.commission} | {kit.conversionRate}
                          </span>
                          <span>{new Date(kit.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">Nenhum kit no histórico ainda.</p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
