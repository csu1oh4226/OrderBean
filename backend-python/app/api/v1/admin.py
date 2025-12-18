"""
관리자 API
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter()


@router.get("/orders")
async def get_orders(
    status: str = None,
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """관리자용 주문 목록 조회 (향후 구현)"""
    return {"message": "Admin orders endpoint - to be implemented"}


@router.patch("/orders/{order_id}/status")
async def update_order_status(
    order_id: str,
    new_status: str,
    db: Session = Depends(get_db)
):
    """주문 상태 변경 (향후 구현)"""
    return {"message": "Update order status endpoint - to be implemented"}

