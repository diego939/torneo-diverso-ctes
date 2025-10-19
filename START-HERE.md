# 🎯 EMPIEZA AQUÍ - Guía Rápida de Prisma

## 📍 ¿Por dónde empiezo?

¡Bienvenido! Se ha configurado Prisma ORM para conectar tu proyecto con MySQL. Sigue estos pasos:

## ⚡ Instalación Rápida (5-10 minutos)

### Opción A: Script Automático (Recomendado)

**Windows PowerShell:**

```powershell
.\setup.ps1
```

**Mac/Linux:**

```bash
chmod +x setup.sh
./setup.sh
```

El script automáticamente:

1. ✅ Crea el archivo `.env`
2. ✅ Instala dependencias
3. ✅ Genera el cliente de Prisma
4. ✅ Crea las tablas en MySQL
5. ✅ Puebla la base de datos con datos del JSON

---

### Opción B: Instalación Manual

1. **Instalar dependencias**

   ```bash
   npm install
   ```

2. **Configurar MySQL**

   ```bash
   mysql -u root -p
   ```

   ```sql
   CREATE DATABASE copa_corrientes_diversa;
   EXIT;
   ```

3. **Crear archivo .env**

   ```bash
   # Windows
   Copy-Item env.example.txt .env

   # Mac/Linux
   cp env.example.txt .env
   ```

4. **Editar .env**

   ```env
   DATABASE_URL="mysql://root:tu_password@localhost:3306/copa_corrientes_diversa"
   ```

5. **Configurar Prisma**

   ```bash
   npm run prisma:generate
   npm run db:push
   npm run db:seed
   ```

6. **¡Listo!**
   ```bash
   npm run dev
   ```

---

## 📚 Documentación Disponible

| Archivo                               | Para qué sirve                          | ¿Cuándo leerlo?           |
| ------------------------------------- | --------------------------------------- | ------------------------- |
| **`CHECKLIST-INSTALACION-PRISMA.md`** | Checklist paso a paso con checkboxes    | Durante la instalación    |
| **`INSTRUCCIONES-INSTALACION.md`**    | Instrucciones detalladas de instalación | Si tienes problemas       |
| **`README-PRISMA.md`**                | Documentación completa y referencia     | Como guía general         |
| **`EJEMPLOS-USO-PRISMA.md`**          | Ejemplos de código prácticos            | Cuando estés programando  |
| **`RESUMEN-CONFIGURACION-PRISMA.md`** | Lista de todos los archivos creados     | Para entender qué se creó |

---

## 🔍 Archivos Importantes Creados

### Configuración

- 📄 `prisma/schema.prisma` - Define tu base de datos
- 📄 `prisma/seed.ts` - Pobla datos iniciales
- 📄 `src/lib/prisma.ts` - Cliente para usar en el código
- 📄 `.env` - Credenciales (créalo tú)

### Ejemplos de Código

- 📄 `src/routes/deportes/+page.server.ts` - Lista deportes
- 📄 `src/routes/deportes/[id]/+page.server.ts` - Detalle de deporte
- 📄 `src/routes/api/deportes/+server.ts` - API REST
- 📄 `src/lib/types.ts` - Tipos TypeScript

---

## 🎮 Comandos Principales

```bash
# Ver y editar datos visualmente
npm run prisma:studio

# Poblar datos nuevamente
npm run db:seed

# Iniciar proyecto
npm run dev

# Sincronizar schema
npm run db:push

# Generar cliente
npm run prisma:generate
```

---

## 💡 Uso Básico en tu Código

```typescript
// Importar el cliente
import prisma from "$lib/prisma";

// Obtener datos
const deportes = await prisma.deporte.findMany();

// Crear registro
await prisma.equipo.create({
  data: {
    nombre: "Mi Equipo",
    deporteId: "futbol",
    local: true,
    urlLogo: "/logo.png",
  },
});
```

---

## 🆘 ¿Algo salió mal?

### MySQL no conecta

- ✅ Verifica que MySQL esté corriendo
- ✅ Revisa las credenciales en `.env`
- ✅ Asegúrate de que la BD existe

### Error al instalar

```bash
# Intenta esto:
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Quiero empezar de cero

```bash
npx prisma migrate reset
npm run db:push
npm run db:seed
```

---

## 📊 Estructura de Datos

Tu JSON en `static/data.json` ahora vive en MySQL con esta estructura:

```
📦 organizadores
    └── 📦 torneos
            ├── 📦 banners
            └── 📦 deportes
                    ├── 📦 equipos
                    └── 📦 podios

📦 sponsors (independiente)
📦 usuarios (independiente)
```

---

## 🎯 Siguientes Pasos

1. ✅ **Completar instalación** (arriba)
2. 📖 **Leer** `EJEMPLOS-USO-PRISMA.md`
3. 🔍 **Explorar** con `npm run prisma:studio`
4. 💻 **Adaptar** tus componentes Svelte para usar Prisma
5. 🚀 **Desarrollar** tu aplicación

---

## 🎓 Recursos Extra

- 📘 [Documentación de Prisma](https://www.prisma.io/docs)
- 🎥 [Prisma + SvelteKit Tutorial](https://www.prisma.io/docs/guides/other/sveltekit)
- 💬 [Prisma Discord](https://pris.ly/discord)

---

## ❓ ¿Preguntas Frecuentes?

**¿Puedo seguir usando el JSON?**
Sí, puedes usar ambos simultáneamente mientras migras.

**¿Es difícil de usar?**
No, es más fácil que SQL directo y tiene autocompletado.

**¿Qué pasa con mis datos actuales?**
El JSON original no se modifica, se copia a la BD.

**¿Puedo editar datos?**
Sí, usa `npm run prisma:studio` para una interfaz gráfica.

**¿Funciona en producción?**
Sí, solo cambia la URL de conexión en las variables de entorno.

---

## ✅ Checklist Rápido

- [ ] MySQL instalado y corriendo
- [ ] Base de datos `copa_corrientes_diversa` creada
- [ ] Archivo `.env` configurado
- [ ] `npm install` ejecutado
- [ ] `npm run prisma:generate` ejecutado
- [ ] `npm run db:push` ejecutado
- [ ] `npm run db:seed` ejecutado
- [ ] `npm run dev` funciona
- [ ] Prisma Studio abre datos (`npm run prisma:studio`)

---

## 🎉 ¡Listo para Empezar!

Si completaste la instalación, ¡ya puedes empezar a usar Prisma!

**Próximo paso:** Abre `EJEMPLOS-USO-PRISMA.md` y empieza a codear 🚀

---

**¿Necesitas ayuda?** Revisa los archivos de documentación o consulta la [documentación oficial de Prisma](https://www.prisma.io/docs).

