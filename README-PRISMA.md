# Configuración de Prisma - Copa Corrientes Diversa

## 📋 Requisitos Previos

- Node.js instalado
- MySQL instalado y corriendo
- Base de datos MySQL creada

## 🚀 Instalación

### 1. Instalar dependencias

```bash
npm install
```

Esto instalará:

- `@prisma/client` - Cliente de Prisma
- `prisma` - CLI de Prisma
- `tsx` - Para ejecutar TypeScript directamente

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Luego edita el archivo `.env` con tus credenciales de MySQL:

```env
DATABASE_URL="mysql://usuario:password@localhost:3306/copa_corrientes_diversa"
```

### 3. Crear la base de datos (si no existe)

Conectate a MySQL y crea la base de datos:

```sql
CREATE DATABASE copa_corrientes_diversa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Ejecutar migraciones

```bash
npm run prisma:migrate
```

Este comando:

- Crea las tablas en la base de datos
- Genera el cliente de Prisma
- Te pedirá un nombre para la migración

O si prefieres sincronizar sin crear archivos de migración:

```bash
npm run db:push
```

### 5. Generar el cliente de Prisma

```bash
npm run prisma:generate
```

### 6. Ejecutar el seed (poblar con datos iniciales)

```bash
npm run db:seed
```

Esto poblará tu base de datos con todos los datos del archivo `static/data.json`.

## 📝 Comandos Disponibles

| Comando                         | Descripción                                    |
| ------------------------------- | ---------------------------------------------- |
| `npm run prisma:generate`       | Genera el cliente de Prisma                    |
| `npm run prisma:migrate`        | Crea y aplica una nueva migración              |
| `npm run prisma:migrate:deploy` | Aplica migraciones en producción               |
| `npm run prisma:studio`         | Abre Prisma Studio (GUI para ver/editar datos) |
| `npm run db:push`               | Sincroniza el schema sin crear migraciones     |
| `npm run db:seed`               | Ejecuta el seeder para poblar la BD            |

## 🔍 Prisma Studio

Para visualizar y editar datos de forma gráfica:

```bash
npm run prisma:studio
```

Esto abrirá una interfaz web en `http://localhost:5555`

## 💾 Uso del Cliente de Prisma

### Ejemplo en un archivo TypeScript/JavaScript:

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los deportes
async function getDeportes() {
  const deportes = await prisma.deporte.findMany({
    include: {
      torneo: true,
      equipos: true,
    },
  });
  return deportes;
}

// Obtener un deporte por ID
async function getDeporteById(id: string) {
  const deporte = await prisma.deporte.findUnique({
    where: { id },
    include: {
      torneo: true,
      equipos: true,
      podios: true,
    },
  });
  return deporte;
}

// Crear un nuevo equipo
async function createEquipo(data: any) {
  const equipo = await prisma.equipo.create({
    data: {
      nombre: data.nombre,
      local: data.local,
      urlLogo: data.urlLogo,
      deporteId: data.deporteId,
      instagram: data.instagram,
    },
  });
  return equipo;
}
```

### Uso en SvelteKit (Server-side)

Crea un archivo `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

Luego úsalo en tus `+page.server.ts`:

```typescript
// src/routes/deportes/+page.server.ts
import prisma from "$lib/prisma";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const deportes = await prisma.deporte.findMany({
    include: {
      torneo: true,
    },
  });

  return {
    deportes,
  };
};
```

## 🔄 Actualizar el Schema

Si necesitas modificar el schema:

1. Edita `prisma/schema.prisma`
2. Ejecuta `npm run prisma:migrate` para crear una migración
3. O ejecuta `npm run db:push` para sincronizar sin migración

## 🗑️ Resetear la Base de Datos

Si necesitas empezar de cero:

```bash
npx prisma migrate reset
```

⚠️ **CUIDADO**: Esto borrará todos los datos.

## 📚 Notas Importantes

- **Arrays en MySQL**: Como MySQL no soporta arrays nativos, usamos el tipo `Json` para almacenar arrays y objetos.
- **IDs personalizados**: El seeder usa los IDs del JSON original para mantener consistencia.
- **Passwords**: El usuario de ejemplo tiene una contraseña en texto plano. En producción, usa bcrypt para hashear.

## 🔐 Seguridad

Para hashear contraseñas, instala bcrypt:

```bash
npm install bcrypt
npm install -D @types/bcrypt
```

Y úsalo así:

```typescript
import bcrypt from "bcrypt";

const hashedPassword = await bcrypt.hash("miPassword", 10);
```

## 🆘 Solución de Problemas

### Error de conexión a MySQL

- Verifica que MySQL esté corriendo
- Verifica las credenciales en `.env`
- Verifica que la base de datos exista

### Error al ejecutar migraciones

- Asegúrate de tener permisos para crear tablas
- Verifica que no haya migraciones pendientes

### Error al ejecutar el seed

- Asegúrate de haber ejecutado las migraciones primero
- Verifica que el archivo `static/data.json` exista

## 📞 Recursos

- [Documentación de Prisma](https://www.prisma.io/docs)
- [Prisma con SvelteKit](https://www.prisma.io/docs/guides/other/sveltekit)
- [Referencia de Schema](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

