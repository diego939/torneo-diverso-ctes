# 🚀 Próximos Pasos - Tu Base de Datos está Lista

## ✅ Estado Actual

- ✅ Base de datos `copa_ctes` creada en MySQL
- ✅ Variable `DATABASE_URL` configurada en `.env`
- ✅ Prisma configurado en el proyecto

## 📋 Pasos para Completar la Configuración

### 1️⃣ Instalar Dependencias (si aún no lo hiciste)

```bash
npm install
```

### 2️⃣ Generar el Cliente de Prisma

```bash
npm run prisma:generate
```

Esto creará el cliente de Prisma con TypeScript types basado en tu schema.

### 3️⃣ Crear las Tablas en la Base de Datos

```bash
npm run db:push
```

Este comando:

- Lee el archivo `prisma/schema.prisma`
- Crea todas las tablas en tu base de datos `copa_ctes`
- Sincroniza la estructura sin crear archivos de migración

Deberías ver algo como:

```
🚀  Your database is now in sync with your Prisma schema. Done in XXXms

✔ Generated Prisma Client
```

### 4️⃣ Poblar la Base de Datos con Datos Iniciales

```bash
npm run db:seed
```

Este comando:

- Lee el archivo `static/data.json`
- Inserta todos los datos en tu base de datos

Deberías ver:

```
🌱 Iniciando seeding...
👤 Creando organizador...
✅ Organizador creado: Fundación Corrientes Diversa
🏆 Creando torneo...
✅ Torneo creado: Copa Corrientes Diversa 2024
🎨 Creando banners...
✅ Banner creado: Copa Corrientes Diversa 2024 🏆
⚽ Creando deportes...
✅ Deporte creado: Artes Marciales
✅ Deporte creado: Voley
✅ Deporte creado: Básquet
✅ Deporte creado: Fútbol 5
✅ Deporte creado: Hockey
✅ Deporte creado: Handball
✅ Deporte creado: Rugby
✅ Deporte creado: Pádel
✅ Deporte creado: Tenis
✅ Deporte creado: Natación
✅ Deporte creado: Atletismo
💼 Creando sponsors...
✅ Sponsor creado: Gobierno de Corrientes
✅ Sponsor creado: Municipalidad
✅ Sponsor creado: Secretaría de Deportes
✅ Sponsor creado: ACDP
✅ Sponsor creado: Educación Física
✅ Sponsor creado: FUNDEGH
✅ Sponsor creado: Castillo Robert
🔐 Creando usuario de ejemplo...
✅ Usuario creado: admin@corrientesdiversa.org
🎉 Seeding completado exitosamente!
```

### 5️⃣ Verificar los Datos (Opcional pero Recomendado)

```bash
npm run prisma:studio
```

Esto abrirá una interfaz gráfica en `http://localhost:5555` donde podrás:

- Ver todas las tablas
- Verificar que los datos se insertaron correctamente
- Editar datos si es necesario

Deberías ver:

- **organizadores**: 1 registro
- **torneos**: 1 registro
- **banners**: 1 registro (con 13 imágenes de cronogramas)
- **deportes**: 11 registros
- **sponsors**: 7 registros
- **usuarios**: 1 registro

### 6️⃣ Iniciar tu Aplicación

```bash
npm run dev
```

## 🎯 Resumen de Comandos en Orden

```bash
# 1. Instalar dependencias
npm install

# 2. Generar cliente
npm run prisma:generate

# 3. Crear tablas
npm run db:push

# 4. Poblar datos
npm run db:seed

# 5. Ver datos (opcional)
npm run prisma:studio

# 6. Iniciar app
npm run dev
```

## ✅ Verificación Final

Después de ejecutar todos los pasos, verifica:

1. **En Prisma Studio** (`npm run prisma:studio`):

   - Las 8 tablas existen
   - Hay datos en cada tabla

2. **En MySQL directamente**:

   ```bash
   mysql -u root -p
   USE copa_ctes;
   SHOW TABLES;
   SELECT COUNT(*) FROM deportes;  # Debería devolver 11
   SELECT nombre FROM deportes;
   EXIT;
   ```

3. **En tu aplicación** (después de `npm run dev`):
   - Abre `http://localhost:5173`
   - No hay errores en la consola

## 🆘 Si Algo Sale Mal

### Error: "Can't connect to database"

```bash
# Verifica tu .env
cat .env  # En Windows: type .env

# Debería mostrar algo como:
# DATABASE_URL="mysql://root:tu_password@localhost:3306/copa_ctes"
```

### Error: "Table already exists"

```bash
# Si necesitas empezar de cero:
npx prisma db push --force-reset
npm run db:seed
```

### Error: "Client not generated"

```bash
npm run prisma:generate
```

## 📚 Próximos Pasos después de la Configuración

1. **Leer ejemplos**: Abre `EJEMPLOS-USO-PRISMA.md`
2. **Explorar las rutas de ejemplo**:
   - `src/routes/deportes/+page.server.ts`
   - `src/routes/api/deportes/+server.ts`
3. **Adaptar tu código**: Comienza a usar Prisma en tus componentes

## 💡 Comandos Útiles para el Día a Día

```bash
# Ver/editar datos visualmente
npm run prisma:studio

# Volver a poblar datos (borra y recrea)
npm run db:seed

# Ver el schema en formato SQL
npx prisma db pull

# Formatear schema.prisma
npx prisma format

# Validar schema.prisma
npx prisma validate
```

## 🎉 ¡Listo!

Una vez completados estos pasos, tendrás:

- ✅ Base de datos `copa_ctes` con estructura completa
- ✅ 11 deportes con toda su información
- ✅ 7 sponsors
- ✅ Torneo y organizador configurados
- ✅ Cliente de Prisma generado y listo para usar

**¡A codear!** 🚀

