"""
매장 API
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter()


@router.get("/{store_id}/menus")
async def get_store_menus(
    store_id: str,
    status: str = "AVAILABLE",
    db: Session = Depends(get_db)
):
    """
    매장 메뉴 목록 조회
    
    - store_id: 매장 ID
    - status: 메뉴 상태 필터 (AVAILABLE, SOLD_OUT, ALL)
    """
    # TODO: 데이터베이스에서 메뉴 조회 구현
    return {
        "status": "success",
        "data": {
            "store": {
                "store_id": store_id,
                "name": "OrderBean 강남점"
            },
            "menus": [
                {
                    "menu_id": "menu-001",
                    "name": "에스프레소",
                    "description": "진한 에스프레소",
                    "price": "3500.00",
                    "image_url": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04",
                    "status": "AVAILABLE",
                    "options": []
                }
            ]
        }
    }

