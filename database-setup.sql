-- Script SQL para configurar la base de datos manualmente
-- Ejecuta este archivo si prefieres crear la BD desde SQL directamente

-- 1. Crear la base de datos
CREATE DATABASE IF NOT EXISTS copa_ctes 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 2. Usar la base de datos
USE copa_ctes;

-- 3. Verificar que está seleccionada
SELECT DATABASE();

-- 4. Crear usuario (opcional, para mayor seguridad)
-- Descomenta las siguientes líneas si quieres un usuario dedicado
/*
CREATE USER IF NOT EXISTS 'copa_user'@'localhost' IDENTIFIED BY 'tu_password_seguro';
GRANT ALL PRIVILEGES ON copa_corrientes_diversa.* TO 'copa_user'@'localhost';
FLUSH PRIVILEGES;
*/

-- 5. Mostrar tablas (después de ejecutar prisma db push)
-- SHOW TABLES;

-- 6. Ver estructura de una tabla (ejemplo)
-- DESCRIBE deportes;

-- 7. Consultas útiles para verificar datos después del seed
-- SELECT COUNT(*) as total_deportes FROM deportes;
-- SELECT COUNT(*) as total_sponsors FROM sponsors;
-- SELECT nombre FROM deportes ORDER BY nombre;

-- 8. Si necesitas eliminar y recrear (⚠️ CUIDADO - borra todo)
/*
DROP DATABASE IF EXISTS copa_corrientes_diversa;
CREATE DATABASE copa_corrientes_diversa 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
*/

-- NOTAS:
-- - Después de crear la base de datos, ejecuta: npm run db:push
-- - Para poblar con datos: npm run db:seed
-- - Para ver los datos visualmente: npm run prisma:studio

