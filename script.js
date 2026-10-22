"use strict";

const SOURCE_URL = "https://books.toscrape.com/";

const RATING_MAP = {
  One: 1,
  Two: 2,
  Three: 3,
  Four: 4,
  Five: 5
};

const scrapeButton = document.querySelector("#scrape-button");
const downloadButton = document.querySelector("#download-button");
const statusElement = document.querySelector("#status");
const productsBody = document.querySelector("#products-body");

let products = [];

function setStatus(message, state = "") {
  statusElement.textContent = message;

  if (state) {
    statusElement.dataset.state = state;
  } else {
    delete statusElement.dataset.state;
  }
}

function parseProducts(html) {
  const page = new DOMParser().parseFromString(html, "text/html");
  const productCards = page.querySelectorAll("article.product_pod");

  return [...productCards]
    .map((product) => {
      const name =
        product.querySelector("h3 a")?.getAttribute("title")?.trim() ?? "";

      const rawPrice =
        product.querySelector(".price_color")?.textContent?.trim() ?? "";

      const price = Number(rawPrice.replace(/[^0-9.]/g, ""));

      const ratingClass = [
        ...(product.querySelector(".star-rating")?.classList ?? [])
      ].find((className) => className !== "star-rating");

      const rating = RATING_MAP[ratingClass] ?? null;

      return { name, price, rating };
    })
    .filter((product) => product.name && Number.isFinite(product.price));
}

function renderProducts() {
  productsBody.replaceChildren();

  if (products.length === 0) {
    const row = document.createElement("tr");
    row.className = "empty";

    const cell = document.createElement("td");
    cell.colSpan = 3;
    cell.textContent = "No products were found on the page.";

    row.append(cell);
    productsBody.append(row);
    return;
  }

  for (const product of products) {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = product.name;

    const priceCell = document.createElement("td");
    priceCell.textContent = `£${product.price.toFixed(2)}`;

    const ratingCell = document.createElement("td");

    const stars = document.createElement("span");
    stars.className = "rating";
    stars.textContent =
      "★".repeat(product.rating ?? 0) +
      "☆".repeat(5 - (product.rating ?? 0));

    const numericRating = document.createElement("span");
    numericRating.className = "rating-number";
    numericRating.textContent =
      product.rating === null ? "—" : `${product.rating}/5`;

    ratingCell.append(stars, numericRating);
    row.append(nameCell, priceCell, ratingCell);
    productsBody.append(row);
  }
}

async function scrapeProducts() {
  scrapeButton.disabled = true;
  downloadButton.disabled = true;
  setStatus("Fetching the first catalog page…");

  try {
    const response = await fetch(SOURCE_URL);

    if (!response.ok) {
      throw new Error(`The website returned status ${response.status}.`);
    }

    products = parseProducts(await response.text());
    renderProducts();

    if (products.length === 0) {
      setStatus("The page loaded, but no product entries were found.", "error");
      return;
    }

    downloadButton.disabled = false;
    setStatus(
      `Successfully scraped ${products.length} products. Download the results as CSV.`,
      "success"
    );
  } catch (error) {
    const corsNote =
      error instanceof TypeError
        ? " The browser may be blocking this request because of the site's cross-origin policy; use a small local server/proxy to fetch the page if this happens."
        : "";

    setStatus(`Could not retrieve the catalog.${corsNote}`, "error");
  } finally {
    scrapeButton.disabled = false;
  }
}

function downloadCsv() {
  if (products.length === 0) {
    return;
  }

  const escapeCsv = (value) =>
    `"${String(value).replaceAll('"', '""')}"`;

  const rows = [
    ["Product Name", "Price (£)", "Rating (1-5)"],
    ...products.map((product) => [
      product.name,
      product.price.toFixed(2),
      product.rating ?? ""
    ])
  ];

  const csv = rows
    .map((row) => row.map(escapeCsv).join(","))
    .join("\r\n");

  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "products.csv";
  link.click();

  URL.revokeObjectURL(url);
}

scrapeButton.addEventListener("click", scrapeProducts);
downloadButton.addEventListener("click", downloadCsv);
