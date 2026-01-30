import requests
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from datetime import datetime
from utils.extract_notice_content import extract_notice_content


# -------------------------
# Common Headers
# -------------------------
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

# -------------------------
# Requests Session with Retry
# -------------------------
def get_session():
    session = requests.Session()
    retries = Retry(
        total=3,
        backoff_factor=2,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET"],
    )
    adapter = HTTPAdapter(max_retries=retries)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    return session

# -------------------------
# Scrape IOE Notices
# -------------------------
def scrape_ioe():
    url = "http://entrance.ioe.edu.np/Notice"
    session = get_session()

    res = session.get(url, headers=HEADERS, timeout=15)
    res.raise_for_status()

    soup = BeautifulSoup(res.text, "html.parser")
    notices = []

    for a in soup.find_all("a", href=True):
        title = a.get_text(strip=True)
        if title and "notice" in title.lower():
            link = a["href"]
            full_link = link if link.startswith("http") else f"http://entrance.ioe.edu.np{link}"
            notices.append({"title": title, "link": full_link})
            content = extract_notice_content(full_link,session)
            notices.append({
                "title": title,
                "link": full_link,
                "content": content,
                "source": "IOE",
                "published_at":datetime.utcnow()
            })

    return notices

# -------------------------
# Scrape IOM Notices (FIXED)
# -------------------------
def scrape_iom():
    session = get_session()
    urls = [
        "http://iom.edu.np/notices/",   # HTTP works better
        "https://iom.edu.np/notices/"  # fallback
    ]

    for url in urls:
        try:
            res = session.get(
                url,
                headers=HEADERS,
                timeout=20,
                verify=False  # important for iom.edu.np
            )
            res.raise_for_status()

            soup = BeautifulSoup(res.text, "html.parser")
            notices = []

            for a in soup.find_all("a", href=True):
                title = a.get_text(strip=True)
                link = a["href"]

                if title and "/notices/" in link:
                    full_link = link if link.startswith("http") else f"{url.rstrip('/')}{link}"
                    notices.append({"title": title, "link": full_link})
                    content = extract_notice_content(full_link,session)
                    notices.append({
                        "title": title,
                        "link": full_link,
                        "content": content,
                        "source": "IOM",
                        "published_at":datetime.utcnow()
                    })


            return notices

        except requests.RequestException:
            continue

    # If both fail
    return []

# -------------------------
# Scrape All Notices
# -------------------------
def scrape_all_news():
    return {
        "IOE": scrape_ioe(),
        "IOM": scrape_iom(),
    }
