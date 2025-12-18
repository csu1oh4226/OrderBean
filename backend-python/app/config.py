"""
애플리케이션 설정
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # 애플리케이션
    APP_NAME: str = "OrderBean"
    DEBUG: bool = False
    
    # 서버
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # 데이터베이스
    DATABASE_URL: str = "postgresql://postgres:1234@localhost:5432/orderbean"
    
    # JWT
    JWT_SECRET: str = "your-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRES_IN: int = 86400  # 24시간
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3001",
        "http://localhost:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3000"
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

