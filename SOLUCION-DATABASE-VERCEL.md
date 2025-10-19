# Solución: Problema de Conexión a Base de Datos en Vercel

## 🔍 Diagnóstico del Problema

Tu aplicación está desplegada en [https://torneo-diverso-ctes.vercel.app/](https://torneo-diverso-ctes.vercel.app/) pero no puede conectar a la base de datos. Esto es común y tiene varias causas posibles.

## ✅ Pasos para Solucionar

### 1. **Verificar Variables de Entorno en Vercel**

Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard):

1. **Navega a tu proyecto** → **Settings** → **Environment Variables**
2. **Verifica que existe** `DATABASE_URL` con el valor correcto
3. **Asegúrate** de que esté marcada para:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

### 2. **Probar la Conexión**

He creado un endpoint de diagnóstico. Visita:

```
https://torneo-diverso-ctes.vercel.app/api/health
```

Este endpoint te mostrará:

- ✅ Si la base de datos está conectada
- ✅ Cuántos registros hay en cada tabla
- ✅ Si la variable `DATABASE_URL` está configurada
- ❌ Cualquier error específico

### 3. **Opciones de Base de Datos Recomendadas**

#### Opción A: PlanetScale (Recomendado para MySQL)

```bash
# 1. Crea una cuenta en https://planetscale.com
# 2. Crea una nueva base de datos
# 3. Copia la connection string
# 4. Agrega ?sslaccept=strict&connection_limit=1 al final
```

#### Opción B: Railway (MySQL)

```bash
# 1. Crea una cuenta en https://railway.app
# 2. Crea un nuevo proyecto MySQL
# 3. Copia la connection string
# 4. Agrega ?sslaccept=strict al final
```

#### Opción C: Neon (PostgreSQL)

```bash
# 1. Crea una cuenta en https://neon.tech
# 2. Crea una nueva base de datos PostgreSQL
# 3. Copia la connection string
# 4. Actualiza schema.prisma para usar postgresql
```

### 4. **Configuración de DATABASE_URL**

#### Para MySQL (PlanetScale/Railway):

```bash
DATABASE_URL="mysql://usuario:password@host:3306/copa_ctes?sslaccept=strict&connection_limit=1"
```

#### Para PostgreSQL (Neon):

```bash
DATABASE_URL="postgresql://usuario:password@host:5432/copa_ctes?sslmode=require"
```

### 5. **Ejecutar Migraciones**

Una vez configurada la base de datos:

```bash
# En tu terminal local (con la DATABASE_URL configurada)
npx prisma migrate deploy
npx prisma db seed
```

### 6. **Verificar Logs de Vercel**

1. Ve a tu proyecto en Vercel Dashboard
2. **Functions** → **View Function Logs**
3. Busca errores relacionados con:
   - `DATABASE_URL`
   - `Prisma`
   - `Connection`

## 🚨 Errores Comunes y Soluciones

### Error: "DATABASE_URL not found"

**Solución**: Configurar la variable en Vercel Dashboard

### Error: "Connection timeout"

**Solución**:

- Verificar que la base de datos permita conexiones externas
- Agregar `connection_limit=1` a la URL
- Verificar SSL

### Error: "SSL required"

**Solución**: Agregar `?sslaccept=strict` a la URL

### Error: "Table doesn't exist"

**Solución**: Ejecutar `npx prisma migrate deploy`

## 📋 Checklist de Verificación

- [ ] Variable `DATABASE_URL` configurada en Vercel
- [ ] Base de datos creada y accesible
- [ ] Migraciones ejecutadas
- [ ] Endpoint `/api/health` responde correctamente
- [ ] Logs de Vercel sin errores de base de datos

## 🔧 Comandos Útiles

```bash
# Verificar conexión local
npx prisma db pull

# Ejecutar migraciones
npx prisma migrate deploy

# Poblar base de datos
npx prisma db seed

# Ver logs de Vercel
vercel logs
```

## 📞 Próximos Pasos

1. **Visita** `/api/health` para ver el diagnóstico
2. **Configura** la variable `DATABASE_URL` en Vercel
3. **Ejecuta** las migraciones si es necesario
4. **Verifica** que la aplicación funcione correctamente

¿Necesitas ayuda con algún paso específico?
