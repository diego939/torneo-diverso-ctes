#!/bin/bash
# Script de instalación para Linux/Mac
# Dale permisos de ejecución: chmod +x setup.sh
# Ejecuta: ./setup.sh

echo "🚀 Configurando proyecto Copa Corrientes Diversa con Prisma..."

# 1. Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "📄 Creando archivo .env..."
    cp env.example.txt .env
    echo "✅ Archivo .env creado. Por favor, edítalo con tus credenciales de MySQL."
    echo "   Presiona Enter para continuar después de editar el .env..."
    read
else
    echo "✅ Archivo .env ya existe."
fi

# 2. Instalar dependencias
echo ""
echo "📦 Instalando dependencias..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias."
    exit 1
fi
echo "✅ Dependencias instaladas."

# 3. Generar cliente de Prisma
echo ""
echo "🔧 Generando cliente de Prisma..."
npm run prisma:generate
if [ $? -ne 0 ]; then
    echo "❌ Error al generar cliente de Prisma."
    exit 1
fi
echo "✅ Cliente de Prisma generado."

# 4. Ejecutar migraciones
echo ""
echo "🗄️  Ejecutando migraciones (db push)..."
npm run db:push
if [ $? -ne 0 ]; then
    echo "❌ Error al ejecutar migraciones. Verifica tu conexión a MySQL."
    echo "   ¿MySQL está corriendo?"
    echo "   ¿Las credenciales en .env son correctas?"
    echo "   ¿La base de datos 'copa_corrientes_diversa' existe?"
    exit 1
fi
echo "✅ Migraciones ejecutadas."

# 5. Ejecutar seed
echo ""
echo "🌱 Poblando base de datos con datos iniciales..."
npm run db:seed
if [ $? -ne 0 ]; then
    echo "❌ Error al ejecutar el seed."
    exit 1
fi
echo "✅ Base de datos poblada con éxito."

# Finalización
echo ""
echo "🎉 ¡Configuración completada con éxito!"
echo ""
echo "Comandos útiles:"
echo "  npm run dev              - Iniciar servidor de desarrollo"
echo "  npm run prisma:studio    - Abrir Prisma Studio (GUI)"
echo "  npm run db:seed          - Volver a poblar la BD"
echo ""
echo "🚀 Ejecuta 'npm run dev' para iniciar el proyecto."


