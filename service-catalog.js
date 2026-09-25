(function () {
  const categories = [
    { slug: "ai-automation", label: "AI & Automation", short: "AI agents, chatbots, LLM integrations and workflow automation.", url: "/services/ai-automation" },
    { slug: "websites", label: "Websites & Web Apps", short: "Business websites, portals, dashboards and web applications.", url: "/services/websites" },
    { slug: "software-apis", label: "Software, Apps & APIs", short: "Python tools, custom applications, integrations and API backends.", url: "/services/software-apis" },
    { slug: "trading", label: "Trading Bots & Indicators", short: "MT4/MT5 EAs, TradingView automation and signal integrations.", url: "/services/trading-bots" },
    { slug: "cloud-support", label: "Cloud & Technical Support", short: "VPS, cloud deployment, backend services and technical maintenance.", url: "/services/cloud-support" }
  ];
  const services = [
    { slug: "custom-mt5-expert-advisor", category: "trading", title: "Custom MT5 Expert Advisor", description: "Turn defined strategy, execution and risk rules into a configurable MT5 Expert Advisor.", href: "/trading-bot-development", meta: "MT4 / MT5 · MQL4 / MQL5", keywords: "mt5 ea expert advisor mql5 trading bot automation", featured: true },
    { slug: "xauusd-trading-bot", category: "trading", title: "XAUUSD Trading Bot Development", description: "Build gold-focused automation with explicit entry, risk, execution and validation rules.", href: "/xauusd-trading-bot-development", meta: "XAUUSD · MT5 · Risk controls", keywords: "gold xauusd trading bot mt5 ea", featured: true },
    { slug: "telegram-mt5-copy-bot", category: "trading", title: "Telegram to MT5 Copy Trading Bot", description: "Parse structured trading signals and manage MT5 execution, updates and partial closes.", href: "/mt5-telegram-copy-trading-bot", meta: "Telegram · MT5 · Python", keywords: "telegram mt5 copy trading signal parser", featured: true },
    { slug: "pine-script-mt5-automation", category: "trading", title: "TradingView to MT5 Automation", description: "Connect Pine Script alerts to a reliable execution workflow with duplicate protection.", href: "/pine-script-to-mt5-automation", meta: "TradingView · Webhooks · MT5", keywords: "pine script tradingview webhook mt5 automation", featured: false },
    { slug: "ai-workflow-automation", category: "ai-automation", title: "AI Workflow Automation", description: "Automate document, routing, approval and operational workflows with AI and APIs.", href: "/ai-automation", meta: "AI agents · RAG · APIs", keywords: "ai automation workflow agent rag integration chatbot", featured: true },
    { slug: "llm-agent-development", category: "ai-automation", title: "LLM & AI Agent Development", description: "Build tool-using agents, retrieval workflows and private AI integrations around your data.", href: "/llm-agent-development", meta: "LLM · RAG · Tool calling", keywords: "llm ai agent rag tools private ai", featured: true },
    { slug: "web-app-saas", category: "websites", title: "Web App & SaaS Development", description: "Build responsive portals, dashboards and software products around a defined workflow.", href: "/web-app-development", meta: "Web apps · SaaS · Dashboards", keywords: "website web app saas portal dashboard business website", featured: true },
    { slug: "api-cloud-backend", category: "software-apis", secondaryCategories: ["cloud-support"], title: "API & Cloud Backend Development", description: "Create APIs, webhooks, database-backed services and deployable cloud/VPS backends.", href: "/api-cloud-development", meta: "APIs · FastAPI · Cloud / VPS", keywords: "api python fastapi webhook cloud vps backend integration", featured: true }
  ];
  window.NEXTGEN_SERVICE_CATALOG = { categories, services };
})();