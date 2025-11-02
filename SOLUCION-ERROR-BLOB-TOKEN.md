# 🔧 Solución: Error de Token de Vercel Blob

## ❌ Error Encontrado

```
BlobAccessError: Vercel Blob: Access denied, please provide a valid token for this resource.
```

## ✅ Solución

Este error ocurre porque falta la variable de entorno `BLOB_READ_WRITE_TOKEN` en tu `.env` local, o tienes un valor incorrecto.

### Pasos para Solucionarlo

#### 1. Obtener el Token de Vercel

1. Ve a tu [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Storage** → **Blob**
4. Click en tu Blob Storage
5. Ve a la pestaña **Settings** o **Keys**
6. Copia el token `BLOB_READ_WRITE_TOKEN`

#### 2. Agregar el Token a tu `.env`

Abre tu archivo `.env` en la raíz del proyecto y agrega:

```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxx
```

**Reemplaza** `vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxx` con tu token real.

#### 3. Reiniciar el Servidor de Desarrollo

**IMPORTANTE:** Si el servidor estaba corriendo cuando agregaste el `.env`, necesitas reiniciarlo:

```bash
# Detener el servidor (Ctrl+C)
# Luego reiniciar:
npm run dev
```

## 🧪 Verificar que Funciona

Una vez que reinicies el servidor, intenta subir un archivo desde la interfaz de administración. Si el error persiste:

### Verificar que el Token Está Correcto

En la terminal del servidor, puedes agregar un console.log temporal:

```typescript
// En src/lib/blob.ts, temporalmente
console.log("Blob token:", BLOB_READ_WRITE_TOKEN?.substring(0, 20) + "...");
```

Si ves `undefined`, significa que la variable no está cargada.

### Verificar el Formato del Token

Los tokens de Vercel Blob tienen el formato:

- Deben empezar con `vercel_blob_rw_`
- Tienen una longitud de aproximadamente 40-50 caracteres

### Verificar Variables en Vercel

Si estás probando en producción:

1. Ve a Vercel Dashboard → Tu Proyecto → Settings → Environment Variables
2. Verifica que `BLOB_READ_WRITE_TOKEN` esté configurada
3. Verifica que esté activada para **Production**, **Preview** y **Development** según necesites

## 📝 Nota Importante

El archivo `src/lib/blob.ts` usa la importación correcta de SvelteKit:

```typescript
import { BLOB_READ_WRITE_TOKEN } from "$env/static/private";
```

Esta es la forma correcta de importar variables de entorno privadas en SvelteKit (solo servidor).

## ✅ Checklist

- [ ] Token copiado de Vercel Dashboard
- [ ] Token agregado al archivo `.env` local
- [ ] Servidor de desarrollo reiniciado (`npm run dev`)
- [ ] Verificado que no hay espacios extra antes/después del token
- [ ] Token no está entre comillas simples o dobles innecesarias
- [ ] Si en producción: Variable configurada en Vercel Dashboard

## 🆘 ¿Aún no funciona?

1. **Verifica que no estés usando una variable de entorno antigua:**

   ```bash
   # En Windows PowerShell
   $env:BLOB_READ_WRITE_TOKEN

   # En Mac/Linux
   echo $BLOB_READ_WRITE_TOKEN
   ```

2. **Limpia la caché y reinicia:**

   ```bash
   # Detener servidor
   # Eliminar cache
   rm -rf .svelte-kit
   # Reiniciar
   npm run dev
   ```

3. **Verifica que el Blob Storage esté activo:**

   - Ve a Vercel Dashboard → Storage → Blob
   - Confirma que el storage no esté en pausa o deshabilitado

4. **Revisa los logs de Vercel Blob:**
   - Ve a tu proyecto en Vercel
   - Revisa los logs de deploy o runtime
   - Busca errores relacionados con Blob

## 📚 Recursos

- [Documentación de Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- [Guía de Variables de Entorno en Vercel](https://vercel.com/docs/concepts/projects/environment-variables)
