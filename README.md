# E-commerce Product Web Scraper

A Python-based web scraping application that extracts product information from an online e-commerce website and stores the collected data in a structured CSV file. The program automatically retrieves product details such as names, prices, and ratings, making it easy to analyze or organize product information.

This project was created for **SkillCraft Technology — Software Development Internship, Task 04**.

Features

* Scrapes product names from an e-commerce website
* Extracts product prices and ratings
* Collects data from multiple product listings
* Stores the extracted data in a CSV file
* Handles missing or unavailable product information gracefully
* Uses HTML parsing for accurate data extraction
* Simple and easy-to-understand Python implementation

Technologies Used

* Python
* Requests
* BeautifulSoup (bs4)
* Pandas
* CSV

 How to Run

1. Clone this repository.
2. Open the project folder in VS Code.
3. Install the required libraries:

```bash
pip install requests beautifulsoup4 pandas
```

4. Run the following command in the terminal:

```bash
python3 ecommerce_scraper.py
```
 How It Works

1. Enter the target e-commerce website URL (or use the predefined URL in the script).
2. The program sends an HTTP request to the webpage.
3. It extracts product names, prices, and ratings using BeautifulSoup.
4. The collected data is organized into a structured format.
5. The final dataset is saved as a CSV file for further analysis.

 Project Structure

```text
SCT_SD_4/
├── ecommerce_scraper.py
├── products.csv
├── README.md
└── .gitignore
```
