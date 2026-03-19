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

    table = soup.find("table")
    if not table:
        return notices

    rows = table.find_all("tr")[1:]  # skip header row

    for row in rows:
        cols = row.find_all("td")
        if len(cols) < 4:
            continue

        title = cols[1].get_text(strip=True)

        # "View Full Notice" link
        view_a = cols[3].find("a", href=True)
        if not view_a:
            continue

        detail_link = view_a["href"]
        detail_url = (
            detail_link if detail_link.startswith("http")
            else f"http://entrance.ioe.edu.np{detail_link}"
        )

        # STEP 2: open notice detail page
        try:
            detail_res = session.get(detail_url, headers=HEADERS, timeout=15)
            detail_res.raise_for_status()
        except Exception:
            continue

        detail_soup = BeautifulSoup(detail_res.text, "html.parser")

        # STEP 3: find PDF link
        pdf_a = detail_soup.find("a", href=True)
        if not pdf_a:
            continue

        pdf_link = pdf_a["href"]
        pdf_url = (
            pdf_link if pdf_link.startswith("http")
            else f"http://entrance.ioe.edu.np{pdf_link}"
        )

        # STEP 4: extract PDF content
        content = extract_notice_content(pdf_url, session)

        notices.append({
            "title": title,
            "link": pdf_url,
            "content": content,
            "source": "IOE",
            "published_at": datetime.utcnow()
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
