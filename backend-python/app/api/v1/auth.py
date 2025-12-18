"""
인증 API
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


@router.post("/register")
async def register():
    """회원가입 (향후 구현)"""
    return {"message": "Register endpoint - to be implemented"}


@router.post("/login")
async def login():
    """로그인 (향후 구현)"""
    return {"message": "Login endpoint - to be implemented"}


@router.get("/me")
async def get_current_user():
    """현재 사용자 정보 (향후 구현)"""
    return {"message": "Get current user endpoint - to be implemented"}

