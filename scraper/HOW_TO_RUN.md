# TikTok Comment Scraper & JSON Converter

This tool lets you scrape comments from a TikTok post and save them as a JSON file. It works for top-level comments and replies, and also collects information like nickname, username, profile picture, post likes, shares, description, and publish time.

## Requirements

- Python 3.8 or higher
- Chromium-based browser (preferably Chrome)
- Dependencies listed in `requirements.txt`

## How to Use

1. **Navigate to TikTok Post**
   - Open your browser and go to the TikTok post you want to scrape
   - Make sure you can scroll the comments manually

2. **Copy JavaScript Scraper**
   - Run `python copy_scraper_js.py` to copy the JavaScript scraper to your clipboard
   - If successful, it will print "Copied to clipboard"
   - Alternatively, you can manually copy the `tiktok_comment_scraper.js` script

3. **Run Scraper in Browser**
   - Open Chrome developer console (F12)
   - Paste the JavaScript and press Enter
   - Wait until you see "JSON copied to clipboard!"
   - This means all comments have been scraped

4. **Save Scraped Data**
   - Run `python tiktok_comments_to_json.py`
   - The script reads the JSON from your clipboard, validates it, and saves it to the `raw_data/` folder
   - Each file is saved with a unique UUID filename

5. **Requirements**
   - A TikTok account is recommended (scraper may not work consistently without one)
   - Tutorial video: <https://youtu.be/4TnphReNS4k>

## Limitations

1. **Performance**
   - Tested on posts with up to 3000 comments on a mid-tier laptop
   - May experience lag during comment loading for large posts

2. **Comment Count Discrepancy**
   - TikTok sometimes doesn't show the correct number of comments
   - Example: Post shows 750 comments, but only 740 load
   - In testing with 3000 comments, 64 comments were not loaded

## Project Structure

```text
scraper/
├── copy_scraper_js.py           # Copies scraper JS to clipboard
├── tiktok_comment_scraper.js    # Browser console scraper script
├── tiktok_comments_to_json.py   # Saves clipboard JSON to file
├── raw_data/                    # Folder where JSON files are saved
│   └── *.json                   # UUID-named JSON files
└── HOW_TO_RUN.md                # This file
```

## Last Tested

- **Date**: December 22, 2024
- **Browser**: Chrome v143.0.7499.148
- **Device**: M2 Air
- **Python**: 3.12

## Credits

This project is based on work by <https://github.com/cubernetes/>, with credit to the original author.
