# Script de instalación para Windows PowerShell
# Ejecuta este script con: .\setup.ps1

Write-Host "🚀 Configurando proyecto Copa Corrientes Diversa con Prisma..." -ForegroundColor Cyan

# 1. Crear archivo .env si no existe
if (-not (Test-Path .env)) {
    Write-Host "📄 Creando archivo .env..." -ForegroundColor Yellow
    Copy-Item env.example.txt .env
    Write-Host "✅ Archivo .env creado. Por favor, edítalo con tus credenciales de MySQL." -ForegroundColor Green
    Write-Host "   Presiona Enter para continuar después de editar el .env..." -ForegroundColor Yellow
    Read-Host
} else {
    Write-Host "✅ Archivo .env ya existe." -ForegroundColor Green
}

# 2. Instalar dependencias
Write-Host "`n📦 Instalando dependencias..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al instalar dependencias." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencias instaladas." -ForegroundColor Green

# 3. Generar cliente de Prisma
Write-Host "`n🔧 Generando cliente de Prisma..." -ForegroundColor Yellow
npm run prisma:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al generar cliente de Prisma." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Cliente de Prisma generado." -ForegroundColor Green

# 4. Ejecutar migraciones
Write-Host "`n🗄️  Ejecutando migraciones (db push)..." -ForegroundColor Yellow
npm run db:push
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al ejecutar migraciones. Verifica tu conexión a MySQL." -ForegroundColor Red
    Write-Host "   ¿MySQL está corriendo?" -ForegroundColor Yellow
    Write-Host "   ¿Las credenciales en .env son correctas?" -ForegroundColor Yellow
    Write-Host "   ¿La base de datos 'copa_corrientes_diversa' existe?" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Migraciones ejecutadas." -ForegroundColor Green

# 5. Ejecutar seed
Write-Host "`n🌱 Poblando base de datos con datos iniciales..." -ForegroundColor Yellow
npm run db:seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al ejecutar el seed." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Base de datos poblada con éxito." -ForegroundColor Green

# Finalización
Write-Host "`n🎉 ¡Configuración completada con éxito!" -ForegroundColor Green
Write-Host "`nComandos útiles:" -ForegroundColor Cyan
Write-Host "  npm run dev              - Iniciar servidor de desarrollo" -ForegroundColor White
Write-Host "  npm run prisma:studio    - Abrir Prisma Studio (GUI)" -ForegroundColor White
Write-Host "  npm run db:seed          - Volver a poblar la BD" -ForegroundColor White
Write-Host "`n🚀 Ejecuta 'npm run dev' para iniciar el proyecto." -ForegroundColor Cyan


