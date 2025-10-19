# Guía de Despliegue en Vercel

## Configuración Necesaria

### 1. Variables de Entorno en Vercel

Para que tu aplicación funcione correctamente en Vercel, necesitas configurar la variable `DATABASE_URL` en el dashboard de Vercel:

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Navega a **Settings** → **Environment Variables**
3. Agrega la variable:
   - **Name**: `DATABASE_URL`
   - **Value**: Tu string de conexión a la base de datos
   - **Environment**: Production, Preview, Development (marca todas)

### 2. Opciones de Base de Datos Recomendadas

#### Opción 1: PlanetScale (MySQL)

```bash
# Ejemplo de DATABASE_URL para PlanetScale
DATABASE_URL="mysql://usuario:password@host.planetscale.com:3306/copa_ctes?sslaccept=strict&connection_limit=1"
```

#### Opción 2: Railway (MySQL)

```bash
# Ejemplo de DATABASE_URL para Railway
DATABASE_URL="mysql://usuario:password@host.railway.app:3306/copa_ctes?sslaccept=strict"
```

#### Opción 3: Neon (PostgreSQL)

Si cambias a PostgreSQL, actualiza el `schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3. Configuración de Build

El proyecto ya está configurado con:

- ✅ Adaptador de Vercel (`@sveltejs/adapter-vercel`)
- ✅ Scripts de build optimizados
- ✅ Generación automática de Prisma Client
- ✅ Configuración de `vercel.json`

### 4. Pasos para Desplegar

1. **Conecta tu repositorio a Vercel**
2. **Configura las variables de entorno** (paso 1)
3. **Ejecuta las migraciones** (si es necesario):
   ```bash
   # En tu base de datos de producción
   npx prisma migrate deploy
   ```
4. **Despliega**: Vercel detectará automáticamente los cambios y desplegará

### 5. Verificación Post-Despliegue

Después del despliegue, verifica que:

- ✅ La aplicación carga correctamente
- ✅ Las rutas de API funcionan
- ✅ La conexión a la base de datos es exitosa
- ✅ Prisma Client se genera correctamente

### 6. Troubleshooting

#### Error: "DATABASE_URL not found"

- Verifica que la variable esté configurada en Vercel Dashboard
- Asegúrate de que esté marcada para todos los entornos

#### Error: "Prisma Client not generated"

- El script `postinstall` debería ejecutarse automáticamente
- Si no, puedes ejecutar manualmente: `npx prisma generate`

#### Error de conexión a la base de datos

- Verifica que la URL de conexión sea correcta
- Asegúrate de que la base de datos permita conexiones externas
- Verifica que el SSL esté configurado correctamente

### 7. Comandos Útiles

```bash
# Generar Prisma Client
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy

# Verificar conexión
npx prisma db pull

# Abrir Prisma Studio (solo desarrollo)
npx prisma studio
```

## Notas Importantes

- **SSL**: Todas las bases de datos en producción requieren SSL
- **Connection Limit**: Para Vercel, usa `connection_limit=1` para evitar problemas
- **Timeout**: Configura timeouts apropiados para evitar timeouts de Vercel
- **Secrets**: Nunca hardcodees la DATABASE_URL en el código
