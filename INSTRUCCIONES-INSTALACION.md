# 🚀 Instrucciones de Instalación - Prisma + MySQL

## Pasos para poner en marcha la base de datos

### 1️⃣ Instalar dependencias

Abre tu terminal en la raíz del proyecto y ejecuta:

```bash
npm install
```

Esto instalará todas las dependencias, incluyendo Prisma y sus herramientas.

### 2️⃣ Configurar MySQL

Asegúrate de tener MySQL instalado y corriendo. Si no lo tienes:

**Windows:**

- Descarga MySQL Community Server desde [mysql.com](https://dev.mysql.com/downloads/mysql/)
- O instala con Chocolatey: `choco install mysql`

**Mac:**

```bash
brew install mysql
brew services start mysql
```

**Linux:**

```bash
sudo apt-get install mysql-server
sudo systemctl start mysql
```

### 3️⃣ Crear la base de datos

Conectate a MySQL desde la terminal:

```bash
mysql -u root -p
```

Luego ejecuta:

```sql
CREATE DATABASE copa_corrientes_diversa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 4️⃣ Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

**Windows PowerShell:**

```powershell
Copy-Item env.example.txt .env
```

**Mac/Linux:**

```bash
cp env.example.txt .env
```

Luego edita el archivo `.env` con tus credenciales de MySQL:

```env
DATABASE_URL="mysql://root:tu_password@localhost:3306/copa_corrientes_diversa"
```

Si tu usuario root no tiene contraseña, usa:

```env
DATABASE_URL="mysql://root:@localhost:3306/copa_corrientes_diversa"
```

### 5️⃣ Ejecutar las migraciones

Esto creará todas las tablas en la base de datos:

```bash
npm run prisma:migrate
```

Cuando te pida un nombre para la migración, escribe algo como: `initial_migration`

**Alternativa más rápida (sin archivos de migración):**

```bash
npm run db:push
```

### 6️⃣ Generar el cliente de Prisma

```bash
npm run prisma:generate
```

### 7️⃣ Poblar la base de datos con datos iniciales

Esto tomará todos los datos de `static/data.json` y los insertará en la BD:

```bash
npm run db:seed
```

Deberías ver mensajes como:

```
🌱 Iniciando seeding...
👤 Creando organizador...
✅ Organizador creado: Fundación Corrientes Diversa
🏆 Creando torneo...
✅ Torneo creado: Copa Corrientes Diversa 2024
...
🎉 Seeding completado exitosamente!
```

### 8️⃣ Verificar los datos (opcional)

Abre Prisma Studio para ver los datos en una interfaz gráfica:

```bash
npm run prisma:studio
```

Esto abrirá `http://localhost:5555` donde podrás ver y editar tus datos.

## ✅ ¡Listo!

Ahora puedes iniciar tu proyecto:

```bash
npm run dev
```

## 🔄 Comandos útiles

| Comando                    | Qué hace                                    |
| -------------------------- | ------------------------------------------- |
| `npm run prisma:studio`    | Abre interfaz gráfica para ver/editar datos |
| `npm run db:seed`          | Vuelve a poblar la BD con datos del JSON    |
| `npm run prisma:migrate`   | Crea una nueva migración                    |
| `npx prisma migrate reset` | ⚠️ Borra todo y vuelve a empezar            |

## 🆘 Problemas comunes

### Error: "Can't connect to MySQL server"

- Verifica que MySQL esté corriendo
- En Windows: abre Servicios y busca "MySQL"
- En Mac: `brew services list`
- En Linux: `sudo systemctl status mysql`

### Error: "Access denied for user"

- Verifica tu usuario y contraseña en el archivo `.env`
- Si usas root sin password: `mysql://root:@localhost:3306/copa_corrientes_diversa`

### Error: "Unknown database"

- Asegúrate de haber creado la base de datos en el paso 3

### Error al ejecutar el seed

- Asegúrate de haber ejecutado las migraciones primero
- Verifica que el archivo `static/data.json` exista

## 📚 Próximos pasos

Revisa `README-PRISMA.md` para más detalles sobre cómo usar Prisma en tu código.

Los archivos de ejemplo ya están creados:

- `src/routes/deportes/+page.server.ts` - Lista todos los deportes
- `src/routes/deportes/[id]/+page.server.ts` - Detalle de un deporte
- `src/lib/prisma.ts` - Cliente de Prisma para usar en todo el proyecto

