(function () {
  const categories = [
    { slug: "ai-automation", label: "AI & Automation", short: "AI agents, chatbots, LLM integrations and workflow automation.", url: "/services/ai-automation" },
    { slug: "websites", label: "Websites & Web Apps", short: "Business websites, portals, dashboards and web applications.", url: "/services/websites" },
    { slug: "software-apis", label: "Software, Apps & APIs", short: "Python tools, custom applications, integrations and API backends.", url: "/services/software-apis" },
    { slug: "trading", label: "Trading Bots & Indicators", short: "MT4/MT5 EAs, TradingView automation and signal integrations.", url: "/services/trading-bots" },
    { slug: "cloud-support", label: "Cloud & Technical Support", short: "VPS, cloud deployment, backend services and technical maintenance.", url: "/services/cloud-support" }
  ];

  const services = [
    {
      slug: "custom-mt5-expert-advisor", category: "trading", thumb: "EA", title: "Custom MT5 Expert Advisor",
      description: "Turn defined strategy, execution and risk rules into a configurable MT5 Expert Advisor.",
      href: "/trading-bot-development", meta: "MT4 / MT5 · MQL4 / MQL5", keywords: "mt5 ea expert advisor mql5 trading bot automation", featured: true,
      audience: "Defined trading rules that need reliable MT5 execution.",
      deliverables: ["Configurable EA source", "Entry, exit and risk logic", "Setup and validation notes"],
      requirements: "Strategy rules, symbol/timeframe, risk limits and trade-management behavior."
    },
    {
      slug: "xauusd-trading-bot", category: "trading", thumb: "XAU", title: "XAUUSD Trading Bot Development",
      description: "Build gold-focused automation with explicit entry, risk, execution and validation rules.",
      href: "/xauusd-trading-bot-development", meta: "XAUUSD · MT5 · Risk controls", keywords: "gold xauusd trading bot mt5 ea", featured: true,
      audience: "Gold strategies that need broker-aware execution and risk controls.",
      deliverables: ["MT5 automation logic", "Execution and risk controls", "Validation setup guidance"],
      requirements: "Exact entry/exit rules, risk model, sessions and broker assumptions."
    },
    {
      slug: "telegram-mt5-copy-bot", category: "trading", thumb: "TG", title: "Telegram to MT5 Copy Trading Bot",
      description: "Parse structured trading signals and manage MT5 execution, updates and partial closes.",
      href: "/mt5-telegram-copy-trading-bot", meta: "Telegram · MT5 · Python", keywords: "telegram mt5 copy trading signal parser", featured: true,
      audience: "Signal channels that need structured, auditable MT5 execution.",
      deliverables: ["Signal parser", "MT5 execution bridge", "Trade-management commands"],
      requirements: "Real signal formats, supported commands, risk rules and target MT5 environment."
    },
    {
      slug: "pine-script-mt5-automation", category: "trading", thumb: "TV", title: "TradingView to MT5 Automation",
      description: "Connect Pine Script alerts to a reliable execution workflow with duplicate protection.",
      href: "/pine-script-to-mt5-automation", meta: "TradingView · Webhooks · MT5", keywords: "pine script tradingview webhook mt5 automation", featured: false,
      audience: "TradingView strategies that need automated MT5 execution.",
      deliverables: ["Alert payload design", "Webhook bridge", "MT5 receiver and trade mapping"],
      requirements: "Pine alert conditions, payload fields and MT5 execution rules."
    },
    {
      slug: "ai-workflow-automation", category: "ai-automation", thumb: "AI", title: "AI Workflow Automation",
      description: "Automate document, routing, approval and operational workflows with AI and APIs.",
      href: "/ai-automation", meta: "AI agents · RAG · APIs", keywords: "ai automation workflow agent rag integration chatbot", featured: true,
      audience: "Repeatable business workflows with clear inputs, actions and review points.",
      deliverables: ["Workflow design", "AI/API integrations", "Error handling and handover"],
      requirements: "Current workflow, connected tools, inputs, outputs and approval rules."
    },
    {
      slug: "llm-agent-development", category: "ai-automation", thumb: "LLM", title: "LLM & AI Agent Development",
      description: "Build tool-using agents, retrieval workflows and private AI integrations around your data.",
      href: "/llm-agent-development", meta: "LLM · RAG · Tool calling", keywords: "llm ai agent rag tools private ai", featured: true,
      audience: "Knowledge or tool-based tasks that need bounded AI actions.",
      deliverables: ["Agent or RAG workflow", "Approved tool integrations", "Evaluation and deployment notes"],
      requirements: "Target tasks, data sources, tools, permissions and quality criteria."
    },
    {
      slug: "web-app-saas", category: "websites", thumb: "WEB", title: "Web App & SaaS Development",
      description: "Build responsive portals, dashboards and software products around a defined workflow.",
      href: "/web-app-development", meta: "Web apps · SaaS · Dashboards", keywords: "website web app saas portal dashboard business website", featured: true,
      audience: "Businesses that need a portal, dashboard or custom web product.",
      deliverables: ["Responsive application", "Backend/API workflows", "Deployment and handover"],
      requirements: "User roles, core screens, data model, integrations and acceptance criteria."
    },
    {
      slug: "api-cloud-backend", category: "software-apis", secondaryCategories: ["cloud-support"], thumb: "API", title: "API & Cloud Backend Development",
      description: "Create APIs, webhooks, database-backed services and deployable cloud/VPS backends.",
      href: "/api-cloud-development", meta: "APIs · FastAPI · Cloud / VPS", keywords: "api python fastapi webhook cloud vps backend integration", featured: true,
      audience: "Products or automations that need reliable backend services and integrations.",
      deliverables: ["API endpoints and webhooks", "Data/integration logic", "Deployment and operational notes"],
      requirements: "Systems to connect, data contracts, authentication needs and deployment target."
    }
  ];

  window.NEXTGEN_SERVICE_CATALOG = { categories, services };
})();