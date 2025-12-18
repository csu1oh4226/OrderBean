"""
OrderBean FastAPI Backend Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.v1 import auth, stores, orders, admin

app = FastAPI(
    title="OrderBean API",
    description="OrderBean 커피 주문 서비스 백엔드 API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API 라우터 등록
app.include_router(auth.router, prefix="/api/v1/auth", tags=["인증"])
app.include_router(stores.router, prefix="/api/v1/stores", tags=["매장"])
app.include_router(orders.router, prefix="/api/v1/orders", tags=["주문"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["관리자"])


@app.get("/")
async def root():
    """헬스 체크 엔드포인트"""
    return {
        "status": "ok",
        "message": "OrderBean API Server",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """상세 헬스 체크"""
    return {
        "status": "healthy",
        "service": "OrderBean Backend",
        "version": "1.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

