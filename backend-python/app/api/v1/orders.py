"""
주문 API
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from typing import List
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()


class OrderItemRequest(BaseModel):
    menu_id: str
    quantity: int
    option_ids: List[str] = []


class CreateOrderRequest(BaseModel):
    store_id: str
    pickup_time: datetime
    items: List[OrderItemRequest]


@router.post("")
async def create_order(
    order_data: CreateOrderRequest,
    db: Session = Depends(get_db)
):
    """
    주문 생성
    
    - 주문 정보를 데이터베이스에 저장
    - 주문 정보에 따라 메뉴 목록의 재고도 수정
    """
    # TODO: 주문 생성 로직 구현
    return {
        "status": "success",
        "data": {
            "order": {
                "order_id": "order-12345",
                "user_id": "user-001",
                "store_id": order_data.store_id,
                "pickup_time": order_data.pickup_time.isoformat(),
                "status": "PENDING",
                "total_price": "8000.00",
                "created_at": datetime.now().isoformat(),
                "items": [
                    {
                        "order_item_id": "item-001",
                        "menu": {
                            "menu_id": item.menu_id,
                            "name": "에스프레소"
                        },
                        "quantity": item.quantity,
                        "options": [],
                        "unit_price": "4000.00",
                        "total_price": str(4000 * item.quantity)
                    }
                    for item in order_data.items
                ]
            }
        }
    }


@router.get("/{order_id}")
async def get_order(
    order_id: str,
    db: Session = Depends(get_db)
):
    """
    주문 조회
    
    - order_id: 주문 ID
    """
    # TODO: 데이터베이스에서 주문 조회 구현
    return {
        "status": "success",
        "data": {
            "order": {
                "order_id": order_id,
                "created_at": datetime.now().isoformat(),
                "status": "PENDING",
                "items": []
            }
        }
    }

