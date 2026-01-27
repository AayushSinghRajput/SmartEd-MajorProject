# -----------------------------
# Scheduler: Run scraping job nightly
# -----------------------------

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from services.scraper_service.scraper_service import scrape_ioe, scrape_iom
import asyncio

scheduler = AsyncIOScheduler(timezone="Asia/Kathmandu")

# -----------------------------
# Function to scrape both IOE & IOM news
# -----------------------------
async def scheduled_scrape():
    try:
        ioe_news = scrape_ioe()
        iom_news = scrape_iom()
        print("Nightly scrape completed ✅")
        print("IOE:", len(ioe_news), "IOM:", len(iom_news))
    except Exception as e:
        print("Nightly scrape failed ❌", str(e))


# -----------------------------
# Start scheduler: runs every midnight
# -----------------------------
def start_scheduler():
    scheduler.add_job(
        lambda: asyncio.create_task(scheduled_scrape()),  # run async function safely
        trigger="cron",
        hour=0,
        minute=0
    )
    scheduler.start()
    print("Scheduler started ⏰, scraping every midnight")
