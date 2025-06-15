import { db } from "./database"

// Gerador de ideias mais inteligente que evita duplicatas
export async function generateProductIdeas(topic: string, region: string, productType: string) {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Buscar ideias existentes
  const existingIdeas = db.getProductIdeasByTopic(topic, region, productType)
  const existingTitles = existingIdeas.map((idea) => idea.title.toLowerCase())

  const ideaTemplates = {
    "Marketing Digital": [
      `Complete ${topic} Guide for Beginners`,
      `Advanced Course: ${topic} that Converts`,
      `${topic} Masterclass: Secret Strategies`,
      `${topic} from Zero: Proven Method`,
      `${topic} Automation: Practical Guide`,
      `${topic} for E-commerce: Advanced Techniques`,
      `Sales Funnel with ${topic}: Step by Step`,
      `${topic} B2B: Corporate Strategies`,
      `${topic} Mobile: Smartphone Era`,
      `AI in ${topic}: Future of Sales`,
    ],
    Investimentos: [
      `${topic}: From Zero to First Million`,
      `Investing in ${topic}: Safe Guide`,
      `${topic} for Beginners: Risk-Free`,
      `${topic} Portfolio: Smart Diversification`,
      `Advanced ${topic}: Pro Strategies`,
      `Passive Income with ${topic}`,
      `${topic}: Fundamental Analysis`,
      `International ${topic}: Global Markets`,
      `${topic} and Taxes: Fiscal Guide`,
      `${topic}: Wealth Protection`,
    ],
    Fitness: [
      `${topic} Transformation: 90 Days`,
      `${topic} at Home: No Gym Required`,
      `${topic} for Beginners: First Steps`,
      `Advanced ${topic}: Next Level`,
      `Nutrition and ${topic}: Perfect Combination`,
      `${topic} for Women: Specific Program`,
      `Functional ${topic}: Natural Movement`,
      `${topic} and Longevity: Lasting Health`,
      `Mental ${topic}: Mind and Body`,
      `Competitive ${topic}: Athletic Preparation`,
    ],
  }

  // Gerar títulos únicos
  const availableTitles = ideaTemplates[topic as keyof typeof ideaTemplates] || [
    `${topic} Masterclass`,
    `${topic}: Practical and Definitive Guide`,
    `Secrets of ${topic}: Advanced Techniques`,
    `Professional ${topic}: Exclusive Method`,
    `${topic} 360°: Complete Vision`,
    `Strategic ${topic}: Total Planning`,
    `Digital ${topic}: Modern Era`,
    `Essential ${topic}: Solid Foundations`,
    `Innovative ${topic}: New Approaches`,
    `Practical ${topic}: Real Results`,
  ]

  // Filtrar títulos que ainda não existem
  const newTitles = availableTitles.filter((title) => !existingTitles.includes(title.toLowerCase()))

  if (newTitles.length === 0) {
    // Se não há títulos novos, gerar variações
    const variations = [
      `${topic} 2.0: New Generation`,
      `${topic} Premium: Special Edition`,
      `${topic} Masterclass: Updated Version`,
      `${topic} Pro: Exclusive Techniques`,
      `${topic} Ultimate: Definitive Guide`,
    ]
    newTitles.push(...variations)
  }

  // Gerar 2-3 novas ideias
  const newIdeas = newTitles.slice(0, 3).map((title, index) => {
    const potentials = ["High", "Very High", "Medium"]
    const difficulties = ["Easy", "Medium", "Hard"]
    const niches = [topic, `Advanced ${topic}`, `Specialized ${topic}`]

    const idea = {
      title,
      niche: niches[index] || topic,
      potential: potentials[Math.floor(Math.random() * potentials.length)],
      difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
      estimatedRevenue: generateRevenueRange(region),
      description: `${title} - A complete program about ${topic} developed specifically for the ${region} market, with exclusive methodology and proven results.`,
      keywords: generateKeywords(topic),
      topic,
      region,
      productType,
    }

    // Salvar no banco de dados
    return db.addProductIdea(idea)
  })

  return newIdeas
}

export async function researchTrendingProducts(topic: string, region: string, productType: string) {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const existing = db.getTrendingProductsByTopic(topic, region, productType)
  const existingTitles = existing.map((p) => p.title.toLowerCase())

  const trendingTemplates = {
    "Marketing Digital": [
      `${productType}s for E-commerce Marketing`,
      `Marketing Automation ${productType}s`,
      `Growth Hacking ${productType}s`,
      `Content Marketing ${productType}s`,
      `Advanced SEO ${productType}s`,
      `Instagram Marketing ${productType}s`,
      `Email Marketing ${productType}s`,
      `B2B Marketing ${productType}s`,
    ],
    Investimentos: [
      `Cryptocurrency ${productType}s`,
      `Fixed Income ${productType}s`,
      `Stock Market ${productType}s`,
      `Real Estate Funds ${productType}s`,
      `Day Trading ${productType}s`,
      `Swing Trading ${productType}s`,
      `Technical Analysis ${productType}s`,
      `Financial Education ${productType}s`,
    ],
    Fitness: [
      `Home Workout ${productType}s`,
      `Bodybuilding ${productType}s`,
      `HIIT Cardio ${productType}s`,
      `Yoga ${productType}s`,
      `Pilates ${productType}s`,
      `Crossfit ${productType}s`,
      `Sports Nutrition ${productType}s`,
      `Weight Loss ${productType}s`,
    ],
  }

  const availableTitles = trendingTemplates[topic as keyof typeof trendingTemplates] || [
    `${topic} ${productType}s`,
    `Advanced ${topic} ${productType}s`,
    `Practical ${topic} ${productType}s`,
    `Specialized ${topic} ${productType}s`,
  ]

  const newTitles = availableTitles.filter((title) => !existingTitles.includes(title.toLowerCase()))

  const trends = ["+320%", "+278%", "+245%", "+189%", "+156%", "+134%", "+112%", "+98%"]
  const competitions = ["Low", "Medium", "High"]
  const demands = ["Medium", "High", "Very High"]

  const newProducts = newTitles.slice(0, 2).map((title, index) => {
    const product = {
      title,
      category: topic,
      trend: trends[Math.floor(Math.random() * trends.length)],
      avgPrice: generatePrice(region),
      competition: competitions[Math.floor(Math.random() * competitions.length)],
      demand: demands[Math.floor(Math.random() * demands.length)],
      region,
      description: `${title} are trending in the ${region} market with significant growth`,
      topic,
      productType,
    }

    return db.addTrendingProduct(product)
  })

  return newProducts
}

export async function generateAffiliateKits(productName: string, topic: string) {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const existing = db.getAffiliateKitsByProduct(productName, topic)
  const existingTitles = existing.map((k) => k.title.toLowerCase())

  const kitTypes = [
    "Complete Kit",
    "Premium Kit",
    "Starter Kit",
    "Advanced Kit",
    "Professional Kit",
    "Ultimate Kit",
    "Essential Kit",
    "Master Kit",
  ]

  const availableKits = kitTypes.filter(
    (type) => !existingTitles.includes(`${type.toLowerCase()} - ${productName.toLowerCase()}`),
  )

  const componentTemplates = {
    "Marketing Digital": [
      "Professional banners (10 different sizes)",
      "Email sequence (7 ready emails)",
      "Social media posts (15 posts + stories)",
      "Presentation video (script + template)",
      "Optimized landing page (template)",
      "Complete webinar script",
      "Sales arguments (objections and answers)",
      "Support materials (PDFs and infographics)",
    ],
    default: [
      `Custom banners for ${topic} (8 sizes)`,
      `Promotional emails about ${topic} (5 sequences)`,
      `Social media posts about ${topic} (12 posts)`,
      `${productName} presentation video`,
      `Specific sales arguments for ${topic}`,
      `Optimized landing pages (3 models)`,
      `Support materials about ${topic}`,
      `Affiliate training (video)`,
    ],
  }

  const components = componentTemplates[topic as keyof typeof componentTemplates] || componentTemplates.default

  const newKits = availableKits.slice(0, 2).map((kitType, index) => {
    const selectedComponents = components.sort(() => Math.random() - 0.5).slice(0, 4 + index)

    const commissions = ["40%", "45%", "50%", "55%", "60%"]
    const conversions = ["7.5%", "8.7%", "9.8%", "12.5%", "15.2%"]

    const kit = {
      title: `${kitType} - ${productName}`,
      components: selectedComponents,
      commission: commissions[Math.floor(Math.random() * commissions.length)],
      conversionRate: conversions[Math.floor(Math.random() * conversions.length)],
      description: `${kitType} for affiliates to promote ${productName} in the ${topic} niche with optimized materials`,
      productName,
      topic,
    }

    return db.addAffiliateKit(kit)
  })

  return newKits
}

// Funções auxiliares atualizadas para USD
function generateRevenueRange(region: string): string {
  const baseRanges = {
    Brasil: [800, 12000],
    "Estados Unidos": [2500, 40000],
    Europa: [2000, 32000],
    "América Latina": [600, 10000],
    Ásia: [1000, 15000],
  }

  const range = baseRanges[region as keyof typeof baseRanges] || baseRanges["Brasil"]
  const min = range[0] + Math.floor(Math.random() * 1000)
  const max = range[1] + Math.floor(Math.random() * 5000)

  return `$${min.toLocaleString()}-${max.toLocaleString()}/month`
}

function generatePrice(region: string): string {
  const basePrices = {
    Brasil: [19, 197],
    "Estados Unidos": [49, 497],
    Europa: [39, 397],
    "América Latina": [15, 149],
    Ásia: [25, 249],
  }

  const range = basePrices[region as keyof typeof basePrices] || basePrices["Brasil"]
  const price = range[0] + Math.floor(Math.random() * (range[1] - range[0]))

  return `$${price}`
}

function generateKeywords(topic: string): string[] {
  const baseKeywords = [topic.toLowerCase()]
  const commonKeywords = ["course", "guide", "method", "strategy", "technique", "practical", "advanced", "complete"]

  return [...baseKeywords, ...commonKeywords.sort(() => Math.random() - 0.5).slice(0, 3)]
}
