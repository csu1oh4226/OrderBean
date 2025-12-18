# 데이터베이스 생성 후 실행할 스크립트

Write-Host "🚀 데이터베이스 생성 후 설정 진행..." -ForegroundColor Cyan
Write-Host ""

# 현재 디렉토리 확인
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath\..\..

Write-Host "1️⃣ 환경 변수 확인..." -ForegroundColor Yellow
$envFile = ".env.test"
if (Test-Path $envFile) {
    Write-Host "   ✅ .env.test 파일 존재" -ForegroundColor Green
    $envContent = Get-Content $envFile -Raw
    if ($envContent -match "DATABASE_URL") {
        Write-Host "   ✅ DATABASE_URL 설정됨" -ForegroundColor Green
        Write-Host "   ⚠️  비밀번호가 올바른지 확인하세요!" -ForegroundColor Yellow
    } else {
        Write-Host "   ⚠️  DATABASE_URL이 설정되지 않았습니다" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠️  .env.test 파일이 없습니다" -ForegroundColor Yellow
    Write-Host "   💡 기본 DATABASE_URL을 사용합니다" -ForegroundColor Cyan
    $env:DATABASE_URL = "postgresql://postgres:YOUR_PASSWORD@localhost:5432/orderbean_test"
    Write-Host "   ⚠️  YOUR_PASSWORD를 실제 비밀번호로 변경하세요!" -ForegroundColor Red
}

Write-Host ""
Write-Host "2️⃣ Prisma 마이그레이션 실행..." -ForegroundColor Yellow
Write-Host "   (이 단계는 몇 분 걸릴 수 있습니다)" -ForegroundColor Gray

try {
    & npm.cmd run migrate 2>&1 | Tee-Object -Variable migrateOutput
    
    if ($LASTEXITCODE -eq 0 -or $migrateOutput -match "already applied" -or $migrateOutput -match "Your database is now in sync") {
        Write-Host "   ✅ 마이그레이션 완료" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  마이그레이션에 문제가 있을 수 있습니다" -ForegroundColor Yellow
        Write-Host "   💡 에러 메시지를 확인하세요" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   ❌ 마이그레이션 실패" -ForegroundColor Red
    Write-Host "   에러: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "   💡 다음을 확인하세요:" -ForegroundColor Yellow
    Write-Host "      1. DATABASE_URL이 올바른지 확인" -ForegroundColor White
    Write-Host "      2. PostgreSQL 서비스가 실행 중인지 확인" -ForegroundColor White
    Write-Host "      3. 비밀번호가 올바른지 확인" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "3️⃣ 테스트 데이터 생성..." -ForegroundColor Yellow

try {
    & npm.cmd run seed:test 2>&1 | Tee-Object -Variable seedOutput
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ 테스트 데이터 생성 완료" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  테스트 데이터 생성에 문제가 있을 수 있습니다" -ForegroundColor Yellow
        Write-Host "   💡 에러 메시지를 확인하세요" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   ❌ 테스트 데이터 생성 실패" -ForegroundColor Red
    Write-Host "   에러: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "   💡 마이그레이션이 성공했는지 확인하세요" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "4️⃣ 테스트 실행 준비 완료!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 다음 명령어로 테스트를 실행하세요:" -ForegroundColor Cyan
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   npm test" -ForegroundColor White
Write-Host ""

