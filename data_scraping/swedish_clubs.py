import csv
import time
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup


BASE = "https://sv.wikipedia.org"
START_URL = "https://sv.wikipedia.org/wiki/Kategori:Handbollsklubbar_i_Sverige"
NATION_ID = "4d5e2a20-3595-4912-89ef-400020c55213"


def fetch_soup(url: str) -> BeautifulSoup:
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; ClubScraper/1.0; +https://example.com)"
    }
    r = requests.get(url, headers=headers, timeout=30)
    r.raise_for_status()
    return BeautifulSoup(r.text, "html.parser")


def scrape_club_names(start_url: str, delay_s: float = 0.5) -> list[str]:
    """
    Scrape all member page titles (club names) from a Wikipedia category page,
    following pagination ("Nästa sida") until exhausted.
    """
    names: list[str] = []
    seen = set()

    url = start_url
    while True:
        soup = fetch_soup(url)

        mw_pages = soup.select_one("#mw-pages")
        if not mw_pages:
            raise RuntimeError("Could not find #mw-pages. Wikipedia layout may have changed.")

        # Member links live in .mw-category-group a
        for a in mw_pages.select(".mw-category-group a"):
            name = a.get_text(strip=True)
            if name and name not in seen:
                seen.add(name)
                names.append(name)

        # Find pagination link with visible text "Nästa sida"
        next_link = None
        for a in mw_pages.select("a"):
            if a.get_text(strip=True).lower() == "nästa sida":
                next_link = a
                break

        if not next_link or not next_link.get("href"):
            break

        url = urljoin(BASE, next_link["href"])
        time.sleep(delay_s)

    return names


def write_csv(names: list[str], out_file: str) -> None:
    with open(out_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["name", "nation_id"])
        writer.writeheader()
        for name in names:
            writer.writerow({"name": name, "nation_id": NATION_ID})


def main():
    names = scrape_club_names(START_URL, delay_s=0.5)
    print(f"Found {len(names)} club names.")
    write_csv(names, "handbollsklubbar_sverige.csv")
    print("Saved: handbollsklubbar_sverige.csv")


if __name__ == "__main__":
    main()
