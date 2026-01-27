import requests
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": "Mozilla/5.0"
}

# -------------------------
# Scrape IOE Notices
# -------------------------
def scrape_ioe():
    url = "http://entrance.ioe.edu.np/Notice"
    res = requests.get(url, headers=HEADERS, timeout=15)
    res.raise_for_status()

    soup = BeautifulSoup(res.text, "html.parser")
    notices = []

    # Each notice is inside <a> tag
    for a in soup.select("a"):
        title = a.get_text(strip=True)
        link = a.get("href")

        if title and link and "Notice" in title:
            # Full absolute URL
            full_link = link if link.startswith("http") else f"http://entrance.ioe.edu.np{link}"
            # Clean title
            clean_title = title.replace("\r\n", " ").strip()
            notices.append({
                "title": clean_title,
                "link": full_link
            })

    return notices


# -------------------------
# Scrape IOM Notices
# -------------------------
def scrape_iom():
    url = "https://iom.edu.np/notices/"
    res = requests.get(url, headers=HEADERS, timeout=15)
    res.raise_for_status()

    soup = BeautifulSoup(res.text, "html.parser")
    notices = []

    # IOM notices are inside ul > li > a
    for a in soup.select("ul li a"):
        title = a.get_text(strip=True)
        link = a.get("href")
        if title and link:
            # Full absolute URL if needed
            full_link = link if link.startswith("http") else f"https://iom.edu.np{link}"
            notices.append({
                "title": title,
                "link": full_link
            })

    return notices


# -------------------------
# Scrape all notices
# -------------------------
def scrape_all_news():
    """
    Returns all notices from IOE and IOM
    """
    return {
        "IOE": scrape_ioe(),
        "IOM": scrape_iom()
    }
