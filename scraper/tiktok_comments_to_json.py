#!/usr/bin/env python3
"""
TikTok Comments JSON Saver.

Reads TikTok comment data (in JSON format) from clipboard and saves it to
a uniquely named JSON file in the raw_data directory.

Usage:
    1. Run the TikTok comment scraper JavaScript in browser console
    2. Copy the resulting JSON output
    3. Run this script to save the data
"""

import json
import uuid
from pathlib import Path
from pyperclip import paste, PyperclipException


def save_tiktok_json():
    """Read JSON from clipboard and save to raw_data directory."""
    # Setup directories
    base_dir = Path(__file__).parent
    raw_data_dir = base_dir / "raw_data"
    raw_data_dir.mkdir(exist_ok=True)

    # Generate unique file path
    json_file_path = raw_data_dir / f"{uuid.uuid4()}.json"

    # Read JSON from clipboard
    try:
        json_data = paste()
    except PyperclipException:
        print("[!] Clipboard not available. Paste JSON manually (end with empty line):")
        json_data = "\n".join(iter(input, ""))

    # Validate JSON format
    try:
        data = json.loads(json_data)
    except json.JSONDecodeError as e:
        print(f"[!] Error: Clipboard content is not valid JSON.\n{e}")
        exit(1)

    # Save to file
    with open(json_file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    print(f"[SUCCESS] JSON saved successfully:\n{json_file_path}")


if __name__ == "__main__":
    save_tiktok_json()
