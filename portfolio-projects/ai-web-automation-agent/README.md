# Autonomous AI Web Research & Automation Agent

A portfolio-ready Python agent that accepts a natural-language task, launches an AI-controlled browser workflow, returns the final result, and stores a structured execution log.

## What it demonstrates

- Natural-language task execution
- Autonomous browser navigation
- Multi-step web research and automation
- Local or cloud browser support
- OpenAI or Browser Use model selection
- Structured JSON run history
- Environment-based secret management
- CLI interface for repeatable workflows

## Example use cases

- Research several public websites and summarize findings
- Navigate a multi-step workflow and collect structured information
- Compare public information across multiple pages
- Automate repetitive browser-based research tasks

## Project structure

```text
ai-web-automation-agent/
├── agent.py
├── cli.py
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

## Setup

Python 3.11+ is recommended.

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Add the API key for the provider you want to use to `.env`.

## Run

OpenAI-backed agent:

```bash
python cli.py "Find three recent public announcements from OpenAI and summarize them"
```

Browser Use model:

```bash
python cli.py "Compare the homepages of three AI developer platforms" --provider browser-use
```

Cloud browser:

```bash
python cli.py "Research this public website and summarize its main services" --cloud-browser
```

Each run writes a JSON record into `runs/` with the task, provider, timestamps, success state, and final result.

## Architecture

```text
User Task
   ↓
CLI
   ↓
Agent Orchestrator
   ↓
LLM + Browser Automation
   ↓
Website Interaction
   ↓
Final Result
   ↓
JSON Run Log
```

## Security notes

- API keys are loaded from `.env` and are never committed.
- The agent should only be used on websites and workflows you are authorized to access.
- Review automation behavior before using it for sensitive or irreversible actions.

## Technology

Python, asyncio, Browser Use, python-dotenv, OpenAI/Browser Use model providers.

The browser automation layer uses the open-source **Browser Use** Python package, distributed under the MIT License: https://github.com/browser-use/browser-use

## Portfolio summary

**Autonomous AI Web Research & Automation Agent** — a Python-based agent system that translates natural-language objectives into multi-step browser workflows, executes web research or repetitive browser tasks, and produces structured auditable results.
