from fastapi import APIRouter, HTTPException
from schemas.entrance_news import EntranceNewsResponse
from db.entrance_news_repo import get_news, save_news
from services.scraper_service.scraper_service import scrape_ioe, scrape_iom
from services.scheduler_service.scheduler_service import start_scheduler

router = APIRouter(
    prefix="/api/entrance-news",
    tags=["Entrance News"]
)

start_scheduler()

@router.post("/scrape")
async def scrape_news():
    try:
        ioe_news = scrape_ioe()
        iom_news = scrape_iom()

        ioe_news = [{"exam": "IOE", **item} for item in ioe_news]
        iom_news = [{"exam": "IOM", **item} for item in iom_news]

        await save_news("IOE", ioe_news)
        await save_news("IOM", iom_news)

        return {
            "message": "Scraping completed and saved to DB",
            "result": {
                "IOE": len(ioe_news),
                "IOM": len(iom_news)
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/ioe", response_model=EntranceNewsResponse)
async def fetch_ioe_news():
    news = await get_news("IOE")
    return {"exam": "IOE", "news": news}


@router.get("/iom", response_model=EntranceNewsResponse)
async def fetch_iom_news():
    news = await get_news("IOM")
    return {"exam": "IOM", "news": news}
