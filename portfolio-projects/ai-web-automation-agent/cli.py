import argparse
import asyncio
import json

from agent import run_task


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Autonomous AI Web Research & Automation Agent")
    parser.add_argument("task", help="Natural-language browser task to execute")
    parser.add_argument(
        "--provider",
        choices=["openai", "browser-use"],
        default="openai",
        help="LLM provider used by the browser agent",
    )
    parser.add_argument(
        "--cloud-browser",
        action="store_true",
        help="Use Browser Use cloud browser instead of a local browser",
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    output = asyncio.run(run_task(args.task, args.provider, args.cloud_browser))
    print(json.dumps(output, indent=2))
