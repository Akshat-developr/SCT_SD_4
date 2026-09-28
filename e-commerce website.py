import pandas as pd
import requests
from bs4 import BeautifulSoup

URL = "https://books.toscrape.com/"
headers = {"User-Agent": "Mozilla/5.0"}

# Mapping word-based CSS classes to numerical ratings
RATING_MAP = {
    "One": 1,
    "Two": 2,
    "Three": 3,
    "Four": 4,
    "Five": 5,
}

response = requests.get(URL, headers=headers)

if response.status_code != 200:
    print(f"Failed to retrieve webpage. Status code: {response.status_code}")
    exit()

soup = BeautifulSoup(response.text, "html.parser")
products = soup.find_all("article", class_="product_pod")

data = []

for product in products:
    name = product.h3.a["title"]
    
    # Strip currency symbols and whitespace, keeping only the float
    raw_price = product.find("p", class_="price_color").text.strip()
    price = float(raw_price.replace("£", "").replace("Â", ""))

    # Extract the second class name for rating (e.g., "star-rating Three" -> "Three")
    rating_class = product.find("p", class_="star-rating")["class"][1]
    rating = RATING_MAP.get(rating_class, None)

    data.append({
        "Product Name": name,
        "Price (£)": price,
        "Rating (1-5)": rating,
    })

df = pd.DataFrame(data)

# Save to CSV
df.to_csv("products.csv", index=False)

print("Data scraped successfully!")
print(df.head())
