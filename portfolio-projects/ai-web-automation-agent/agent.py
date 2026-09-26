import asyncio
import json
import os
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from browser_use import Agent, Browser, ChatBrowserUse, ChatOpenAI
from dotenv import load_dotenv

load_dotenv()
RUNS_DIR = Path(__file__).parent / "runs"


@dataclass
class RunRecord:
    task: str
    provider: str
    started_at: str
    finished_at: str
    success: bool
    result: str


def _build_llm(provider: str):
    provider = provider.lower().strip()
    if provider == "browser-use":
        return ChatBrowserUse(model=os.getenv("BROWSER_USE_MODEL", "bu-2-0"))
    if provider == "openai":
        return ChatOpenAI(model=os.getenv("OPENAI_MODEL", "gpt-5.6-luna"))
    raise ValueError("provider must be 'openai' or 'browser-use'")


def _save_run(record: RunRecord) -> Path:
    RUNS_DIR.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    path = RUNS_DIR / f"run-{stamp}.json"
    path.write_text(json.dumps(asdict(record), indent=2), encoding="utf-8")
    return path


async def run_task(task: str, provider: str = "openai", cloud_browser: bool = False) -> dict[str, Any]:
    if not task.strip():
        raise ValueError("Task cannot be empty")

    started = datetime.now(timezone.utc)
    llm = _build_llm(provider)
    browser = Browser(use_cloud=True) if cloud_browser else None

    try:
        agent = Agent(task=task, llm=llm, browser=browser)
        history = await agent.run()
        result = str(history.final_result() or "")
        success = True
    except Exception as exc:
        result = f"{type(exc).__name__}: {exc}"
        success = False
    finally:
        if browser is not None:
            close = getattr(browser, "close", None)
            if close is not None:
                maybe_awaitable = close()
                if asyncio.iscoroutine(maybe_awaitable):
                    await maybe_awaitable

    finished = datetime.now(timezone.utc)
    record = RunRecord(
        task=task,
        provider=provider,
        started_at=started.isoformat(),
        finished_at=finished.isoformat(),
        success=success,
        result=result,
    )
    log_path = _save_run(record)
    return {**asdict(record), "log_path": str(log_path)}
