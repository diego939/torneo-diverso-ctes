# 📚 Ejemplos de Uso de Prisma

Este archivo contiene ejemplos prácticos de cómo usar Prisma en tu proyecto.

## 🔧 Configuración Inicial

El cliente de Prisma ya está configurado en `src/lib/prisma.ts`. Úsalo así:

```typescript
import prisma from "$lib/prisma";
```

## 📖 Ejemplos por Operación

### 1. Obtener todos los registros

```typescript
// Obtener todos los deportes
const deportes = await prisma.deporte.findMany();

// Con ordenamiento
const deportes = await prisma.deporte.findMany({
  orderBy: {
    nombre: "asc",
  },
});

// Con relaciones incluidas
const deportes = await prisma.deporte.findMany({
  include: {
    torneo: true,
    equipos: true,
    podios: true,
  },
});
```

### 2. Obtener un registro por ID

```typescript
const deporte = await prisma.deporte.findUnique({
  where: {
    id: "artes-marciales",
  },
  include: {
    torneo: true,
  },
});
```

### 3. Buscar con condiciones

```typescript
// Buscar deportes que contengan "fútbol" en el nombre
const deportes = await prisma.deporte.findMany({
  where: {
    nombre: {
      contains: "fútbol",
    },
  },
});

// Buscar equipos locales
const equiposLocales = await prisma.equipo.findMany({
  where: {
    local: true,
  },
});

// Búsqueda con múltiples condiciones (AND)
const deportes = await prisma.deporte.findMany({
  where: {
    AND: [{ nombre: { contains: "volley" } }, { torneoId: "torneo-001" }],
  },
});

// Búsqueda con OR
const deportes = await prisma.deporte.findMany({
  where: {
    OR: [{ nombre: "Voley" }, { nombre: "Fútbol 5" }],
  },
});
```

### 4. Crear registros

```typescript
// Crear un equipo nuevo
const equipo = await prisma.equipo.create({
  data: {
    nombre: "Yaguaretés FC",
    local: true,
    urlLogo: "/logos/yaguaretes.png",
    deporteId: "futbol",
    instagram: "https://instagram.com/yaguaretes",
  },
});

// Crear con relaciones anidadas
const torneo = await prisma.torneo.create({
  data: {
    nombre: "Copa 2025",
    descripcion: "Nueva edición",
    imagenPrincipal: "/imagen.jpg",
    fundamentacionTitulo: "Título",
    fundamentacionTexto: ["Texto 1", "Texto 2"],
    organizador: {
      create: {
        nombre: "Organizador",
        mails: ["mail@example.com"],
        celularWhatsapp: "+549...",
        cbu: "...",
        alias: "alias",
        nombreRedes: "Nombre",
        redesUrl: "https://...",
      },
    },
  },
});
```

### 5. Actualizar registros

```typescript
// Actualizar un deporte
const deporteActualizado = await prisma.deporte.update({
  where: {
    id: "voley",
  },
  data: {
    grupoUrlWhatsapp: "https://chat.whatsapp.com/nuevo-link",
    horarios: ["Sábado 10/2 de 8 a 18 hs"],
  },
});

// Actualizar múltiples registros
await prisma.equipo.updateMany({
  where: {
    deporteId: "futbol",
  },
  data: {
    local: true,
  },
});
```

### 6. Eliminar registros

```typescript
// Eliminar un equipo
await prisma.equipo.delete({
  where: {
    id: "equipo-123",
  },
});

// Eliminar múltiples registros
await prisma.equipo.deleteMany({
  where: {
    deporteId: "futbol",
  },
});

// Eliminar todos los registros de una tabla
await prisma.equipo.deleteMany();
```

### 7. Contar registros

```typescript
// Contar todos los deportes
const totalDeportes = await prisma.deporte.count();

// Contar con condición
const deportesConReglamento = await prisma.deporte.count({
  where: {
    reglamento: {
      not: "",
    },
  },
});
```

### 8. Relaciones complejas

```typescript
// Obtener torneo con todas sus relaciones
const torneo = await prisma.torneo.findUnique({
  where: {
    id: "torneo-001",
  },
  include: {
    organizador: true,
    banners: true,
    deportes: {
      include: {
        equipos: true,
        podios: {
          orderBy: {
            puesto: "asc",
          },
        },
      },
    },
  },
});

// Filtrar relaciones incluidas
const deportes = await prisma.deporte.findMany({
  include: {
    equipos: {
      where: {
        local: true,
      },
      take: 5,
    },
  },
});
```

### 9. Paginación

```typescript
// Obtener página 1 (primeros 10)
const deportes = await prisma.deporte.findMany({
  take: 10,
  skip: 0,
});

// Obtener página 2 (siguientes 10)
const deportes = await prisma.deporte.findMany({
  take: 10,
  skip: 10,
});

// Función de paginación
async function getDeportesPaginados(pagina: number, porPagina: number) {
  const [deportes, total] = await Promise.all([
    prisma.deporte.findMany({
      take: porPagina,
      skip: (pagina - 1) * porPagina,
      orderBy: { nombre: "asc" },
    }),
    prisma.deporte.count(),
  ]);

  return {
    deportes,
    total,
    paginas: Math.ceil(total / porPagina),
    paginaActual: pagina,
  };
}
```

### 10. Transacciones

```typescript
// Crear múltiples registros de forma atómica
const [equipo, podio] = await prisma.$transaction([
  prisma.equipo.create({
    data: {
      nombre: "Nuevo Equipo",
      local: true,
      urlLogo: "/logo.png",
      deporteId: "futbol",
    },
  }),
  prisma.podio.create({
    data: {
      equipoNombre: "Nuevo Equipo",
      puesto: 1,
      deporteId: "futbol",
    },
  }),
]);

// Transacción interactiva
const resultado = await prisma.$transaction(async (tx) => {
  // Crear equipo
  const equipo = await tx.equipo.create({
    data: {
      nombre: "Equipo X",
      local: true,
      urlLogo: "/logo.png",
      deporteId: "futbol",
    },
  });

  // Crear podio para ese equipo
  const podio = await tx.podio.create({
    data: {
      equipoNombre: equipo.nombre,
      puesto: 1,
      deporteId: "futbol",
    },
  });

  return { equipo, podio };
});
```

## 🌐 Uso en SvelteKit

### En rutas de servidor (+page.server.ts)

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

### En API endpoints (+server.ts)

```typescript
// src/routes/api/deportes/+server.ts
import { json } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  const deportes = await prisma.deporte.findMany();
  return json(deportes);
};
```

### En acciones de formularios

```typescript
// src/routes/equipos/crear/+page.server.ts
import { fail } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import type { Actions } from "./$types";

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const nombre = formData.get("nombre")?.toString();
    const deporteId = formData.get("deporteId")?.toString();

    if (!nombre || !deporteId) {
      return fail(400, { error: "Datos incompletos" });
    }

    try {
      const equipo = await prisma.equipo.create({
        data: {
          nombre,
          deporteId,
          local: true,
          urlLogo: "/logos/default.png",
        },
      });

      return { success: true, equipo };
    } catch (error) {
      return fail(500, { error: "Error al crear equipo" });
    }
  },
};
```

## 🎯 Manejo de campos JSON

Los campos como `mails`, `fechasCompetencia`, etc. se almacenan como JSON. Al leerlos, necesitas hacer un cast:

```typescript
const organizador = await prisma.organizador.findUnique({
  where: { id: "org-001" },
});

// Cast a array de strings
const mails = organizador.mails as string[];

// Para fechas
const deporte = await prisma.deporte.findUnique({
  where: { id: "voley" },
});

const fechas = deporte.fechasCompetencia as string[];
const horarios = deporte.horarios as string[];
const redesSociales = deporte.redesSociales as {
  instagram?: Array<{ nombre: string; url: string }>;
};
```

## 🔍 Búsqueda avanzada

```typescript
// Buscar deportes con equipos que tengan Instagram
const deportes = await prisma.deporte.findMany({
  where: {
    equipos: {
      some: {
        instagram: {
          not: null,
        },
      },
    },
  },
  include: {
    equipos: {
      where: {
        instagram: { not: null },
      },
    },
  },
});

// Buscar torneos por organizador
const torneos = await prisma.torneo.findMany({
  where: {
    organizador: {
      nombre: {
        contains: "Diversa",
      },
    },
  },
});
```

## 📝 Notas Importantes

1. **Siempre desconecta el cliente** al finalizar scripts:

   ```typescript
   await prisma.$disconnect();
   ```

2. **Maneja errores apropiadamente**:

   ```typescript
   try {
     const result = await prisma.deporte.findUnique(...);
   } catch (error) {
     console.error('Error:', error);
     throw error;
   }
   ```

3. **Para campos JSON**, siempre haz cast al tipo correcto.

4. **Usa transacciones** cuando necesites atomicidad.

5. **Limita las consultas** con `take` para evitar cargar demasiados datos.

## 🚀 Recursos

- [Documentación oficial de Prisma](https://www.prisma.io/docs)
- [Prisma Client API Reference](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Guía de SvelteKit + Prisma](https://www.prisma.io/docs/guides/other/sveltekit)

