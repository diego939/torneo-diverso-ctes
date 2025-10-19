# ✅ Checklist de Instalación - Prisma + MySQL

## 📋 Pre-requisitos

- [ ] Node.js instalado (v18 o superior)
- [ ] MySQL instalado y corriendo
- [ ] Git instalado (opcional)
- [ ] Editor de código (VSCode recomendado)

## 🚀 Pasos de Instalación

### 1. Preparación del Proyecto

- [ ] Clonar o abrir el proyecto
- [ ] Abrir terminal en la raíz del proyecto

### 2. Configuración de MySQL

- [ ] Verificar que MySQL esté corriendo

  ```bash
  # Windows (PowerShell como admin)
  Get-Service MySQL* | Select Status,Name,DisplayName

  # Mac
  brew services list | grep mysql

  # Linux
  sudo systemctl status mysql
  ```

- [ ] Conectarse a MySQL

  ```bash
  mysql -u root -p
  ```

- [ ] Crear la base de datos

  ```sql
  CREATE DATABASE copa_corrientes_diversa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  ```

- [ ] Verificar que se creó
  ```sql
  SHOW DATABASES;
  EXIT;
  ```

### 3. Configuración del Proyecto

- [ ] Instalar dependencias

  ```bash
  npm install
  ```

- [ ] Crear archivo `.env`

  ```bash
  # Windows
  Copy-Item env.example.txt .env

  # Mac/Linux
  cp env.example.txt .env
  ```

- [ ] Editar `.env` con tus credenciales
  ```env
  DATABASE_URL="mysql://root:TU_PASSWORD@localhost:3306/copa_corrientes_diversa"
  ```
  **Nota:** Si root no tiene password, usa: `mysql://root:@localhost:3306/...`

### 4. Configuración de Prisma

- [ ] Generar el cliente de Prisma

  ```bash
  npm run prisma:generate
  ```

  Deberías ver: `✔ Generated Prisma Client`

- [ ] Sincronizar el schema con la base de datos
  ```bash
  npm run db:push
  ```
  Deberías ver mensajes confirmando la creación de tablas

### 5. Poblar con Datos Iniciales

- [ ] Ejecutar el seeder
  ```bash
  npm run db:seed
  ```
  Deberías ver:
  ```
  🌱 Iniciando seeding...
  👤 Creando organizador...
  ✅ Organizador creado: Fundación Corrientes Diversa
  🏆 Creando torneo...
  ✅ Torneo creado: Copa Corrientes Diversa 2024
  🎨 Creando banners...
  ⚽ Creando deportes...
  💼 Creando sponsors...
  🔐 Creando usuario de ejemplo...
  🎉 Seeding completado exitosamente!
  ```

### 6. Verificación

- [ ] Abrir Prisma Studio

  ```bash
  npm run prisma:studio
  ```

  Deberías poder abrir http://localhost:5555

- [ ] En Prisma Studio, verifica que existan datos en:
  - [ ] `organizadores` (1 registro)
  - [ ] `torneos` (1 registro)
  - [ ] `banners` (1 registro con múltiples imágenes)
  - [ ] `deportes` (11 registros)
  - [ ] `sponsors` (7 registros)
  - [ ] `usuarios` (1 registro)

### 7. Iniciar el Proyecto

- [ ] Cerrar Prisma Studio (Ctrl+C en terminal)
- [ ] Iniciar el servidor de desarrollo

  ```bash
  npm run dev
  ```

- [ ] Abrir el navegador en la URL mostrada (usualmente http://localhost:5173)

## 🎯 Verificación Final

### Pruebas Básicas

- [ ] La página principal carga correctamente
- [ ] La página de deportes muestra información (si está implementada)
- [ ] No hay errores en la consola del navegador
- [ ] No hay errores en la terminal del servidor

### Prueba de API (opcional)

- [ ] Abrir en navegador o Postman:
  ```
  http://localhost:5173/api/deportes
  ```
  Deberías ver un JSON con todos los deportes

### Prueba de Base de Datos

- [ ] Conectarse a MySQL y verificar:
  ```bash
  mysql -u root -p
  USE copa_corrientes_diversa;
  SHOW TABLES;
  SELECT COUNT(*) FROM deportes;
  SELECT nombre FROM deportes;
  EXIT;
  ```

## 🆘 Solución de Problemas

### ❌ Error: "Can't connect to MySQL server"

**Problema:** MySQL no está corriendo o las credenciales son incorrectas.

**Solución:**

1. [ ] Verifica que MySQL esté iniciado
2. [ ] Revisa el `.env` (usuario, password, puerto)
3. [ ] Prueba conectarte manualmente: `mysql -u root -p`

### ❌ Error: "Unknown database 'copa_corrientes_diversa'"

**Problema:** La base de datos no existe.

**Solución:**

1. [ ] Conéctate a MySQL
2. [ ] Ejecuta: `CREATE DATABASE copa_corrientes_diversa;`
3. [ ] Vuelve a ejecutar `npm run db:push`

### ❌ Error: "Cannot find module '@prisma/client'"

**Problema:** El cliente de Prisma no se generó.

**Solución:**

1. [ ] Ejecuta: `npm run prisma:generate`
2. [ ] Si persiste: `npm install @prisma/client`

### ❌ Error en el seed: "Foreign key constraint fails"

**Problema:** Las tablas no existen o están corruptas.

**Solución:**

1. [ ] Ejecuta: `npx prisma migrate reset` (⚠️ borra todo)
2. [ ] Luego: `npm run db:push`
3. [ ] Finalmente: `npm run db:seed`

### ❌ Prisma Studio no abre

**Problema:** Puerto 5555 ocupado.

**Solución:**

1. [ ] Cierra otras instancias de Prisma Studio
2. [ ] O usa otro puerto: `npx prisma studio --port 5556`

### ❌ Error: "tsx: command not found"

**Problema:** tsx no está instalado.

**Solución:**

1. [ ] Ejecuta: `npm install tsx -D`
2. [ ] Vuelve a intentar: `npm run db:seed`

## 📝 Notas Importantes

### Seguridad

- [ ] **NUNCA** subas el archivo `.env` a Git
- [ ] El archivo `.gitignore` ya está configurado para ignorar `.env`
- [ ] Cambia la contraseña del usuario de ejemplo antes de producción

### Desarrollo

- [ ] Usa `npm run prisma:studio` para ver/editar datos visualmente
- [ ] Usa `npm run db:seed` cada vez que necesites resetear los datos
- [ ] Revisa los archivos de ejemplo en `src/routes/` para ver cómo usar Prisma

### Producción

- [ ] Usa variables de entorno seguras
- [ ] Implementa hash de contraseñas (bcrypt)
- [ ] Configura conexión SSL a MySQL si es remoto
- [ ] Usa `npm run prisma:migrate:deploy` en lugar de `db:push`

## 🎓 Recursos de Ayuda

- [ ] Lee `INSTRUCCIONES-INSTALACION.md` para más detalles
- [ ] Consulta `EJEMPLOS-USO-PRISMA.md` para ejemplos de código
- [ ] Revisa `README-PRISMA.md` para referencia completa
- [ ] Visita la [documentación oficial de Prisma](https://www.prisma.io/docs)

## 🎉 ¡Instalación Completa!

Si todos los checks están marcados, ¡felicitaciones! 🎊

Tu proyecto ahora tiene:

- ✅ Base de datos MySQL configurada y poblada
- ✅ Prisma ORM funcionando
- ✅ Cliente de Prisma generado
- ✅ APIs de ejemplo creadas
- ✅ Datos iniciales cargados

**Siguiente paso:** Empieza a desarrollar usando los ejemplos en `src/routes/` como referencia.

---

**Fecha de instalación:** ********\_********

**Versiones instaladas:**

- Node.js: ********\_********
- MySQL: ********\_********
- Prisma: ********\_********

