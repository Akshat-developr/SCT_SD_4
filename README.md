# Books to Scrape Product Extractor

A browser-based version of the Python scraper. It fetches the first page of Books to Scrape, extracts product names, prices, and ratings, displays them in a table, and downloads the results as `products.csv`.

## Files

- `index.html` — page structure
- `style.css` — styling
- `script.js` — fetching, parsing, display, and CSV download

## Run locally

Keep all three files in the same folder and open `index.html` in a browser. Select **Scrape products**, then **Download CSV**.

Browsers may block requests to another website due to cross-origin rules. If that happens, use a local server-side proxy to fetch the page. Browser JavaScript also cannot set the Python script’s `User-Agent` header.
