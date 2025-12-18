#!/bin/bash

# 테스트용 데이터베이스 설정 스크립트

echo "🔧 Setting up test database..."

# PostgreSQL 연결 확인
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL client not found. Please install PostgreSQL."
    exit 1
fi

# 데이터베이스 생성
echo "📦 Creating test database..."
createdb orderbean_test 2>/dev/null || echo "Database may already exist"

# 마이그레이션 실행
echo "🔄 Running migrations..."
cd "$(dirname "$0")/../.."
npm run migrate

# 테스트 데이터 시드
echo "🌱 Seeding test data..."
npm run seed:test

echo "✅ Test database setup complete!"

