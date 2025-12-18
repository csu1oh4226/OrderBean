# Windows용 테스트 데이터베이스 설정 스크립트

Write-Host "🔧 Setting up test database for OrderBean..." -ForegroundColor Cyan
Write-Host ""

# PostgreSQL 설치 확인
Write-Host "1️⃣ Checking PostgreSQL installation..." -ForegroundColor Yellow
try {
    $pgVersion = & psql --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ PostgreSQL found: $pgVersion" -ForegroundColor Green
    } else {
        throw "PostgreSQL not found"
    }
} catch {
    Write-Host "   ❌ PostgreSQL not found in PATH" -ForegroundColor Red
    Write-Host "   💡 Please add PostgreSQL bin directory to PATH" -ForegroundColor Yellow
    Write-Host "   💡 Or use full path: C:\Program Files\PostgreSQL\*\bin\psql.exe" -ForegroundColor Yellow
    exit 1
}

# PostgreSQL 서비스 확인
Write-Host ""
Write-Host "2️⃣ Checking PostgreSQL service..." -ForegroundColor Yellow
$pgService = Get-Service | Where-Object {$_.Name -like "*postgresql*"} | Select-Object -First 1
if ($pgService) {
    if ($pgService.Status -eq 'Running') {
        Write-Host "   ✅ PostgreSQL service is running" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  PostgreSQL service is not running. Starting..." -ForegroundColor Yellow
        Start-Service $pgService.Name
        Start-Sleep -Seconds 3
    }
} else {
    Write-Host "   ⚠️  PostgreSQL service not found. Please check installation." -ForegroundColor Yellow
}

# 데이터베이스 생성
Write-Host ""
Write-Host "3️⃣ Creating test database..." -ForegroundColor Yellow

# 환경 변수 설정
$env:PGPASSWORD = "postgres"  # 기본 postgres 사용자 비밀번호 (설치 시 설정한 값)

# 데이터베이스 생성 시도
$createDbScript = @"
CREATE DATABASE orderbean_test;
"@

try {
    # postgres 사용자로 데이터베이스 생성
    $createDbScript | & psql -U postgres -h localhost 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Database 'orderbean_test' created" -ForegroundColor Green
    } else {
        # 이미 존재할 수 있음
        Write-Host "   ⚠️  Database may already exist (this is OK)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️  Could not create database automatically" -ForegroundColor Yellow
    Write-Host "   💡 Please create manually:" -ForegroundColor Yellow
    Write-Host "      psql -U postgres" -ForegroundColor Cyan
    Write-Host "      CREATE DATABASE orderbean_test;" -ForegroundColor Cyan
    Write-Host "      \q" -ForegroundColor Cyan
}

# 사용자 생성 (선택적)
Write-Host ""
Write-Host "4️⃣ Creating database user (optional)..." -ForegroundColor Yellow
$createUserScript = @"
DO `$`$`$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'orderbean') THEN
      CREATE USER orderbean WITH PASSWORD 'orderbean';
   END IF;
END
`$`$`$;
GRANT ALL PRIVILEGES ON DATABASE orderbean_test TO orderbean;
"@

try {
    $createUserScript | & psql -U postgres -h localhost -d postgres 2>&1 | Out-Null
    Write-Host "   ✅ User 'orderbean' created (or already exists)" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  User creation skipped (using default postgres user)" -ForegroundColor Yellow
}

# 마이그레이션 실행
Write-Host ""
Write-Host "5️⃣ Running Prisma migrations..." -ForegroundColor Yellow
Set-Location $PSScriptRoot\..\..
$env:DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/orderbean_test"

try {
    & npm.cmd run migrate 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Migrations completed" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Migration may have issues. Please check manually." -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Migration failed" -ForegroundColor Red
    Write-Host "   💡 Please run manually: npm run migrate" -ForegroundColor Yellow
}

# 테스트 데이터 시드
Write-Host ""
Write-Host "6️⃣ Seeding test data..." -ForegroundColor Yellow
try {
    & npm.cmd run seed:test 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Test data seeded" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Seeding may have issues. Please check manually." -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Seeding failed" -ForegroundColor Red
    Write-Host "   💡 Please run manually: npm run seed:test" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Test database setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Update DATABASE_URL in backend/.env.test if needed" -ForegroundColor White
Write-Host "   2. Run tests: cd backend && npm test" -ForegroundColor White
Write-Host ""

