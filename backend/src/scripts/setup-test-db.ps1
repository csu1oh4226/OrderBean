# 테스트용 데이터베이스 설정 스크립트 (PowerShell)

Write-Host "🔧 Setting up test database..." -ForegroundColor Cyan

# PostgreSQL 연결 확인
try {
    $pgVersion = psql --version
    Write-Host "✅ PostgreSQL found: $pgVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ PostgreSQL not found. Please install PostgreSQL or use Docker." -ForegroundColor Red
    Write-Host "   You can use Docker: docker-compose up -d postgres" -ForegroundColor Yellow
    exit 1
}

# 데이터베이스 생성
Write-Host "📦 Creating test database..." -ForegroundColor Cyan
$env:PGPASSWORD = "orderbean"
psql -U orderbean -h localhost -c "CREATE DATABASE orderbean_test;" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Database may already exist or connection failed" -ForegroundColor Yellow
}

# 마이그레이션 실행
Write-Host "🔄 Running migrations..." -ForegroundColor Cyan
Set-Location $PSScriptRoot\..\..
npm run migrate

# 테스트 데이터 시드
Write-Host "🌱 Seeding test data..." -ForegroundColor Cyan
npm run seed:test

Write-Host "✅ Test database setup complete!" -ForegroundColor Green

