/**
 * NextGen Tech Solutions — Client Portal Interactive Architecture
 * Handles Project Scoping Estimator and Asynchronous SOW Intake Requests
 */

const ESTIMATOR_DATA = {
    quant: {
        standard: {
            title: "Focused Trading Build",
            desc: "One strategy, indicator, signal bridge, panel or targeted MT4/MT5 automation.",
            price: "$500 – $900 USD",
            timeline: "3 – 6 Business Days",
            coverage: "Functional QA + strategy-specific checks",
            deliverable: "Source code + setup notes + agreed documentation"
        },
        advanced: {
            title: "Production Trading System",
            desc: "Complete EA or execution workflow with risk controls, alerts, integrations and robust trade management.",
            price: "$900 – $2,000 USD",
            timeline: "5 – 10 Business Days",
            coverage: "Execution, risk-control and edge-case validation",
            deliverable: "Source code + test evidence + deployment guidance"
        },
        enterprise: {
            title: "Complex Trading Platform",
            desc: "Multi-strategy or multi-account architecture with deeper integrations, backtesting and operational controls.",
            price: "$2,000 – $6,000+ USD",
            timeline: "2 – 5 Weeks",
            coverage: "Expanded regression, integration and scenario testing",
            deliverable: "Full source + technical handover + agreed test package"
        }
    },    ai_agents: {
        standard: {
            title: "Focused AI Automation",
            desc: "Single workflow, document assistant, prompt pipeline or API-connected AI task.",
            price: "$800 – $1,500 USD",
            timeline: "4 – 8 Business Days",
            coverage: "Core workflow and failure-path validation",
            deliverable: "Source code + prompts/config + setup notes"
        },
        advanced: {
            title: "Production AI Agent",
            desc: "Tool-using agent, RAG workflow, business integration or voice-enabled automation.",
            price: "$2,000 – $5,000 USD",
            timeline: "2 – 4 Weeks",
            coverage: "Workflow, retrieval and integration testing",
            deliverable: "Source code + deployment guide + evaluation notes"
        },
        enterprise: {
            title: "Advanced AI Platform",
            desc: "Multi-agent, private-model, multi-system or high-volume AI architecture with deeper governance.",
            price: "$5,000 – $15,000+ USD",
            timeline: "4 – 8+ Weeks",
            coverage: "End-to-end evaluation, observability and regression plan",
            deliverable: "Platform source + architecture notes + operational handover"
        }
    },    web_mobile: {
        standard: {
            title: "Focused Web Build",
            desc: "Landing experience, dashboard module, client portal feature or compact MVP.",
            price: "$700 – $1,500 USD",
            timeline: "4 – 8 Business Days",
            coverage: "Responsive QA + core flow testing",
            deliverable: "Source code + deployment notes + basic documentation"
        },
        advanced: {
            title: "Production Web / SaaS App",
            desc: "Authentication, billing, dashboards, admin workflows and third-party integrations.",
            price: "$1,500 – $4,000 USD",
            timeline: "2 – 4 Weeks",
            coverage: "Core user-flow, integration and responsive testing",
            deliverable: "Full source + deployment guidance + handover notes"
        },
        enterprise: {
            title: "Complex Product Platform",
            desc: "Multi-role platform, larger integration surface, advanced workflows and production operations.",
            price: "$4,000 – $12,000+ USD",
            timeline: "4 – 8+ Weeks",
            coverage: "End-to-end, regression and integration validation",
            deliverable: "Platform source + technical documentation + deployment handover"
        }
    },
    cloud: {
        standard: {
            title: "API or Integration Service",
            desc: "Webhook, API endpoint, automation connector or lightweight backend service.",
            price: "$600 – $1,200 USD",
            timeline: "3 – 7 Business Days",
            coverage: "API, validation and failure-path testing",
            deliverable: "Source code + API notes + deployment instructions"
        },
        advanced: {
            title: "Production Backend System",
            desc: "Database-backed API, queues, integrations, background jobs and monitored deployment.",
            price: "$1,500 – $4,500 USD",
            timeline: "2 – 4 Weeks",
            coverage: "Integration, load-aware and recovery-path validation",
            deliverable: "Backend source + deployment guide + operational notes"
        },
        enterprise: {
            title: "Distributed Cloud Architecture",
            desc: "Multi-service, higher-scale or multi-environment platform with deeper reliability requirements.",
            price: "$5,000 – $15,000+ USD",
            timeline: "4 – 10+ Weeks",
            coverage: "System, integration, resilience and release validation",
            deliverable: "Architecture + source + deployment and operations handover"
        }
    }
};

const PRACTICE_LABELS = {
    quant: "Trading Automation",
    ai_agents: "AI & Automation",
    web_mobile: "Web & SaaS",
    cloud: "API & Cloud"
};
const TIER_LABELS = {
    standard: "Starter",
    advanced: "Professional",
    enterprise: "Advanced"
};


let currentPractice = "quant";
let currentTier = "advanced";

// Initialize Estimator Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    // Practice toggle buttons
    const practiceBtns = document.querySelectorAll("#practice-selector .toggle-btn");
    practiceBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            practiceBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentPractice = btn.getAttribute("data-practice");
            updateEstimatorDisplay();
        });
    });

    // Tier cards
    const tierCards = document.querySelectorAll(".tier-card");
    tierCards.forEach(card => {
        card.addEventListener("click", () => {
            tierCards.forEach(c => c.classList.remove("active"));
            card.classList.add("active");
            currentTier = card.getAttribute("data-tier");
            updateEstimatorDisplay();
        });
    });

    updateEstimatorDisplay();
});

function updateEstimatorDisplay() {
    const practiceData = ESTIMATOR_DATA[currentPractice];
    if (!practiceData) return;

    ["standard", "advanced", "enterprise"].forEach(tierKey => {
        const tierInfo = practiceData[tierKey];
        if (!tierInfo) return;
        const titleEl = document.getElementById(`tier-title-${tierKey}`);
        const descEl = document.getElementById(`tier-desc-${tierKey}`);
        if (titleEl) titleEl.innerText = tierInfo.title;
        if (descEl) descEl.innerText = tierInfo.desc;
    });

    const data = practiceData[currentTier];
    if (!data) return;

    const selectionEl = document.getElementById("est-selection");
    if (selectionEl) {
        selectionEl.innerText = `${PRACTICE_LABELS[currentPractice]} · ${TIER_LABELS[currentTier]}`;
    }

    document.getElementById("est-price").innerText = data.price;
    document.getElementById("est-timeline").innerText = data.timeline;
    document.getElementById("est-coverage").innerText = data.coverage;
    document.getElementById("est-deliverable").innerText = data.deliverable;
}

function scrollToContactWithPrefill() {
    const categorySelect = document.getElementById("project-category");
    if (categorySelect) {
        if (currentPractice === "quant") categorySelect.value = "quantitative_finance";
        else if (currentPractice === "web_mobile") categorySelect.value = "web_mobile_dev";
        else if (currentPractice === "cloud") categorySelect.value = "cloud_microservices";
        else if (currentPractice === "ai_agents") categorySelect.value = "ai_agentic_systems";
    }

    const budgetSelect = document.getElementById("budget-tier");
    if (budgetSelect) {
        if (currentTier === "standard") budgetSelect.value = "tier_500_1500";
        else if (currentTier === "advanced") budgetSelect.value = "tier_1500_5000";
        else if (currentTier === "enterprise") budgetSelect.value = "tier_5000_15000";
    }

    const summary = document.getElementById("project-summary");
    const data = ESTIMATOR_DATA[currentPractice]?.[currentTier];
    if (summary && data && !summary.value.trim()) {
        summary.value = `Estimator selection: ${PRACTICE_LABELS[currentPractice]} — ${TIER_LABELS[currentTier]}.
Indicative budget: ${data.price}
Typical delivery: ${data.timeline}

Project requirements:`;
    }

    const contactSection = document.getElementById("contact");
    if (contactSection) contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function handleInquirySubmit(event) {
    event.preventDefault();

    const form = document.getElementById("client-inquiry-form");
    const submitBtn = document.getElementById("submit-btn");
    const clientName = document.getElementById("client-name").value.trim();
    const clientOrg = document.getElementById("client-org").value.trim();
    const clientEmail = document.getElementById("client-email").value.trim();
    const clientContact = document.getElementById("client-contact").value.trim();
    const projectSummary = document.getElementById("project-summary").value.trim();
    const honeypot = document.getElementById("website-url");

    // Silent bot trap. Real visitors never see or fill this field.
    if (honeypot && honeypot.value.trim()) {
        form.reset();
        return;
    }

    if (projectSummary.length < 20) {
        showInquiryStatus("Please add a little more detail about what you want built.", "error");
        document.getElementById("project-summary").focus();
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Submitting Securely...</span>`;
    showInquiryStatus("Sending your request to the engineering desk…", "pending");

    const catSelect = document.getElementById("project-category");
    const projectCategory = catSelect.value;
    const catLabel = catSelect.options[catSelect.selectedIndex]?.text || projectCategory;
    const budgetSelect = document.getElementById("budget-tier");
    const budgetTier = budgetSelect.value;
    const budgetLabel = budgetSelect.options[budgetSelect.selectedIndex]?.text || budgetTier;

    const payload = {
        name: clientName,
        organization: clientOrg,
        email: clientEmail,
        contact_handle: clientContact,
        category: projectCategory,
        budget_tier: budgetTier,
        requirements: projectSummary,
        attached_file: contactAttachedFile ? `${contactAttachedFile.name} (${contactAttachedFile.size})` : null,
        timestamp: Date.now(),
        source: "nextgentechdev.com"
    };

    let ticketId = "";
    let submitted = false;

    try {
        const response = await fetch("/api/client/inquire", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Inquiry API returned HTTP ${response.status}`);
        }

        const resData = await response.json();
        ticketId = resData.ticket_id || `TKT-${Date.now().toString(36).toUpperCase()}`;
        submitted = true;
    } catch (err) {
        console.warn("Client inquiry could not reach the server.", err);

        showInquiryStatus(
            "We could not confirm delivery of your request. Please retry, or contact us directly on WhatsApp/Telegram below so your project is not missed.",
            "error"
        );
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Retry Submission</span>`;
        return;
    }

    if (!submitted) return;

    document.getElementById("client-inquiry-form").style.display = "none";
    document.getElementById("ticket-ref").innerText = ticketId;
    document.getElementById("inquiry-success-box").style.display = "block";

    submitBtn.disabled = false;
    submitBtn.innerHTML = `<span>Send Project Brief</span>`;

    const effectiveContact = clientContact || clientEmail;
    const chatInquiryText = `📋 [INBOUND SOW INQUIRY: ${ticketId}]\n` +
        `• Client: ${clientName || 'Direct Client'}${clientOrg ? ' (' + clientOrg + ')' : ''}\n` +
        `• Contact: ${effectiveContact || 'Via Portal'}\n` +
        `• Discipline: ${catLabel}\n` +
        `• Budget Tier: ${budgetLabel}\n` +
        (contactAttachedFile ? `• Initial Attachment: ${contactAttachedFile.name} (${contactAttachedFile.size})\n` : '') +
        `\nSpecifications:\n${projectSummary}`;

    // Chat handoff is secondary: the lead is already confirmed by the inquiry API.
    try {
        await fetch('/api/chat/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: liveChatState.sessionId,
                message: chatInquiryText,
                name: clientName || 'Client',
                contact: effectiveContact,
                attachment: contactAttachedFile && contactAttachedFile.data_base64 ? {
                    filename: contactAttachedFile.filename || contactAttachedFile.name,
                    size_bytes: contactAttachedFile.size_bytes,
                    size_str: contactAttachedFile.size_str || contactAttachedFile.size,
                    mime_type: contactAttachedFile.mime_type || contactAttachedFile.type || 'application/octet-stream',
                    data_base64: contactAttachedFile.data_base64
                } : null
            })
        });
    } catch (chatErr) {
        console.warn('Chat handoff unavailable:', chatErr);
    }

    setTimeout(() => {
        if (window.openLiveChat) {
            window.openLiveChat({ name: clientName, contact: effectiveContact });
            pollChatMessages();
        }
    }, 600);
}

function showInquiryStatus(message, type = "pending") {
    let el = document.getElementById("inquiry-status");
    if (!el) {
        el = document.createElement("div");
        el.id = "inquiry-status";
        el.setAttribute("role", "status");
        el.setAttribute("aria-live", "polite");
        const footer = document.querySelector("#client-inquiry-form .form-footer");
        if (footer) footer.parentNode.insertBefore(el, footer);
    }
    el.className = `inquiry-status inquiry-status-${type}`;
    el.textContent = message;
}

function resetInquiryForm() {
    document.getElementById("client-inquiry-form").reset();
    removeContactFile();
    document.getElementById("client-inquiry-form").style.display = "block";
    document.getElementById("inquiry-success-box").style.display = "none";
}

function filterCatalog(category, buttonElement) {
    const tabs = document.querySelectorAll('.catalog-tab');
    tabs.forEach(t => t.classList.remove('active'));
    if (buttonElement) {
        buttonElement.classList.add('active');
    }

    const cards = document.querySelectorAll('.catalog-card');
    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function selectCatalogItem(categoryValue, practiceKey) {
    const categorySelect = document.getElementById("project-category");
    if (categorySelect && categoryValue) {
        categorySelect.value = categoryValue;
    }
    if (practiceKey && ESTIMATOR_DATA[practiceKey]) {
        currentPractice = practiceKey;
        const practiceBtns = document.querySelectorAll("#practice-selector .toggle-btn");
        practiceBtns.forEach(b => {
            if (b.getAttribute("data-practice") === practiceKey) {
                b.classList.add("active");
            } else {
                b.classList.remove("active");
            }
        });
        updateEstimatorDisplay();
    }
    const estimatorSection = document.getElementById("estimator");
    if (estimatorSection) {
        estimatorSection.scrollIntoView({ behavior: "smooth" });
    }
}

// ==========================================
// Custom Architecture AI Feasibility Triage & Document Rails
// ==========================================

let triageAttachedFile = null;
let contactAttachedFile = null;

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
}

function handleTriageFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
        alert("File size exceeds 3MB limit. Please attach a smaller file.");
        event.target.value = "";
        return;
    }

    const sizeStr = formatFileSize(file.size);
    const reader = new FileReader();
    reader.onload = () => {
        triageAttachedFile = {
            name: file.name,
            size: sizeStr,
            type: file.type,
            filename: file.name,
            size_bytes: file.size,
            size_str: sizeStr,
            mime_type: file.type || "application/octet-stream",
            data_base64: reader.result
        };
    };
    reader.readAsDataURL(file);

    const nameEl = document.getElementById("triage-file-name");
    const sizeEl = document.getElementById("triage-file-size");
    const prevEl = document.getElementById("triage-file-preview");
    const lblEl = document.getElementById("triage-upload-label");
    if (nameEl) nameEl.innerText = file.name;
    if (sizeEl) sizeEl.innerText = `(${sizeStr})`;
    if (prevEl) prevEl.style.display = "inline-flex";
    if (lblEl) lblEl.style.display = "none";
}

function removeTriageFile() {
    triageAttachedFile = null;
    const fileInput = document.getElementById("triage-file-input");
    if (fileInput) fileInput.value = "";
    const prevEl = document.getElementById("triage-file-preview");
    const lblEl = document.getElementById("triage-upload-label");
    if (prevEl) prevEl.style.display = "none";
    if (lblEl) lblEl.style.display = "inline-flex";
}

function handleContactFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
        alert("File size exceeds 3MB limit. Please upload a smaller file.");
        event.target.value = "";
        return;
    }

    const sizeStr = formatFileSize(file.size);
    const reader = new FileReader();
    reader.onload = () => {
        contactAttachedFile = {
            name: file.name,
            size: sizeStr,
            type: file.type,
            filename: file.name,
            size_bytes: file.size,
            size_str: sizeStr,
            mime_type: file.type || "application/octet-stream",
            data_base64: reader.result
        };
    };
    reader.readAsDataURL(file);

    const nameEl = document.getElementById("contact-file-name");
    const sizeEl = document.getElementById("contact-file-size");
    const prevEl = document.getElementById("contact-file-preview");
    const lblEl = document.getElementById("contact-upload-label");
    if (nameEl) nameEl.innerText = file.name;
    if (sizeEl) sizeEl.innerText = `(${sizeStr})`;
    if (prevEl) prevEl.style.display = "inline-flex";
    if (lblEl) lblEl.style.display = "none";
}

function removeContactFile() {
    contactAttachedFile = null;
    const fileInput = document.getElementById("contact-file-input");
    if (fileInput) fileInput.value = "";
    const prevEl = document.getElementById("contact-file-preview");
    const lblEl = document.getElementById("contact-upload-label");
    if (prevEl) prevEl.style.display = "none";
    if (lblEl) lblEl.style.display = "inline-flex";
}

let currentTriagePresetKey = "custom";

const TRIAGE_PLACEHOLDERS = {
    algo: "e.g. 'Custom MT4/MT5 trading bot with multi-pair order blocks and trailing stop'...",
    saas: "e.g. 'Full-stack Next.js SaaS customer portal with PostgreSQL, authentication, and Stripe billing'...",
    voice: "e.g. 'Conversational voice AI agent with real-time audio and CRM integration'...",
    custom: "Enter your custom project or task here..."
};

const TRIAGE_PRESET_PROMPTS = {
    algo: "We need a custom MT4/MT5 trading bot featuring multi-pair order block detection, Fair Value Gap visualizer, and spread protection with automated trailing break-even.",
    saas: "We need a full-stack Next.js 15 responsive multi-tenant SaaS customer portal with PostgreSQL database, Stripe subscription billing webhooks, role-based access control, and fast page loads.",
    voice: "We require a conversational voice AI agent capable of real-time audio streaming via WebSockets with sub-second latency, CRM tool-calling, and speech interruption handling."
};

function applyTriagePreset(key, btn) {
    const input = document.getElementById("custom-spec-input");
    if (!input) return;

    currentTriagePresetKey = key;

    // Highlight active chip
    const chips = document.querySelectorAll(".triage-preset-chips .preset-chip");
    chips.forEach(c => c.classList.remove("active"));
    if (btn) btn.classList.add("active");

    // Clear typed value so textarea is never prefilled with hardcoded white text
    input.value = "";

    // Set illustrative background placeholder
    input.placeholder = TRIAGE_PLACEHOLDERS[key] || "Enter your custom project here...";
    input.focus();
}

async function runFeasibilityTriage() {
    const input = document.getElementById("custom-spec-input");
    let desc = (input ? input.value : "").trim();
    const btn = document.getElementById("btn-run-triage");
    const emptyBox = document.getElementById("dossier-empty");
    const resultBox = document.getElementById("dossier-result");

    // If user hasn't typed text:
    if (!desc) {
        if (triageAttachedFile) {
            desc = `[DOCUMENT ATTACHED: ${triageAttachedFile.name}] Architecture and technical specification document submitted for custom engineering evaluation.`;
        } else if (currentTriagePresetKey && TRIAGE_PRESET_PROMPTS[currentTriagePresetKey]) {
            // If they clicked a preset chip and hit run, analyze that preset
            desc = TRIAGE_PRESET_PROMPTS[currentTriagePresetKey];
        } else {
            alert("Please enter your custom project details in the box above.");
            if (input) input.focus();
            return;
        }
    } else if (desc.length < 8 && !triageAttachedFile) {
        alert("Please describe your custom project requirements in at least 8-10 characters.");
        if (input) input.focus();
        return;
    }

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span>Analyzing Project Scope...</span>`;
    }

    let triageData = null;

    try {
        const resp = await fetch("/api/client/feasibility", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                description: desc,
                attached_file: triageAttachedFile ? `${triageAttachedFile.name} (${triageAttachedFile.size})` : null
            })
        });
        if (resp.ok) {
            triageData = await resp.json();
            if (triageData && triageData.status === "FEASIBLE") {
                const price = Number(triageData.estimated_price);
                triageData = {
                    ...triageData,
                    complexity_tier: triageData.complexity_tier || triageData.complexity || "Standard",
                    estimated_timeline: triageData.estimated_timeline || (triageData.timeline_days ? `${triageData.timeline_days} Calendar Days` : "Confirmed after requirements review"),
                    estimated_investment: triageData.estimated_investment || (Number.isFinite(price) ? `$${price.toLocaleString("en-US")} USD` : "Confirmed after requirements review"),
                    architecture_blueprint: triageData.architecture_blueprint || triageData.summary || "Initial automated scope estimate. Final architecture follows engineering review.",
                    recommended_stack: Array.isArray(triageData.recommended_stack) ? triageData.recommended_stack : []
                };
            }
        }
    } catch (e) {
        console.warn("Feasibility backend offline; utilizing client-side triage engine.", e);
    }

    // Client-side fallback if server fails (WHITELIST approach — same as backend)
    if (!triageData) {
        const lower = desc.toLowerCase();
        // Explicit out-of-scope
        const outOfScope = ["plumber", "plumbing", "electrician", "carpenter", "mechanic",
            "hardware repair", "soldering", "physical", "fan", "cleaning", "hack", "ddos",
            "malware", "ransomware", "essay", "homework", "paper writing", "doctor", "dentist",
            "lawyer", "accountant", "cook", "chef", "maid", "gardener", "painter", "plumber",
            "locksmith", "welder", "handyman", "printer repair", "phone screen", "fix my"];

        // Scope & Complexity Scale Detection
        const microSignals = [
            "small", "quick", "minor", "tweak", "simple", "bug", "fix", "error",
            "adjust", "adjustment", "patch", "edit", "tiny", "little", "lightweight",
            "few lines", "one page", "single page", "script", "update button",
            "css fix", "styling fix", "debug", "one feature", "modify", "small task",
            "chota", "chhota", "choti", "chhoti", "halka", "basic", "quick fix", "urgent fix",
            "low budget", "kam budget", "mini", "micro", "single task", "one task",
            "simple solution", "small solution", "chota solution", "chota project", "small project"
        ];
        const enterpriseSignals = [
            "enterprise", "institutional", "distributed", "kubernetes", "multi-region",
            "cluster", "swarm", "high frequency", "sub-millisecond", "audit",
            "formal verification", "compliance", "multi-tenant", "large scale"
        ];
        const advancedSignals = [
            "full stack", "full-stack", "fullstack", "saas", "platform", "production",
            "database", "stripe", "billing", "cross-platform", "flutter", "react native",
            "voice ai", "rag", "etl pipeline", "arbitrage", "mev"
        ];

        let scale = "standard";
        let tierLabel = "Modular Solution";
        if (microSignals.some(w => lower.includes(w))) {
            scale = "micro";
            tierLabel = "Micro Task / Rapid Solution";
        } else if (enterpriseSignals.some(w => lower.includes(w))) {
            scale = "enterprise";
            tierLabel = "Enterprise Solution";
        } else if (advancedSignals.some(w => lower.includes(w))) {
            scale = "advanced";
            tierLabel = "Production System";
        }

        // Recognized software/tech whitelist
        const inScope = ["software", "program", "application", "develop", "code", "coding",
            "api", "backend", "server", "website", "web app", "saas", "react", "nextjs",
            "mobile app", "ios", "android", "flutter", "trading", "mt4", "mt5", "forex",
            "algo", "ai ", "agent", "llm", "rag", "chatbot", "gpt", "machine learning",
            "scrape", "etl", "data pipeline", "database", "sql", "docker", "kubernetes",
            "cloud", "microservice", "automation", "bot", "blockchain", "web3",
            "smart contract", "webhook", "dashboard", "portal", "stripe", "authentication",
            "platform", "system", "tool", "plugin", "framework", "integration", "document attached",
            "project", "task", "solution", "bug", "script", "kaam", "fix"];

        if (outOfScope.some(w => lower.includes(w))) {
            triageData = {
                status: "OUT_OF_SCOPE",
                verdict: "Scope Notice: Non-Digital Service",
                reason: "NextGen Tech Solutions is a specialized software engineering agency. We build algorithmic trading systems, enterprise web & mobile platforms, AI agents, cloud microservices, and data pipelines. Physical trades, manual labor, hardware repairs, academic writing, and non-software services are outside our service scope.",
                action_advice: "We only accept software engineering, algorithmic trading, web/mobile development, cloud infrastructure, data pipeline, and AI/ML automation projects.",
                can_fast_track: false
            };
        } else if (lower.includes("bot") && !["trade", "trading", "crypto", "forex", "mt4", "mt5", "telegram", "discord", "scrap", "playwright", "selenium", "ai", "chat", "support", "rag"].some(w => lower.includes(w))) {
            triageData = {
                status: "NEEDS_CLARIFICATION",
                verdict: "Specification Needed: What type of bot do you need?",
                category: "bot",
                clarification_question: "What type of bot are you looking to build?",
                reason: "You asked for a bot, but bot architectures differ fundamentally depending on what they execute (algorithmic trading, social community automation, headless browser data extraction, or conversational AI). Please select your target domain to calculate exact architecture, timeline, and investment:",
                options: [
                    {
                        id: "trading_bot",
                        icon: "📈",
                        title: "Algorithmic Trading Bot",
                        subtitle: "MT4/MT5, Crypto DEX/CEX, PineScript, or Webhook Automation",
                        prompt: "Custom Algorithmic Trading Bot for MT5 / Crypto with automated risk management and webhook alerts",
                        est_timeline: "2 – 4 Calendar Days",
                        est_budget: "$220.00 – $480.00 USD"
                    },
                    {
                        id: "telegram_discord_bot",
                        icon: "💬",
                        title: "Telegram or Discord Bot",
                        subtitle: "Community automation, alerts, interactive commands & WebSockets",
                        prompt: "Telegram / Discord Bot with automated command handler, database storage, and real-time event alerts",
                        est_timeline: "2 – 3 Calendar Days",
                        est_budget: "$150.00 – $380.00 USD"
                    },
                    {
                        id: "scraping_bot",
                        icon: "🕷️",
                        title: "Web Scraping & Automation Bot",
                        subtitle: "Headless browser crawler with Playwright, anti-bot bypass & CSV/JSON export",
                        prompt: "Headless Web Scraping and Automation Bot using Playwright with proxy rotation and automated CSV data pipeline",
                        est_timeline: "2 – 3 Calendar Days",
                        est_budget: "$120.00 – $350.00 USD"
                    },
                    {
                        id: "ai_chatbot",
                        icon: "🧠",
                        title: "AI Customer Support Chatbot",
                        subtitle: "LLM intelligence (OpenAI / Claude) with custom document RAG retrieval",
                        prompt: "AI Conversational Chatbot powered by OpenAI / Claude with custom document RAG search and customer support workflows",
                        est_timeline: "2 – 4 Calendar Days",
                        est_budget: "$280.00 – $650.00 USD"
                    }
                ],
                can_fast_track: false
            };
        } else if (inScope.some(w => lower.includes(w))) {
            let timeline = "2 – 4 Calendar Days";
            let budget = "$220.00 – $500.00 USD";
            let blueprint = "Custom modular software solution engineered to specification with automated tests.";

            if (scale === "micro") {
                timeline = "4 – 18 Hours";
                budget = "$35.00 – $95.00 USD";
                blueprint = "Targeted micro task, surgical bug diagnosis, script modification, or rapid implementation with verified testing.";
            } else if (scale === "advanced") {
                timeline = "5 – 10 Calendar Days";
                budget = "$750.00 – $1,900.00 USD";
                blueprint = "Full-stack production platform engineered for high availability, automated commercial billing, and verified stability.";
            } else if (scale === "enterprise") {
                timeline = "12 – 24 Calendar Days";
                budget = "$2,400.00 – $6,500.00 USD";
                blueprint = "Enterprise cloud architecture with microservices, high-availability caching, and automated CI/CD.";
            }

            triageData = {
                status: "FEASIBLE",
                verdict: "Verified & Ready for Build",
                match_score: 98.4,
                complexity_tier: tierLabel,
                recommended_stack: ["Python 3.11", "FastAPI AsyncIO", "Docker CI/CD", "PostgreSQL 16"],
                estimated_timeline: timeline,
                estimated_investment: budget,
                architecture_blueprint: blueprint,
                can_fast_track: true
            };
        } else {
            triageData = {
                status: "OUT_OF_SCOPE",
                verdict: "Scope Notice: Non-Digital Service",
                reason: "Your request does not match any recognized software engineering domain within our service scope. NextGen Tech Solutions exclusively delivers digital software solutions.",
                action_advice: "Please describe a specific software, web, mobile, AI, trading algorithm, data pipeline, or cloud infrastructure project for accurate feasibility analysis.",
                can_fast_track: false
            };
        }
    }

    if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<span>Generate Starting Scope</span> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>`;
    }

    if (emptyBox) emptyBox.style.display = "none";
    if (resultBox) {
        resultBox.style.display = "block";

        if (triageData.status === "FEASIBLE") {
            const pillsHtml = (triageData.recommended_stack || []).map(s => `<span class="tech-pill">${s}</span>`).join(" ");
            const fileBannerHtml = triageAttachedFile ? `
                <div class="dossier-file-attached" style="margin-bottom: 14px; padding: 6px 12px; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.35); border-radius: 6px; font-size: 11.5px; color: var(--primary); display: flex; align-items: center; gap: 8px;">
                    <span>📄 Attached Document Included:</span>
                    <strong style="color: #fff;">${triageAttachedFile.name}</strong>
                    <span style="color: var(--text-dim);">(${triageAttachedFile.size})</span>
                </div>
            ` : "";
            let tierClass = "tier-badge-standard";
            const cTier = (triageData.complexity_tier || "").toLowerCase();
            if (cTier.includes("micro")) tierClass = "tier-badge-micro";
            else if (cTier.includes("enterprise") || cTier.includes("institutional")) tierClass = "tier-badge-enterprise";
            else if (cTier.includes("production") || cTier.includes("advanced")) tierClass = "tier-badge-advanced";

            resultBox.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 10px;">
                    <div>
                        <div style="font-size: 17px; font-weight: 700; color: #fff; letter-spacing: -0.2px;">Project Scope &amp; Estimate</div>
                        <div style="font-size: 12px; color: var(--text-dim); margin-top: 2px;">Tailored technical specification &amp; fixed timeline</div>
                    </div>
                    <span class="tier-badge ${tierClass}">
                        ${triageData.complexity_tier || 'Modular Solution'}
                    </span>
                </div>
                ${fileBannerHtml}
                <div class="dossier-spec-grid">
                    <div>
                        <div class="spec-box-lbl">Estimated Timeline:</div>
                        <div class="spec-box-val text-cyan">${triageData.estimated_timeline}</div>
                    </div>
                    <div>
                        <div class="spec-box-lbl">Indicative Investment:</div>
                        <div class="spec-box-val text-emerald">${triageData.estimated_investment}</div>
                    </div>
                </div>
                <div class="dossier-notes">
                    <strong>Technical Scope:</strong> ${triageData.architecture_blueprint}
                </div>
                <div class="dossier-stack-pills">
                    ${pillsHtml}
                </div>
                <button type="button" class="btn btn-primary btn-block" onclick="fastTrackFromTriage('${escape(desc)}')">
                    <span>Proceed to Statement of Work &rarr;</span>
                </button>
            `;
        } else if (triageData.status === "NEEDS_CLARIFICATION") {
            const optionsHtml = (triageData.options || []).map(opt => `
                <div class="clarification-card" onclick="selectClarificationOption('${escape(opt.prompt)}')">
                    <div class="clarification-card-header">
                        <span class="clarification-icon">${opt.icon || '⚡'}</span>
                        <div class="clarification-card-titles">
                            <div class="clarification-card-title">${opt.title}</div>
                            <div class="clarification-card-sub">${opt.subtitle || ''}</div>
                        </div>
                    </div>
                    <div class="clarification-card-meta">
                        <div class="clarification-meta-pill"><span class="meta-lbl">Timeline:</span> <strong>${opt.est_timeline}</strong></div>
                        <div class="clarification-meta-pill pill-emerald"><span class="meta-lbl">Investment:</span> <strong>${opt.est_budget}</strong></div>
                    </div>
                    <div class="clarification-card-btn">
                        <span>Select Specification</span> &rarr;
                    </div>
                </div>
            `).join("");

            resultBox.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 10px;">
                    <div>
                        <div style="font-size: 16px; font-weight: 700; color: #fff; letter-spacing: -0.2px;">Specification Needed</div>
                        <div style="font-size: 12px; color: var(--text-dim); margin-top: 2px;">NextGen Reasoning Engine &bull; Domain Disambiguation</div>
                    </div>
                    <span class="tier-badge tier-badge-clarification">
                        Clarification Required
                    </span>
                </div>
                <div class="clarification-question-box">
                    <div style="font-size: 13.5px; font-weight: 600; color: #38bdf8; margin-bottom: 5px;">
                        ${triageData.clarification_question || 'What specific type of solution do you need?'}
                    </div>
                    <div style="font-size: 12px; color: var(--text-dim); line-height: 1.55;">
                        ${triageData.reason || 'Bot and application architectures differ fundamentally in engineering stack, timeline, and cost. Please select your target domain to calculate exact pricing:'}
                    </div>
                </div>
                <div class="clarification-grid">
                    ${optionsHtml}
                </div>
            `;
        } else {
            resultBox.innerHTML = `
                <div style="margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border-subtle);">
                    <div style="font-size: 16px; font-weight: 700; color: #f87171;">Service Scope Notice</div>
                </div>
                <div class="dossier-declined-notes">
                    <strong>Scope Policy:</strong> ${triageData.reason}
                </div>
                <p style="font-size: 12px; color: var(--text-dim); line-height: 1.5; margin-bottom: 16px;">
                    ${triageData.action_advice || "We exclusively engineer software applications, web platforms, mobile systems, algorithmic tools, and cloud pipelines."}
                </p>
                <button type="button" class="btn btn-secondary btn-block btn-sm" onclick="applyTriagePreset('algo'); runFeasibilityTriage();">
                    <span>Explore Standard Software Solutions</span>
                </button>
            `;
        }
    }
}

window.selectClarificationOption = function(escapedPrompt) {
    const prompt = unescape(escapedPrompt);
    const input = document.getElementById("custom-spec-input");
    if (input) {
        input.value = prompt;
        input.classList.add("input-pulse-highlight");
        setTimeout(() => input.classList.remove("input-pulse-highlight"), 1200);
        input.focus();
    }
    runFeasibilityTriage();
};

function fastTrackFromTriage(escapedDesc) {
    const rawDesc = unescape(escapedDesc);
    const summaryInput = document.getElementById("project-summary");
    if (summaryInput) {
        let note = `[AI TRIAGE FAST-TRACK]\n` + rawDesc;
        if (triageAttachedFile) {
            note += `\n[Attached Spec: ${triageAttachedFile.name} (${triageAttachedFile.size})]`;
        }
        summaryInput.value = note;
    }
    if (triageAttachedFile && !contactAttachedFile) {
        contactAttachedFile = { ...triageAttachedFile };
        const nameEl = document.getElementById("contact-file-name");
        const sizeEl = document.getElementById("contact-file-size");
        const prevEl = document.getElementById("contact-file-preview");
        const lblEl = document.getElementById("contact-upload-label");
        if (nameEl) nameEl.innerText = contactAttachedFile.name;
        if (sizeEl) sizeEl.innerText = `(${contactAttachedFile.size})`;
        if (prevEl) prevEl.style.display = "inline-flex";
        if (lblEl) lblEl.style.display = "none";
    }
    const catSelect = document.getElementById("project-category");
    if (catSelect) {
        catSelect.value = "custom_enterprise";
    }
    const contactSection = document.getElementById("contact");
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
    }
}

/* ═══════════════════════════════════════════════════════════════════
   NextGen Live Engineering Desk Chat Controller
   ═══════════════════════════════════════════════════════════════════ */

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
window.escapeHtml = escapeHtml;

const liveChatState = {
    sessionId: localStorage.getItem('nexgen_chat_session_id') || ('chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6)),
    isOpen: false,
    lastTimestamp: 0,
    pollTimer: null,
    renderedIds: new Set()
};
localStorage.setItem('nexgen_chat_session_id', liveChatState.sessionId);

window.openLiveChat = function (options = {}) {
    const widget = document.getElementById('live-chat-widget');
    const badge = document.getElementById('chat-unread-badge');
    if (!widget) return;

    liveChatState.isOpen = true;
    widget.classList.add('active');
    widget.setAttribute('aria-hidden', 'false');
    const launcher = document.getElementById('live-chat-launcher');
    if (launcher) launcher.setAttribute('aria-expanded', 'true');

    if (badge) badge.style.display = 'none';

    if (options.name) {
        const nameInput = document.getElementById('chat-visitor-name');
        if (nameInput) nameInput.value = options.name;
    }
    if (options.contact) {
        const contactInput = document.getElementById('chat-visitor-contact');
        if (contactInput) contactInput.value = options.contact;
    }

    const input = document.getElementById('chat-msg-input');
    if (input) setTimeout(() => input.focus(), 250);

    scrollChatToBottom();
    startChatPolling();
};

window.toggleLiveChat = function () {
    if (liveChatState.isOpen) {
        const widget = document.getElementById('live-chat-widget');
        if (widget) {
            widget.classList.remove('active');
            widget.setAttribute('aria-hidden', 'true');
        }
        const launcher = document.getElementById('live-chat-launcher');
        if (launcher) launcher.setAttribute('aria-expanded', 'false');
        liveChatState.isOpen = false;
    } else {
        window.openLiveChat();
    }
};

function startChatPolling() {
    if (liveChatState.pollTimer) clearInterval(liveChatState.pollTimer);
    pollChatMessages();
    liveChatState.pollTimer = setInterval(pollChatMessages, 3500);
}

async function pollChatMessages() {
    try {
        const resp = await fetch(`/api/chat/poll?session_id=${encodeURIComponent(liveChatState.sessionId)}&after=${liveChatState.lastTimestamp}`);
        if (!resp.ok) return;
        const data = await resp.json();
        if (data.status === 'SUCCESS' && Array.isArray(data.messages) && data.messages.length > 0) {
            let hasNewOperatorMsg = false;
            data.messages.forEach(msg => {
                if (!liveChatState.renderedIds.has(msg.id)) {
                    renderChatMessage(msg);
                    liveChatState.renderedIds.add(msg.id);
                    if (msg.timestamp > liveChatState.lastTimestamp) {
                        liveChatState.lastTimestamp = msg.timestamp;
                    }
                    if (msg.sender === 'operator') hasNewOperatorMsg = true;
                }
            });
            scrollChatToBottom();

            if (hasNewOperatorMsg && !liveChatState.isOpen) {
                const badge = document.getElementById('chat-unread-badge');
                if (badge) badge.style.display = 'inline-block';
            }
        }
    } catch (e) {
        // Silent poll error handling
    }
}

// ═══════════════════════════════════════════════════════════
// Live Chat Document Attachment State & Handlers
// ═══════════════════════════════════════════════════════════
let chatSelectedAttachment = null;

window.triggerChatFileSelect = function () {
    const fileInput = document.getElementById('chat-file-input');
    if (fileInput) fileInput.click();
};

window.handleChatFileSelected = function (e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Keep chat uploads within the production API proxy request limit
    if (file.size > 3 * 1024 * 1024) {
        alert("File size exceeds 3MB limit. Please select a smaller document.");
        e.target.value = '';
        return;
    }

    const sizeKb = file.size / 1024;
    const sizeStr = sizeKb < 1024 ? `${sizeKb.toFixed(1)} KB` : `${(sizeKb / 1024).toFixed(1)} MB`;

    const ext = file.name.split('.').pop().toLowerCase();
    let icon = "📄";
    if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext)) icon = "🖼️";
    else if (['zip', 'rar', 'tar', 'gz', '7z'].includes(ext)) icon = "📦";
    else if (['pdf'].includes(ext)) icon = "📕";
    else if (['doc', 'docx'].includes(ext)) icon = "📘";
    else if (['xls', 'xlsx', 'csv'].includes(ext)) icon = "📊";
    else if (['json', 'py', 'js', 'ts', 'html', 'css'].includes(ext)) icon = "⚙️";

    const reader = new FileReader();
    reader.onload = function (loadEvent) {
        chatSelectedAttachment = {
            filename: file.name,
            size_bytes: file.size,
            size_str: sizeStr,
            mime_type: file.type || 'application/octet-stream',
            data_base64: loadEvent.target.result
        };

        const previewBar = document.getElementById('chat-attachment-preview-bar');
        const nameEl = document.getElementById('chat-chip-name');
        const sizeEl = document.getElementById('chat-chip-size');
        const iconEl = document.getElementById('chat-chip-icon');
        const attachBtn = document.getElementById('chat-attach-btn');

        if (nameEl) nameEl.textContent = file.name;
        if (sizeEl) sizeEl.textContent = sizeStr;
        if (iconEl) iconEl.textContent = icon;
        if (previewBar) previewBar.style.display = 'block';
        if (attachBtn) attachBtn.classList.add('has-file');

        const input = document.getElementById('chat-msg-input');
        if (input) input.focus();
    };
    reader.readAsDataURL(file);
};

window.clearChatAttachment = function () {
    chatSelectedAttachment = null;
    const fileInput = document.getElementById('chat-file-input');
    if (fileInput) fileInput.value = '';
    const previewBar = document.getElementById('chat-attachment-preview-bar');
    if (previewBar) previewBar.style.display = 'none';
    const attachBtn = document.getElementById('chat-attach-btn');
    if (attachBtn) attachBtn.classList.remove('has-file');
};

window.handleSendChatMessage = async function (e) {
    if (e) e.preventDefault();
    const input = document.getElementById('chat-msg-input');
    const text = input ? input.value.trim() : '';

    if (!text && !chatSelectedAttachment) return;

    const nameInput = document.getElementById('chat-visitor-name');
    const contactInput = document.getElementById('chat-visitor-contact');
    const name = nameInput ? nameInput.value.trim() : '';
    const contact = contactInput ? contactInput.value.trim() : '';

    const attachmentToSend = chatSelectedAttachment;

    if (input) input.value = '';
    clearChatAttachment();

    // Optimistic local render
    const tempId = 'temp_' + Date.now();
    const localMsg = {
        id: tempId,
        sender: 'client',
        sender_name: name || 'You',
        message: text || (attachmentToSend ? `📄 Document: ${attachmentToSend.filename}` : ''),
        attachment: attachmentToSend ? {
            filename: attachmentToSend.filename,
            url: attachmentToSend.data_base64,
            size_str: attachmentToSend.size_str,
            extension: attachmentToSend.filename.split('.').pop().toLowerCase()
        } : null,
        timestamp: Date.now() / 1000
    };
    try {
        renderChatMessage(localMsg);
        scrollChatToBottom();
    } catch (renderErr) {
        console.warn('[LiveChat] Optimistic render warning:', renderErr);
    }

    try {
        const resp = await fetch('/api/chat/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: liveChatState.sessionId,
                message: text,
                name: name,
                contact: contact,
                attachment: attachmentToSend
            })
        });

        if (resp.ok) {
            const data = await resp.json();
            if (data.message && data.message.id) {
                liveChatState.renderedIds.add(data.message.id);
                if (data.message.timestamp > liveChatState.lastTimestamp) {
                    liveChatState.lastTimestamp = data.message.timestamp;
                }
                const localEl = document.getElementById(`chat-msg-${tempId}`);
                if (localEl && data.message.attachment) {
                    localEl.id = `chat-msg-${data.message.id}`;
                    const cardLink = localEl.querySelector('.chat-attachment-card');
                    if (cardLink && data.message.attachment.url) {
                        cardLink.href = data.message.attachment.url;
                    }
                }
            }
            if (data.auto_reply) {
                setTimeout(() => {
                    renderChatMessage(data.auto_reply);
                    liveChatState.renderedIds.add(data.auto_reply.id);
                    if (data.auto_reply.timestamp > liveChatState.lastTimestamp) {
                        liveChatState.lastTimestamp = data.auto_reply.timestamp;
                    }
                    scrollChatToBottom();
                }, 600);
            }
        }
    } catch (err) {
        console.warn('[LiveChat] Send error:', err);
        if (input && text) input.value = text;
        if (attachmentToSend) {
            chatSelectedAttachment = attachmentToSend;
        }
        const localEl = document.getElementById(`chat-msg-${tempId}`);
        if (localEl) {
            localEl.classList.add('chat-msg-failed');
            const meta = localEl.querySelector('.chat-msg-meta');
            if (meta) meta.textContent = 'Not sent — check connection and retry';
        }
    }
};

function safeAttachmentUrl(value) {
    if (!value) return '#';
    try {
        if (value.startsWith('data:image/')) return value;
        const url = new URL(value, window.location.origin);
        if (['http:', 'https:', 'blob:'].includes(url.protocol)) return url.href;
    } catch (e) {}
    return '#';
}

function renderChatMessage(msg) {
    try {
        const container = document.getElementById('chat-messages-container');
        if (!container) return;

        const isClient = msg.sender === 'client';
        const msgEl = document.createElement('div');
        msgEl.className = `chat-msg ${isClient ? 'chat-msg-client' : 'chat-msg-operator'}`;
        if (msg.id) msgEl.id = `chat-msg-${msg.id}`;

        const date = new Date(msg.timestamp * 1000);
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const displayName = isClient ? (msg.sender_name || 'You') : (msg.sender_name || 'NextGen Desk');

        let attachmentHtml = '';
        if (msg.attachment) {
            const att = msg.attachment;
            const ext = (att.extension || att.filename.split('.').pop()).toLowerCase();
            const isImg = ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext);
            let icon = "📄";
            if (isImg) icon = "🖼️";
            else if (['zip', 'rar', '7z'].includes(ext)) icon = "📦";
            else if (['pdf'].includes(ext)) icon = "📕";
            else if (['doc', 'docx'].includes(ext)) icon = "📘";
            else if (['xls', 'xlsx', 'csv'].includes(ext)) icon = "📊";

            const downloadUrl = safeAttachmentUrl(att.url);

            attachmentHtml = `
                ${isImg ? `<a href="${downloadUrl}" target="_blank" rel="noopener" class="chat-attachment-img-wrap"><img src="${downloadUrl}" class="chat-attachment-img-preview" alt="${escapeHtml(att.filename)}"></a>` : ''}
                <a href="${downloadUrl}" target="_blank" download="${escapeHtml(att.filename)}" class="chat-attachment-card">
                    <div class="attachment-file-icon">${icon}</div>
                    <div class="attachment-details">
                        <span class="attachment-title">${escapeHtml(att.filename)}</span>
                        <span class="attachment-meta-info">${escapeHtml(att.size_str || ext.toUpperCase())} • Click to Download</span>
                    </div>
                    <div class="attachment-action-icon">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                    </div>
                </a>
            `;
        }

        let bubbleHtml = '';
        const cleanMsg = (msg.message || '').trim();
        if (cleanMsg && (!msg.attachment || cleanMsg !== `📄 Document: ${msg.attachment.filename}`)) {
            bubbleHtml = `<div class="chat-bubble">${escapeHtml(cleanMsg)}</div>`;
        }

        msgEl.innerHTML = `
            ${bubbleHtml}
            ${attachmentHtml}
            <div class="chat-msg-meta">${escapeHtml(displayName)} · ${timeStr}</div>
        `;
        container.appendChild(msgEl);
    } catch (err) {
        console.error('[LiveChat] renderChatMessage error:', err);
    }
}

function scrollChatToBottom() {
    const container = document.getElementById('chat-messages-container');
    if (container) {
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 50);
    }
}

// Initialize chat history on load
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.querySelector('.ng-mobile-menu');
    if (mobileMenu) {
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => mobileMenu.removeAttribute('open'));
        });
    }

    const nav = document.querySelector('.ng-nav');
    if (nav) {
        let navTicking = false;
        const syncNavDepth = () => {
            nav.classList.toggle('is-scrolled', window.scrollY > 24);
            navTicking = false;
        };
        window.addEventListener('scroll', () => {
            if (!navTicking) {
                navTicking = true;
                requestAnimationFrame(syncNavDepth);
            }
        }, { passive: true });
        syncNavDepth();
    }

    const sectionLinks = [...document.querySelectorAll('.ng-nav-links a[href^="#"], .ng-mobile-menu a[href^="#"]')];
    if (sectionLinks.length && 'IntersectionObserver' in window) {
        const targetMap = new Map();
        sectionLinks.forEach(link => {
            const hash = link.getAttribute('href');
            const target = hash && hash.length > 1 ? document.querySelector(hash) : null;
            if (!target) return;
            if (!targetMap.has(target)) targetMap.set(target, []);
            targetMap.get(target).push(link);
        });

        let activeTarget = null;
        const setActiveTarget = target => {
            if (target === activeTarget) return;
            activeTarget = target;
            sectionLinks.forEach(link => link.classList.remove('is-active'));
            (targetMap.get(target) || []).forEach(link => link.classList.add('is-active'));
        };

        const sectionObserver = new IntersectionObserver(entries => {
            const visible = entries
                .filter(entry => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
            if (visible.length) setActiveTarget(visible[0].target);
        }, { rootMargin: '-18% 0px -64% 0px', threshold: [0, 0.08, 0.2] });

        targetMap.forEach((_, target) => sectionObserver.observe(target));
    }

    const chatLauncher = document.getElementById('live-chat-launcher');
    const suppressTargets = [
        document.getElementById('contact'),
        document.querySelector('.ng-footer')
    ].filter(Boolean);
    if (chatLauncher && suppressTargets.length && 'IntersectionObserver' in window) {
        const visibleTargets = new Set();
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) visibleTargets.add(entry.target);
                else visibleTargets.delete(entry.target);
            });
            chatLauncher.classList.toggle('chat-launcher-suppressed', visibleTargets.size > 0);
        }, { threshold: 0.08 });
        suppressTargets.forEach(target => observer.observe(target));
    }

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && liveChatState.isOpen) {
            window.toggleLiveChat();
        }
    });

    setTimeout(() => {
        pollChatMessages();
    }, 1000);
});

