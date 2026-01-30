from bs4 import BeautifulSoup


# -------------------------
# Headers
# -------------------------
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
}

# -------------------------
# Helper: Extract full notice text
# -------------------------
def extract_notice_content(url, session):
    try:
        res = session.get(url, headers=HEADERS, timeout=20, verify=False)
        res.raise_for_status()

        soup = BeautifulSoup(res.text, "html.parser")

        # fallback-safe: collect all readable text
        content = soup.get_text(separator="\n", strip=True)
        return content[:5000]  # limit size for DB safety

    except Exception:
        return ""