export const TEMPLATES = {
  "ai": {
    "id": "ai",
    "name": "AI Agents & Chatbots",
    "icon": "✦",
    "features": [
      "Grounded answers with citations",
      "Human escalation",
      "Approved tool calls",
      "Role-based access",
      "Knowledge-base retrieval",
      "Evaluation tests",
      "Usage and cost monitoring",
      "Audit trail",
      "Language support",
      "CRM integration"
    ],
    "integrations": [
      "OpenAI or Qwen",
      "CRM",
      "Slack",
      "Google Drive",
      "WhatsApp Business API",
      "Internal database"
    ],
    "risks": [
      "Hallucinations",
      "Sensitive data exposure",
      "Unapproved side effects",
      "LLM cost and uptime"
    ],
    "acceptance": [
      "Answers cite approved knowledge",
      "Private documents cannot be accessed by unauthorized users",
      "Sensitive actions require an explicit approval",
      "Evaluation suite and failure cases are delivered"
    ],
    "questions": [
      "Which data sources are approved?",
      "Which actions need human approval?",
      "How will inaccurate answers be handled?"
    ]
  },
  "mt5": {
    "id": "mt5",
    "name": "MT4/MT5 Trading Bots",
    "icon": "⌁",
    "features": [
      "Written entry and exit rules",
      "Broker and symbol checks",
      "Lot and exposure limits",
      "Retcode handling",
      "Backtest with documented settings",
      "Demo account tests",
      "Drawdown kill switch",
      "Multi-symbol logic",
      "TradingView webhook",
      "Editable MQ5 handover"
    ],
    "integrations": [
      "MT5",
      "MT4",
      "TradingView",
      "Telegram",
      "Broker server",
      "VPS"
    ],
    "risks": [
      "Historical overfitting",
      "Broker execution difference",
      "Margin and gap risk",
      "Missing editable indicators"
    ],
    "acceptance": [
      "Agreed entry/exit test cases reproduce",
      "Broker volume and stop rules are checked",
      "Daily-loss protection demonstrated on demo",
      "MQ5 source, settings and logs delivered"
    ],
    "questions": [
      "Which broker, symbols and timeframes?",
      "Are exact trading rules and MQ source available?",
      "What is the maximum acceptable exposure?"
    ]
  },
  "web": {
    "id": "web",
    "name": "Websites & SaaS",
    "icon": "▣",
    "features": [
      "Responsive accessible UI",
      "Authentication",
      "Admin dashboard",
      "Payment integration",
      "Search and filtering",
      "User notifications",
      "SEO and metadata",
      "File uploads",
      "Analytics and reporting",
      "Deployment handover"
    ],
    "integrations": [
      "Stripe",
      "CRM",
      "Email provider",
      "Analytics",
      "Existing backend",
      "Cloud storage"
    ],
    "risks": [
      "Unclear roles",
      "Payment edge cases",
      "Data privacy",
      "Mobile performance"
    ],
    "acceptance": [
      "Core user journeys tested on desktop and mobile",
      "Unauthorized requests are rejected",
      "Forms handle errors safely",
      "Source and deployment instructions delivered"
    ],
    "questions": [
      "Which user roles and key screens?",
      "Is an existing brand/design available?",
      "Who owns hosting and payment accounts?"
    ]
  },
  "api": {
    "id": "api",
    "name": "API & Integrations",
    "icon": "⧉",
    "features": [
      "OpenAPI contract",
      "HMAC webhook security",
      "Idempotent requests",
      "Retries and backoff",
      "OAuth or API-key auth",
      "Provider sandbox tests",
      "Data mapping",
      "Error and audit logs",
      "Rate limiting",
      "Monitoring"
    ],
    "integrations": [
      "Stripe",
      "Shopify",
      "Twilio",
      "CRM",
      "PostgreSQL",
      "Webhooks"
    ],
    "risks": [
      "Provider rate limits",
      "Schema drift",
      "Credentials exposure",
      "Duplicate side effects"
    ],
    "acceptance": [
      "Invalid signatures and credentials rejected",
      "Duplicate events do not duplicate actions",
      "Provider sandbox acceptance tests passed",
      "API contract and failure logging delivered"
    ],
    "questions": [
      "Which provider APIs and sandbox accounts?",
      "What happens on duplicate/replayed events?",
      "Who owns API credentials?"
    ]
  },
  "commerce": {
    "id": "commerce",
    "name": "Ecommerce Automation",
    "icon": "◈",
    "features": [
      "Signed order webhooks",
      "Stock alerts",
      "Fulfillment sync",
      "CRM integration",
      "Returns review",
      "Approval for refunds",
      "Duplicate event guards",
      "Catalog mapping",
      "Order dashboard",
      "Sandbox transactions"
    ],
    "integrations": [
      "Shopify",
      "WooCommerce",
      "Stripe",
      "Shipping platform",
      "ERP",
      "CRM"
    ],
    "risks": [
      "Inventory mismatch",
      "Unapproved refunds",
      "Customer privacy",
      "Retries or duplicate orders"
    ],
    "acceptance": [
      "Signed provider events verified",
      "Duplicate orders create no duplicate downstream action",
      "Refund requires authorized approval",
      "Inventory exception states reviewed"
    ],
    "questions": [
      "Which ecommerce platform and approximate volume?",
      "How will returns and refunds be approved?",
      "Where must stock remain authoritative?"
    ]
  },
  "workflow": {
    "id": "workflow",
    "name": "Business Workflow Automation",
    "icon": "◇",
    "features": [
      "Event triggers",
      "Conditional routing",
      "Human approval gates",
      "CRM lead intake",
      "Idempotency",
      "Retry and recovery",
      "Audit trail",
      "Role-aware dashboard",
      "Scheduled tasks",
      "Notifications"
    ],
    "integrations": [
      "n8n",
      "Make",
      "HubSpot",
      "Google Workspace",
      "Slack",
      "Internal APIs"
    ],
    "risks": [
      "External actions without approval",
      "Silent integration failures",
      "Duplicate jobs",
      "Missing audit logs"
    ],
    "acceptance": [
      "Conditional paths match agreed examples",
      "External side effects require approved roles",
      "Failed runs can be recovered and audited",
      "Duplicate trigger events are harmless"
    ],
    "questions": [
      "What triggers the workflow?",
      "What happens if a provider is down?",
      "Who approves sensitive operations?"
    ]
  },
  "voice": {
    "id": "voice",
    "name": "AI Voice Agents",
    "icon": "◉",
    "features": [
      "Signed telecom webhooks",
      "Speech recognition",
      "Appointment booking",
      "CRM lead capture",
      "Human transfer",
      "Call intent routing",
      "Consent and retention",
      "Multi-language scripts",
      "After-hours fallback",
      "Call quality review"
    ],
    "integrations": [
      "Twilio",
      "Google Calendar",
      "CRM",
      "Speech/LLM API",
      "SMS",
      "Booking software"
    ],
    "risks": [
      "Speech errors",
      "Booking conflicts",
      "Recording consent",
      "Telephony outages"
    ],
    "acceptance": [
      "Sample calls follow agreed paths",
      "Double booking prevented against real calendar",
      "Human transfer and fallback tested",
      "Recording and retention follow consent rules"
    ],
    "questions": [
      "What calls and languages are in scope?",
      "Which booking system and business hours?",
      "Are call recordings legally consented?"
    ]
  },
  "mobile": {
    "id": "mobile",
    "name": "Mobile Applications",
    "icon": "▤",
    "features": [
      "Android and iOS UI",
      "Authentication",
      "Push notifications",
      "Offline sync",
      "Payments",
      "GPS or camera permissions",
      "Backend API",
      "Device testing",
      "App-store submission",
      "Crash monitoring"
    ],
    "integrations": [
      "Firebase",
      "Apple App Store",
      "Google Play",
      "Payments",
      "Maps",
      "Existing API"
    ],
    "risks": [
      "Store review delay",
      "Device compatibility",
      "Offline sync conflicts",
      "Permissions and privacy"
    ],
    "acceptance": [
      "Core journeys pass on target devices",
      "App permission prompts match functions",
      "Offline/online state recovery verified",
      "Release artifacts and ownership delivered"
    ],
    "questions": [
      "Android, iOS or both?",
      "Does a backend already exist?",
      "Who owns store publishing accounts?"
    ]
  }
};
export const CATEGORIES = Object.values(TEMPLATES).map(({id,name,icon})=>({id,name,icon}));
