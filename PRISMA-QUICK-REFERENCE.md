# ⚡ Prisma - Referencia Rápida

## 🚀 Comandos Esenciales

```bash
# Ver datos visualmente
npm run prisma:studio

# Poblar datos
npm run db:seed

# Sincronizar schema
npm run db:push

# Generar cliente
npm run prisma:generate
```

## 💻 Código Básico

### Importar

```typescript
import prisma from "$lib/prisma";
```

### Leer

```typescript
// Todos
const deportes = await prisma.deporte.findMany();

// Uno
const deporte = await prisma.deporte.findUnique({
  where: { id: "voley" },
});

// Con relaciones
const deportes = await prisma.deporte.findMany({
  include: {
    torneo: true,
    equipos: true,
  },
});

// Con filtros
const deportes = await prisma.deporte.findMany({
  where: {
    nombre: { contains: "fútbol" },
  },
});
```

### Crear

```typescript
await prisma.equipo.create({
  data: {
    nombre: "Mi Equipo",
    deporteId: "futbol",
    local: true,
    urlLogo: "/logo.png",
  },
});
```

### Actualizar

```typescript
await prisma.deporte.update({
  where: { id: "voley" },
  data: {
    grupoUrlWhatsapp: "nuevo-link",
  },
});
```

### Eliminar

```typescript
await prisma.equipo.delete({
  where: { id: "equipo-123" },
});
```

## 🎯 Uso en SvelteKit

### +page.server.ts

```typescript
import prisma from "$lib/prisma";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const deportes = await prisma.deporte.findMany();
  return { deportes };
};
```

### +server.ts (API)

```typescript
import { json } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  const deportes = await prisma.deporte.findMany();
  return json(deportes);
};
```

## 📊 Modelos Principales

```
Organizador
  └── Torneo
        ├── Banner
        └── Deporte
              ├── Equipo
              └── Podio

Sponsor
Usuario
```

## 🔄 Campos JSON

```typescript
// Castear arrays
const mails = organizador.mails as string[];
const horarios = deporte.horarios as string[];
const redes = deporte.redesSociales as RedesSociales;
```

## 🆘 Problemas Comunes

| Problema          | Solución                  |
| ----------------- | ------------------------- |
| No conecta        | Verifica MySQL y `.env`   |
| Cliente no existe | `npm run prisma:generate` |
| Tablas no existen | `npm run db:push`         |
| Datos vacíos      | `npm run db:seed`         |

## 📚 Docs Completas

- `START-HERE.md` - Empieza aquí
- `EJEMPLOS-USO-PRISMA.md` - Más ejemplos
- `README-PRISMA.md` - Docs completas

