(function () {
  const categories = [
  {
    "slug": "ai-automation",
    "label": "AI & Automation",
    "short": "AI agents, chatbots, LLM integrations and workflow automation.",
    "url": "/services/ai-automation"
  },
  {
    "slug": "websites",
    "label": "Websites & Web Apps",
    "short": "Business websites, portals, dashboards and web applications.",
    "url": "/services/websites"
  },
  {
    "slug": "software-apis",
    "label": "Software, Apps & APIs",
    "short": "Python tools, custom applications, integrations and API backends.",
    "url": "/services/software-apis"
  },
  {
    "slug": "trading",
    "label": "Trading Bots & Indicators",
    "short": "MT4/MT5 EAs, TradingView automation and signal integrations.",
    "url": "/services/trading-bots"
  },
  {
    "slug": "cloud-support",
    "label": "Cloud & Technical Support",
    "short": "VPS, cloud deployment, backend services and technical maintenance.",
    "url": "/services/cloud-support"
  }
];

  const services = [
  {
    "slug": "custom-mt5-expert-advisor",
    "category": "trading",
    "thumb": "EA",
    "title": "Custom MT5 Expert Advisor",
    "description": "Turn defined strategy, execution and risk rules into a configurable MT5 Expert Advisor.",
    "href": "/trading-bot-development",
    "meta": "MT4 / MT5 · MQL4 / MQL5",
    "keywords": "mt5 ea expert advisor mql5 trading bot automation",
    "featured": true,
    "audience": "Defined trading rules that need reliable MT5 execution.",
    "deliverables": [
      "Configurable EA source",
      "Entry, exit and risk logic",
      "Setup and validation notes"
    ],
    "requirements": "Strategy rules, symbol/timeframe, risk limits and trade-management behavior."
  },
  {
    "slug": "xauusd-trading-bot",
    "category": "trading",
    "thumb": "XAU",
    "title": "XAUUSD Trading Bot Development",
    "description": "Build gold-focused automation with explicit entry, risk, execution and validation rules.",
    "href": "/xauusd-trading-bot-development",
    "meta": "XAUUSD · MT5 · Risk controls",
    "keywords": "gold xauusd trading bot mt5 ea",
    "featured": true,
    "audience": "Gold strategies that need broker-aware execution and risk controls.",
    "deliverables": [
      "MT5 automation logic",
      "Execution and risk controls",
      "Validation setup guidance"
    ],
    "requirements": "Exact entry/exit rules, risk model, sessions and broker assumptions."
  },
  {
    "slug": "telegram-mt5-copy-bot",
    "category": "trading",
    "thumb": "TG",
    "title": "Telegram to MT5 Copy Trading Bot",
    "description": "Parse structured trading signals and manage MT5 execution, updates and partial closes.",
    "href": "/mt5-telegram-copy-trading-bot",
    "meta": "Telegram · MT5 · Python",
    "keywords": "telegram mt5 copy trading signal parser",
    "featured": true,
    "audience": "Signal channels that need structured, auditable MT5 execution.",
    "deliverables": [
      "Signal parser",
      "MT5 execution bridge",
      "Trade-management commands"
    ],
    "requirements": "Real signal formats, supported commands, risk rules and target MT5 environment."
  },
  {
    "slug": "pine-script-mt5-automation",
    "category": "trading",
    "thumb": "TV",
    "title": "TradingView to MT5 Automation",
    "description": "Connect Pine Script alerts to a reliable execution workflow with duplicate protection.",
    "href": "/pine-script-to-mt5-automation",
    "meta": "TradingView · Webhooks · MT5",
    "keywords": "pine script tradingview webhook mt5 automation",
    "featured": false,
    "audience": "TradingView strategies that need automated MT5 execution.",
    "deliverables": [
      "Alert payload design",
      "Webhook bridge",
      "MT5 receiver and trade mapping"
    ],
    "requirements": "Pine alert conditions, payload fields and MT5 execution rules."
  },
  {
    "slug": "ai-workflow-automation",
    "category": "ai-automation",
    "thumb": "AI",
    "title": "AI Workflow Automation",
    "description": "Automate document, routing, approval and operational workflows with AI and APIs.",
    "href": "/ai-automation",
    "meta": "AI agents · RAG · APIs",
    "keywords": "ai automation workflow agent rag integration chatbot",
    "featured": true,
    "audience": "Repeatable business workflows with clear inputs, actions and review points.",
    "deliverables": [
      "Workflow design",
      "AI/API integrations",
      "Error handling and handover"
    ],
    "requirements": "Current workflow, connected tools, inputs, outputs and approval rules."
  },
  {
    "slug": "llm-agent-development",
    "category": "ai-automation",
    "thumb": "LLM",
    "title": "LLM & AI Agent Development",
    "description": "Build tool-using agents, retrieval workflows and private AI integrations around your data.",
    "href": "/llm-agent-development",
    "meta": "LLM · RAG · Tool calling",
    "keywords": "llm ai agent rag tools private ai",
    "featured": true,
    "audience": "Knowledge or tool-based tasks that need bounded AI actions.",
    "deliverables": [
      "Agent or RAG workflow",
      "Approved tool integrations",
      "Evaluation and deployment notes"
    ],
    "requirements": "Target tasks, data sources, tools, permissions and quality criteria."
  },
  {
    "slug": "web-app-saas",
    "category": "websites",
    "thumb": "WEB",
    "title": "Web App & SaaS Development",
    "description": "Build responsive portals, dashboards and software products around a defined workflow.",
    "href": "/web-app-development",
    "meta": "Web apps · SaaS · Dashboards",
    "keywords": "website web app saas portal dashboard business website",
    "featured": true,
    "audience": "Businesses that need a portal, dashboard or custom web product.",
    "deliverables": [
      "Responsive application",
      "Backend/API workflows",
      "Deployment and handover"
    ],
    "requirements": "User roles, core screens, data model, integrations and acceptance criteria."
  },
  {
    "slug": "api-cloud-backend",
    "category": "software-apis",
    "secondaryCategories": [
      "cloud-support"
    ],
    "thumb": "API",
    "title": "API & Cloud Backend Development",
    "description": "Create APIs, webhooks, database-backed services and deployable cloud/VPS backends.",
    "href": "/api-cloud-development",
    "meta": "APIs · FastAPI · Cloud / VPS",
    "keywords": "api python fastapi webhook cloud vps backend integration",
    "featured": true,
    "audience": "Products or automations that need reliable backend services and integrations.",
    "deliverables": [
      "API endpoints and webhooks",
      "Data/integration logic",
      "Deployment and operational notes"
    ],
    "requirements": "Systems to connect, data contracts, authentication needs and deployment target."
  }
];

  const catalogCategories = [
  {
    "slug": "ai-llm",
    "label": "AI & LLM Systems",
    "short": "Agents, RAG, private knowledge assistants and document AI."
  },
  {
    "slug": "business-automation",
    "label": "Business Automation",
    "short": "Python, browser, reporting, CRM and repetitive workflow automation."
  },
  {
    "slug": "web-saas",
    "label": "Websites & SaaS",
    "short": "Web apps, portals, dashboards, business sites and subscription products."
  },
  {
    "slug": "software-backend",
    "label": "Software & Backend",
    "short": "Custom Python software, internal tools, databases and backend systems."
  },
  {
    "slug": "api-integrations",
    "label": "APIs & Integrations",
    "short": "REST APIs, FastAPI, webhooks and third-party system integrations."
  },
  {
    "slug": "data-scraping",
    "label": "Data & Scraping",
    "short": "Scraping, ETL, cleaning, spreadsheet automation and data migration."
  },
  {
    "slug": "cloud-devops",
    "label": "Cloud & DevOps",
    "short": "VPS setup, deployment, Docker, DNS, SSL, monitoring and CI/CD."
  },
  {
    "slug": "trading-systems",
    "label": "Trading Systems",
    "short": "MT4/MT5, XAUUSD, TradingView, IBKR and NinjaTrader automation."
  },
  {
    "slug": "bots-messaging",
    "label": "Bots & Messaging",
    "short": "Telegram, Discord, notification and customer-support bots."
  },
  {
    "slug": "ai-model-engineering",
    "label": "AI Model Engineering",
    "short": "Open models, adapters, evaluation, MoE routing and inference optimization."
  },
  {
    "slug": "seo-analytics",
    "label": "SEO & Analytics",
    "short": "Technical SEO, Search Console, structured data and conversion tracking."
  },
  {
    "slug": "research-consulting",
    "label": "Research & Technical Consulting",
    "short": "Architecture, workflow analysis, feasibility and technical documentation."
  }
];

  const catalogServices = [
  {
    "slug": "llm-agent-development",
    "category": "ai-llm",
    "thumb": "LLM",
    "title": "LLM & AI Agent Development",
    "description": "Build tool-using AI agents with controlled actions, retrieval and integrations around real workflows.",
    "meta": "Agents · RAG · Tool calling",
    "keywords": "llm ai agent tool calling autonomous workflow rag private ai",
    "published": true,
    "href": "/llm-agent-development"
  },
  {
    "slug": "rag-private-knowledge-assistant",
    "category": "ai-llm",
    "thumb": "RAG",
    "title": "RAG & Private Knowledge Assistant",
    "description": "Create grounded assistants that search approved documents, databases or internal knowledge before answering.",
    "meta": "RAG · Knowledge bases · Private data",
    "keywords": "rag retrieval augmented generation knowledge base private documents vector search",
    "published": false
  },
  {
    "slug": "ai-customer-support-assistant",
    "category": "ai-llm",
    "thumb": "SUP",
    "title": "AI Customer Support Assistant",
    "description": "Build an AI support workflow that answers from approved information and escalates when human review is needed.",
    "meta": "Support AI · Escalation · Knowledge",
    "keywords": "ai customer support chatbot helpdesk faq escalation",
    "published": false
  },
  {
    "slug": "tool-calling-ai-agent",
    "category": "ai-llm",
    "thumb": "AGT",
    "title": "Tool-Calling AI Agent",
    "description": "Connect an AI agent to approved APIs, files, databases or business tools with permission-aware actions.",
    "meta": "Agents · APIs · Tools",
    "keywords": "tool calling ai agent api tools functions workflow",
    "published": false
  },
  {
    "slug": "multi-agent-workflows",
    "category": "ai-llm",
    "thumb": "MULTI",
    "title": "Multi-Agent Workflow System",
    "description": "Coordinate specialized agents for research, extraction, drafting, checking and handoff inside a bounded workflow.",
    "meta": "Multi-agent · Orchestration",
    "keywords": "multi agent orchestration ai workflow planner reviewer",
    "published": false
  },
  {
    "slug": "document-ai-extraction",
    "category": "ai-llm",
    "thumb": "DOC",
    "title": "Document AI & Structured Extraction",
    "description": "Turn PDFs, forms and business documents into structured fields, summaries or downstream actions.",
    "meta": "Documents · Extraction · AI",
    "keywords": "document ai pdf extraction forms structured data parsing",
    "published": false
  },
  {
    "slug": "ai-workflow-automation",
    "category": "business-automation",
    "thumb": "AI",
    "title": "AI Workflow Automation",
    "description": "Automate document, routing, approval and operational workflows with AI and APIs.",
    "meta": "AI · Workflows · APIs",
    "keywords": "ai automation workflow approvals routing operations",
    "published": true,
    "href": "/ai-automation",
    "secondaryCategories": [
      "ai-llm"
    ]
  },
  {
    "slug": "python-task-automation",
    "category": "business-automation",
    "thumb": "PY",
    "title": "Python Task Automation",
    "description": "Automate repetitive desktop, file, API or operational tasks with maintainable Python workflows.",
    "meta": "Python · Scripts · Automation",
    "keywords": "python automation scripts repetitive tasks files api",
    "published": false
  },
  {
    "slug": "browser-automation",
    "category": "business-automation",
    "thumb": "WEB",
    "title": "Browser Automation",
    "description": "Automate structured browser tasks, form workflows and repetitive web operations with validation and logging.",
    "meta": "Browser · Forms · Workflows",
    "keywords": "browser automation playwright selenium forms web tasks",
    "published": false
  },
  {
    "slug": "email-report-automation",
    "category": "business-automation",
    "thumb": "MAIL",
    "title": "Email & Report Automation",
    "description": "Generate, route or summarize recurring reports and notifications from structured business data.",
    "meta": "Email · Reports · Scheduling",
    "keywords": "email automation reports scheduled summaries notifications",
    "published": false
  },
  {
    "slug": "crm-lead-automation",
    "category": "business-automation",
    "thumb": "CRM",
    "title": "CRM & Lead Workflow Automation",
    "description": "Connect lead capture, qualification, routing and follow-up steps across forms, APIs and CRM-style systems.",
    "meta": "CRM · Leads · Routing",
    "keywords": "crm lead automation qualification routing follow up webhook",
    "published": false
  },
  {
    "slug": "web-app-saas",
    "category": "web-saas",
    "thumb": "WEB",
    "title": "Web App & SaaS Development",
    "description": "Build responsive portals, dashboards and software products around a defined workflow.",
    "meta": "Web apps · SaaS · Dashboards",
    "keywords": "web app saas portal dashboard",
    "published": true,
    "href": "/web-app-development"
  },
  {
    "slug": "business-website-development",
    "category": "web-saas",
    "thumb": "SITE",
    "title": "Business Website Development",
    "description": "Create a responsive business website with clear services, forms, technical SEO foundations and deployment.",
    "meta": "Website · Responsive · SEO-ready",
    "keywords": "business website responsive company site landing pages",
    "published": false
  },
  {
    "slug": "client-portal-development",
    "category": "web-saas",
    "thumb": "PORTAL",
    "title": "Client Portal Development",
    "description": "Build secure client areas for requests, files, project status, communication and account workflows.",
    "meta": "Portal · Accounts · Files",
    "keywords": "client portal customer portal files projects dashboard",
    "published": false
  },
  {
    "slug": "admin-dashboard-development",
    "category": "web-saas",
    "thumb": "ADM",
    "title": "Admin Dashboard Development",
    "description": "Build operational dashboards for managing users, leads, content, workflows and system status.",
    "meta": "Admin · Dashboard · Operations",
    "keywords": "admin panel dashboard operations management users",
    "published": false
  },
  {
    "slug": "subscription-membership-platform",
    "category": "web-saas",
    "thumb": "SUB",
    "title": "Subscription & Membership Platform",
    "description": "Build gated software or membership flows with accounts, plans, permissions and recurring-service logic.",
    "meta": "Subscriptions · Membership · Auth",
    "keywords": "subscription saas membership authentication plans",
    "published": false
  },
  {
    "slug": "custom-python-software",
    "category": "software-backend",
    "thumb": "PY",
    "title": "Custom Python Software",
    "description": "Build purpose-specific Python applications, services and utilities around a defined business process.",
    "meta": "Python · Custom software",
    "keywords": "python software custom application backend utility",
    "published": false
  },
  {
    "slug": "internal-business-tools",
    "category": "software-backend",
    "thumb": "OPS",
    "title": "Internal Business Tools",
    "description": "Create focused internal tools for operations, data entry, approvals, calculations and team workflows.",
    "meta": "Internal tools · Operations",
    "keywords": "internal business tool admin operations workflow",
    "published": false
  },
  {
    "slug": "database-backed-systems",
    "category": "software-backend",
    "thumb": "DB",
    "title": "Database-Backed Business Systems",
    "description": "Design applications around structured data, roles, audit trails and reliable create/read/update workflows.",
    "meta": "Databases · CRUD · Roles",
    "keywords": "database system sql sqlite postgres mysql crud",
    "published": false
  },
  {
    "slug": "licensing-subscription-backend",
    "category": "software-backend",
    "thumb": "LIC",
    "title": "Licensing & Subscription Backend",
    "description": "Implement license keys, account entitlements, access rules and subscription-state handling for software products.",
    "meta": "Licensing · Entitlements · Access",
    "keywords": "software licensing subscription backend entitlement license key",
    "published": false
  },
  {
    "slug": "software-modernization",
    "category": "software-backend",
    "thumb": "MOD",
    "title": "Software Modernization & Refactoring",
    "description": "Refactor or extend an existing codebase, replace brittle workflows and prepare systems for maintainable deployment.",
    "meta": "Refactor · Migration · Maintenance",
    "keywords": "software modernization refactor legacy code migration",
    "published": false
  },
  {
    "slug": "api-cloud-backend",
    "category": "api-integrations",
    "thumb": "API",
    "title": "API & Cloud Backend Development",
    "description": "Create APIs, webhooks, database-backed services and deployable cloud/VPS backends.",
    "meta": "FastAPI · APIs · Cloud",
    "keywords": "api fastapi backend cloud vps webhook",
    "published": true,
    "href": "/api-cloud-development",
    "secondaryCategories": [
      "cloud-devops",
      "software-backend"
    ]
  },
  {
    "slug": "rest-fastapi-development",
    "category": "api-integrations",
    "thumb": "REST",
    "title": "REST API & FastAPI Development",
    "description": "Design authenticated REST endpoints with validation, database logic, documentation and deployment readiness.",
    "meta": "REST · FastAPI · Auth",
    "keywords": "rest api fastapi authentication backend endpoints",
    "published": false
  },
  {
    "slug": "third-party-api-integration",
    "category": "api-integrations",
    "thumb": "LINK",
    "title": "Third-Party API Integration",
    "description": "Connect external services to your application with authentication, error handling, retries and data mapping.",
    "meta": "APIs · OAuth · Integrations",
    "keywords": "third party api integration oauth external service",
    "published": false
  },
  {
    "slug": "webhook-middleware-integration",
    "category": "api-integrations",
    "thumb": "HOOK",
    "title": "Webhooks & Integration Middleware",
    "description": "Receive, validate, transform and route webhook events between systems with durable logging and retries.",
    "meta": "Webhooks · Middleware · Events",
    "keywords": "webhook middleware event integration retry queue",
    "published": false
  },
  {
    "slug": "web-scraping-data-extraction",
    "category": "data-scraping",
    "thumb": "SCR",
    "title": "Web Scraping & Data Extraction",
    "description": "Collect structured public or authorized web data with repeatable extraction, validation and export workflows.",
    "meta": "Scraping · Extraction · Export",
    "keywords": "web scraping data extraction crawler public data",
    "published": false
  },
  {
    "slug": "etl-data-pipelines",
    "category": "data-scraping",
    "thumb": "ETL",
    "title": "ETL & Data Pipeline Development",
    "description": "Move data between files, APIs and databases with validation, transformation and scheduled processing.",
    "meta": "ETL · Pipelines · Databases",
    "keywords": "etl data pipeline transform load extract schedule",
    "published": false
  },
  {
    "slug": "data-cleaning-transformation",
    "category": "data-scraping",
    "thumb": "CLEAN",
    "title": "Data Cleaning & Transformation",
    "description": "Normalize, deduplicate, validate and reshape operational datasets for reliable downstream use.",
    "meta": "Cleaning · Validation · Dedupe",
    "keywords": "data cleaning transformation deduplication validation",
    "published": false
  },
  {
    "slug": "excel-csv-automation",
    "category": "data-scraping",
    "thumb": "XLS",
    "title": "Excel & CSV Automation",
    "description": "Automate spreadsheet imports, exports, calculations, reconciliation and recurring data-processing tasks.",
    "meta": "Excel · CSV · Automation",
    "keywords": "excel csv automation spreadsheet processing reports",
    "published": false
  },
  {
    "slug": "database-migration",
    "category": "data-scraping",
    "thumb": "MIG",
    "title": "Database & Data Migration",
    "description": "Plan and execute controlled data moves between files, databases or application versions with validation checks.",
    "meta": "Migration · Mapping · Validation",
    "keywords": "database migration data migration mapping sql",
    "published": false
  },
  {
    "slug": "vps-server-setup",
    "category": "cloud-devops",
    "thumb": "VPS",
    "title": "VPS & Server Setup",
    "description": "Configure Linux VPS environments, application services, permissions, process management and deployment basics.",
    "meta": "Linux · VPS · Services",
    "keywords": "vps linux server setup ubuntu process service",
    "published": false
  },
  {
    "slug": "cloud-app-deployment",
    "category": "cloud-devops",
    "thumb": "CLOUD",
    "title": "Cloud Application Deployment",
    "description": "Deploy web apps, APIs and automation services to practical cloud or VPS environments with repeatable setup.",
    "meta": "Cloud · VPS · Deployment",
    "keywords": "cloud deployment oracle aws gcp vps app",
    "published": false
  },
  {
    "slug": "docker-deployment",
    "category": "cloud-devops",
    "thumb": "DOC",
    "title": "Dockerized Deployment",
    "description": "Package applications and dependencies into reproducible containers for cleaner deployment and handover.",
    "meta": "Docker · Containers · Deploy",
    "keywords": "docker container deployment compose",
    "published": false
  },
  {
    "slug": "domain-dns-ssl",
    "category": "cloud-devops",
    "thumb": "DNS",
    "title": "Domain, DNS & SSL Configuration",
    "description": "Connect domains, subdomains, HTTPS certificates, reverse proxies and related production routing safely.",
    "meta": "DNS · SSL · Domains",
    "keywords": "domain dns ssl https reverse proxy cloudflare",
    "published": false
  },
  {
    "slug": "monitoring-backups-ci-cd",
    "category": "cloud-devops",
    "thumb": "OPS",
    "title": "Monitoring, Backups & CI/CD",
    "description": "Set up deployment pipelines, health checks, logs, basic alerts and backup workflows for production services.",
    "meta": "CI/CD · Logs · Backups",
    "keywords": "cicd github vercel monitoring logging backups health checks",
    "published": false
  },
  {
    "slug": "custom-mt5-expert-advisor",
    "category": "trading-systems",
    "thumb": "EA",
    "title": "Custom MT5 Expert Advisor",
    "description": "Turn defined strategy, execution and risk rules into a configurable MT5 Expert Advisor.",
    "meta": "MT5 · MQL5 · Automation",
    "keywords": "mt5 expert advisor ea mql5 trading bot",
    "published": true,
    "href": "/trading-bot-development"
  },
  {
    "slug": "xauusd-trading-bot",
    "category": "trading-systems",
    "thumb": "XAU",
    "title": "XAUUSD Trading Bot Development",
    "description": "Build gold-focused automation with explicit entry, risk, execution and validation rules.",
    "meta": "XAUUSD · MT5 · Risk",
    "keywords": "xauusd gold trading bot mt5",
    "published": true,
    "href": "/xauusd-trading-bot-development"
  },
  {
    "slug": "telegram-mt5-copy-bot",
    "category": "trading-systems",
    "thumb": "TG",
    "title": "Telegram to MT5 Copy Trading Bot",
    "description": "Parse structured trading signals and manage MT5 execution, edits, break-even and partial closes.",
    "meta": "Telegram · MT5 · Python",
    "keywords": "telegram mt5 copy trading signals",
    "published": true,
    "href": "/mt5-telegram-copy-trading-bot",
    "secondaryCategories": [
      "bots-messaging"
    ]
  },
  {
    "slug": "pine-script-mt5-automation",
    "category": "trading-systems",
    "thumb": "TV",
    "title": "TradingView to MT5 Automation",
    "description": "Connect Pine Script alerts to an execution workflow with authentication, mapping and duplicate protection.",
    "meta": "TradingView · Webhooks · MT5",
    "keywords": "pine script tradingview webhook mt5",
    "published": true,
    "href": "/pine-script-to-mt5-automation"
  },
  {
    "slug": "mt4-ea-development",
    "category": "trading-systems",
    "thumb": "MT4",
    "title": "MT4 Expert Advisor Development",
    "description": "Build or update MT4 Expert Advisors from explicit entry, exit, risk and trade-management rules.",
    "meta": "MT4 · MQL4 · EA",
    "keywords": "mt4 mql4 expert advisor trading bot",
    "published": false
  },
  {
    "slug": "custom-mt4-mt5-indicators",
    "category": "trading-systems",
    "thumb": "IND",
    "title": "MT4/MT5 Custom Indicators",
    "description": "Implement custom indicator logic, alerts and configurable visual outputs for MetaTrader workflows.",
    "meta": "Indicators · MQL4 · MQL5",
    "keywords": "mt4 mt5 indicator mql4 mql5 alerts",
    "published": false
  },
  {
    "slug": "ibkr-trading-automation",
    "category": "trading-systems",
    "thumb": "IBKR",
    "title": "Interactive Brokers Automation",
    "description": "Build API-driven order, monitoring or strategy workflows around supported Interactive Brokers interfaces.",
    "meta": "IBKR · API · Trading",
    "keywords": "interactive brokers ibkr api trading automation",
    "published": false
  },
  {
    "slug": "ninjatrader-automation",
    "category": "trading-systems",
    "thumb": "NT",
    "title": "NinjaTrader Automation",
    "description": "Develop or integrate rule-based trading workflows, indicators or strategy components for NinjaTrader environments.",
    "meta": "NinjaTrader · Strategy · Automation",
    "keywords": "ninjatrader strategy indicator automation",
    "published": false
  },
  {
    "slug": "telegram-bot-development",
    "category": "bots-messaging",
    "thumb": "TG",
    "title": "Telegram Bot Development",
    "description": "Build Telegram bots for commands, files, notifications, business workflows and API-connected actions.",
    "meta": "Telegram · Bots · APIs",
    "keywords": "telegram bot api commands automation",
    "published": false
  },
  {
    "slug": "discord-bot-development",
    "category": "bots-messaging",
    "thumb": "DIS",
    "title": "Discord Bot Development",
    "description": "Create Discord bots for commands, notifications, workflow actions and community or operations tooling.",
    "meta": "Discord · Bots · Commands",
    "keywords": "discord bot automation commands notifications",
    "published": false
  },
  {
    "slug": "notification-alert-bots",
    "category": "bots-messaging",
    "thumb": "ALRT",
    "title": "Notification & Alert Bots",
    "description": "Send event-driven alerts from APIs, monitoring systems, databases or scheduled checks into messaging channels.",
    "meta": "Alerts · Monitoring · Messaging",
    "keywords": "notification bot alert monitoring telegram discord",
    "published": false
  },
  {
    "slug": "customer-support-messaging-bots",
    "category": "bots-messaging",
    "thumb": "CHAT",
    "title": "Customer Support Messaging Bots",
    "description": "Build structured support and routing bots that gather context, answer bounded questions and escalate when needed.",
    "meta": "Support · Routing · Chat",
    "keywords": "customer support bot messaging routing faq",
    "published": false
  },
  {
    "slug": "open-source-model-deployment",
    "category": "ai-model-engineering",
    "thumb": "MODEL",
    "title": "Open-Source AI Model Deployment",
    "description": "Package and deploy suitable open or open-weight models behind controlled inference endpoints or local workflows.",
    "meta": "Open models · Inference",
    "keywords": "open source llm model deployment inference qwen llama",
    "published": false
  },
  {
    "slug": "lora-adapter-finetuning",
    "category": "ai-model-engineering",
    "thumb": "LORA",
    "title": "LoRA & Adapter Fine-Tuning",
    "description": "Prepare adapter-style fine-tuning workflows for defined datasets, tasks and evaluation criteria.",
    "meta": "LoRA · Adapters · Fine-tuning",
    "keywords": "lora adapter finetuning peft qlora",
    "published": false
  },
  {
    "slug": "model-evaluation-benchmarking",
    "category": "ai-model-engineering",
    "thumb": "EVAL",
    "title": "AI Model Evaluation & Benchmarking",
    "description": "Build repeatable evaluations for quality, task accuracy, regressions and model or prompt comparisons.",
    "meta": "Evals · Benchmarks · QA",
    "keywords": "model evaluation benchmark llm eval regression",
    "published": false
  },
  {
    "slug": "moe-router-expert-systems",
    "category": "ai-model-engineering",
    "thumb": "MOE",
    "title": "MoE, Router & Expert-System Prototyping",
    "description": "Prototype routed expert architectures, capability routing and evaluation around open-model components.",
    "meta": "MoE · Routing · Experts",
    "keywords": "mixture of experts moe router expert architecture",
    "published": false
  },
  {
    "slug": "inference-optimization-quantization",
    "category": "ai-model-engineering",
    "thumb": "OPT",
    "title": "Inference Optimization & Quantization",
    "description": "Reduce runtime memory or latency using practical quantization, batching and serving adjustments where appropriate.",
    "meta": "Quantization · Serving · Runtime",
    "keywords": "inference optimization quantization 4bit batching serving",
    "published": false
  },
  {
    "slug": "technical-seo-search-console",
    "category": "seo-analytics",
    "thumb": "SEO",
    "title": "Technical SEO & Search Console Setup",
    "description": "Implement crawlability, canonicals, sitemap, Search Console verification and technical indexing checks.",
    "meta": "SEO · GSC · Indexing",
    "keywords": "technical seo google search console indexing canonical",
    "published": false
  },
  {
    "slug": "schema-sitemap-robots",
    "category": "seo-analytics",
    "thumb": "JSON",
    "title": "Schema, Sitemap & Robots Optimization",
    "description": "Add or repair structured data, sitemap coverage, robots directives and related machine-readable SEO signals.",
    "meta": "Schema · Sitemap · Robots",
    "keywords": "schema jsonld sitemap robots structured data",
    "published": false
  },
  {
    "slug": "analytics-conversion-tracking",
    "category": "seo-analytics",
    "thumb": "ANL",
    "title": "Analytics & Conversion Tracking",
    "description": "Instrument privacy-conscious page and conversion events so traffic and lead behavior can be measured.",
    "meta": "Analytics · Events · Conversions",
    "keywords": "analytics conversion tracking events pageview leads",
    "published": false
  },
  {
    "slug": "automated-seo-reporting",
    "category": "seo-analytics",
    "thumb": "RPT",
    "title": "Automated SEO Reporting",
    "description": "Create recurring Search Console and site-health reporting workflows for clicks, impressions, indexing and technical issues.",
    "meta": "GSC · Reports · Monitoring",
    "keywords": "seo reporting search console automated report indexing",
    "published": false
  },
  {
    "slug": "technical-architecture-design",
    "category": "research-consulting",
    "thumb": "ARCH",
    "title": "Technical Architecture & Solution Design",
    "description": "Turn a product or automation goal into components, data flows, interfaces, risks and an implementation plan.",
    "meta": "Architecture · Systems · Planning",
    "keywords": "technical architecture system design solution design",
    "published": false
  },
  {
    "slug": "workflow-reverse-engineering",
    "category": "research-consulting",
    "thumb": "REV",
    "title": "Workflow Reverse Engineering",
    "description": "Study an existing manual or software workflow and turn observable behavior into explicit implementation requirements.",
    "meta": "Analysis · Workflow · Requirements",
    "keywords": "workflow reverse engineering requirements process analysis",
    "published": false
  },
  {
    "slug": "feasibility-solution-design",
    "category": "research-consulting",
    "thumb": "PLAN",
    "title": "Feasibility Study & Build Plan",
    "description": "Evaluate practical implementation options, dependencies, constraints and staged delivery before development starts.",
    "meta": "Feasibility · Scope · Roadmap",
    "keywords": "feasibility technical research build plan roadmap",
    "published": false
  },
  {
    "slug": "technical-audit-documentation",
    "category": "research-consulting",
    "thumb": "AUD",
    "title": "Technical Audit & Documentation",
    "description": "Review an existing system or codebase and produce concrete findings, risks, architecture notes and next actions.",
    "meta": "Audit · Documentation · Handover",
    "keywords": "technical audit codebase review documentation architecture",
    "published": false
  }
];

  window.NEXTGEN_SERVICE_CATALOG = { categories, services, catalogCategories, catalogServices };
})();
