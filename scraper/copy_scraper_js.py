#!/usr/bin/env python3
"""
Utility script to copy TikTok comment scraper JavaScript to clipboard.

This script copies the browser console script to clipboard for easy pasting
into the browser's developer console when scraping TikTok comments.
"""

from pathlib import Path
from pyperclip import copy, PyperclipException


def copy_scraper_js_to_clipboard():
    """Copy the TikTok comment scraper JavaScript to system clipboard."""
    js_path = Path(__file__).parent / "tiktok_comment_scraper.js"

    if not js_path.exists():
        print(f"[ERROR] JavaScript file not found: {js_path}")
        return

    try:
        js_code = js_path.read_text(encoding="utf-8")
        copy(js_code)
        print("[SUCCESS] TikTok comment scraper JavaScript copied to clipboard.")
        print("Paste it into the browser console to start scraping.")

    except PyperclipException:
        print(
            "[ERROR] Clipboard access failed.\n"
            "Please copy the JavaScript manually from:\n"
            f"{js_path}"
        )


if __name__ == "__main__":
    copy_scraper_js_to_clipboard()
