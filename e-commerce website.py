import requests
from bs4 import BeautifulSoup
import pandas as pd

# Demo e-commerce website for scraping practice
def xyz()
URL = "https://books.toscrape.com/"

headers = {
    "User-Agent": "Mozilla/5.0"
}

response = requests.get(URL, headers=headers)

if response.status_code != 200:
    print("Failed to retrieve webpage.")
    exit()

soup = BeautifulSoup(response.text, "html.parser")

products = soup.find_all("article", class_="product_pod")

data = []

for product in products:
   
    name = product.h3.a["title"]

    
    price = product.find("p", class_="price_color").text.strip()

  
    rating = product.find("p", class_="star-rating")["class"][1]

    data.append({
        "Product Name": name,
        "Price": price,
        "Rating": rating
    })


df = pd.DataFrame(data)

# Save to CSV
df.to_csv("products.csv", index=False)

print("Data scraped successfully!")
print(df.head())
