# Guía de Integración con Vercel Blob Storage

## ✅ Configuración Completada

Tu proyecto ha sido migrado exitosamente a **Vercel Blob Storage** para el manejo de archivos. Todas las subidas y eliminaciones de archivos ahora utilizan URLs dinámicas del servicio en la nube.

---

## 📋 Configuración Previa (Ya Completada)

### 1. Instalación del Paquete

```bash
npm install @vercel/blob
```

### 2. Configuración en Vercel Dashboard

- ✅ Ve a tu proyecto en Vercel
- ✅ Storage → Create Database → Blob
- ✅ Se creó un Blob Storage vinculado a tu proyecto

### 3. Variables de Entorno

Tu archivo `.env` debe contener:

```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

**Nota:** Esta variable ya está configurada automáticamente en Vercel cuando creas el Blob Storage. Solo necesitas asegurarte de que esté en tu `.env` local para desarrollo.

---

## 🔄 Cambios Implementados

### Endpoints de Upload Migrados

1. **`/api/admin/upload-sponsor`** → Sube logos de sponsors a `/sponsors/`
2. **`/api/admin/upload-banner`** → Sube banners a `/banners/`
3. **`/api/admin/upload-equipo`** → Sube logos de equipos a `/equipos/`
4. **`/api/admin/upload`** → Sube:
   - Fondo del sitio a `/images/`
   - Planillas, reglamentos y fixtures a `/planillas/`, `/reglamentos/`, `/fixtures/`

### Endpoints de Delete Migrados

1. **`/api/admin/delete-sponsor-image`** → Elimina sponsors por URL
2. **`/api/admin/delete-equipo-image`** → Elimina logos de equipos por URL
3. **`/api/admin/delete-file`** → Elimina cualquier archivo por URL

### Archivos de Utilidad

- **`src/lib/blob.ts`** → Funciones helper para Vercel Blob:
  - `uploadToBlob()` - Subir archivos
  - `deleteFromBlob()` - Eliminar archivos
  - `listBlobFiles()` - Listar archivos
  - `validateFileType()` - Validar tipo de archivo
  - `validateFileSize()` - Validar tamaño de archivo
  - `generateUniqueFileName()` - Generar nombres únicos
  - `getFileExtension()` - Obtener extensión

---

## 📊 Estructura de Almacenamiento en Blob

Los archivos se organizan automáticamente en carpetas virtuales:

```
/sponsors/sponsor-[timestamp].jpg
/banners/[uuid].png
/equipos/equipo-[timestamp].jpg
/planillas/[deporteId].pdf
/reglamentos/[deporteId].pdf
/fixtures/[deporteId].pdf
/images/fondo-sitio.png
```

---

## 🔗 Formato de URLs

### Antes (Archivos Locales)

```
/auspiciantes/sponsor-1234567890.jpg
/banners/abc-123-xyz.png
/equipos/equipo-1234567890.jpg
```

### Ahora (Vercel Blob)

```
https://[hash].public.blob.vercel-storage.com/sponsors/sponsor-1234567890.jpg
https://[hash].public.blob.vercel-storage.com/banners/abc-123-xyz.png
https://[hash].public.blob.vercel-storage.com/equipos/equipo-1234567890.jpg
```

**Beneficio:** URLs públicas, CDN global, acceso instantáneo desde cualquier lugar.

---

## 🧪 Guía de Testing

### Testing Local (Desarrollo)

#### 1. Preparar el Entorno

```bash
# Asegúrate de tener la variable de entorno
echo "BLOB_READ_WRITE_TOKEN=vercel_blob_rw_..." >> .env

# Iniciar el servidor de desarrollo
npm run dev
```

#### 2. Probar Subida de Sponsor

```bash
curl -X POST http://localhost:5173/api/admin/upload-sponsor \
  -F "file=@/ruta/a/imagen.jpg"
```

**Respuesta esperada:**

```json
{
  "url": "https://[hash].public.blob.vercel-storage.com/sponsors/sponsor-[timestamp].jpg"
}
```

#### 3. Probar Subida de Banner

```bash
curl -X POST http://localhost:5173/api/admin/upload-banner \
  -F "file=@/ruta/a/banner.png"
```

**Respuesta esperada:**

```json
{
  "success": true,
  "url": "https://[hash].public.blob.vercel-storage.com/banners/[uuid].png",
  "fileName": "[uuid].png"
}
```

#### 4. Probar Subida de Logo de Equipo

```bash
curl -X POST http://localhost:5173/api/admin/upload-equipo \
  -F "file=@/ruta/a/logo.jpg"
```

#### 5. Probar Subida de Documento de Deporte

```bash
curl -X POST http://localhost:5173/api/admin/upload \
  -F "file=@/ruta/a/planilla.xlsx" \
  -F "type=planilla" \
  -F "deporteId=1"
```

#### 6. Probar Eliminación de Archivo

```bash
curl -X DELETE http://localhost:5173/api/admin/delete-sponsor-image \
  -H "Content-Type: application/json" \
  -d '{"fileUrl": "https://[hash].public.blob.vercel-storage.com/sponsors/file.jpg"}'
```

**Respuesta esperada:**

```json
{
  "message": "Imagen eliminada exitosamente"
}
```

### Testing desde la Interfaz Web

#### 1. Subir un Sponsor

1. Ir a la sección de administración de sponsors
2. Hacer clic en "Subir Imagen"
3. Seleccionar un archivo (JPG, PNG, SVG, WEBP - máximo 5MB)
4. Verificar que la URL devuelta sea de Vercel Blob

#### 2. Verificar URL Funcional

1. Copiar la URL devuelta
2. Pegarla en un navegador
3. Confirmar que la imagen carga correctamente

#### 3. Eliminar un Sponsor

1. En la lista de sponsors, hacer clic en "Eliminar"
2. Verificar que se envíe la URL completa de Vercel Blob
3. Confirmar que el archivo ya no es accesible

---

## 🚀 Deploy a Producción

### Verificación Pre-Deploy

#### 1. Verificar Variables de Entorno en Vercel

```bash
# En el dashboard de Vercel:
# Settings → Environment Variables
# Verificar que BLOB_READ_WRITE_TOKEN está configurado
```

#### 2. Verificar Build

```bash
npm run build
# Si no hay errores, continuar
```

#### 3. Deploy

```bash
# Push a tu repositorio (GitHub, GitLab, etc.)
git add .
git commit -m "Migrate to Vercel Blob Storage"
git push

# Vercel desplegará automáticamente
```

### Verificación Post-Deploy

1. **Acceder a la aplicación en producción**
2. **Probar subida de un archivo pequeño**
3. **Verificar que la URL devuelta funciona**
4. **Probar eliminación del archivo**
5. **Verificar en Vercel Dashboard → Storage → Blob** que el archivo aparece

---

## 🔍 Troubleshooting

### Error: "Missing environment variable BLOB_READ_WRITE_TOKEN"

**Causa:** La variable de entorno no está configurada.

**Solución:**

1. Verificar `.env` local
2. En Vercel Dashboard: Settings → Environment Variables → Añadir `BLOB_READ_WRITE_TOKEN`
3. Hacer redeploy

### Error: "Error al subir archivo a Vercel Blob"

**Causa:** Token inválido o problemas de red.

**Solución:**

1. Verificar que el token sea correcto
2. Verificar logs en Vercel Dashboard
3. Revisar límites de tu plan de Vercel

### Las URLs antiguas no funcionan

**Causa:** Los archivos antiguos están en `/static/`, los nuevos en Blob.

**Solución:**

- **Comportamiento esperado:** Los archivos antiguos seguirán funcionando desde `/static/` hasta que se eliminen
- Los nuevos archivos solo estarán en Vercel Blob
- Para migrar archivos antiguos, habría que crear un script de migración adicional

### No se pueden eliminar archivos antiguos

**Causa:** Los endpoints de delete ahora requieren URL completa de Vercel Blob.

**Solución:**

- Los archivos antiguos en `/static/` no se pueden eliminar con los nuevos endpoints
- Son archivos estáticos que se pueden eliminar manualmente o desde el código legacy

---

## 📊 Monitoreo y Costos

### Ver Archivos en Vercel Dashboard

1. Ir a tu proyecto en Vercel
2. Abrir **Storage** → **Blob**
3. Ver la lista de archivos subidos

### Costos Estimados

- **Almacenamiento:** $0.15/GB por mes
- **Transferencia:** $0.20/GB transferido
- **Plan gratuito:** 100GB almacenamiento, 500GB transferencia incluidos

### Monitoreo de Uso

En Vercel Dashboard → Storage → Blob → Usage verás:

- Espacio usado
- Archivos almacenados
- Transferencia de datos

---

## 🎯 Próximos Pasos Recomendados

### 1. Actualizar Componentes Frontend (Opcional)

Si tus componentes frontend manejan URLs relativas, actualizar para soportar ambas:

```typescript
const isBlobUrl = (url: string) => url.includes("blob.vercel-storage.com");
const isLocalUrl = (url: string) => url.startsWith("/");

// Usar directamente la URL tal como viene del servidor
<img src={imageUrl} />;
```

### 2. Script de Migración (Opcional)

Si quieres migrar archivos existentes de `/static/` a Vercel Blob:

1. Crear un script temporal
2. Leer archivos de `/static/`
3. Subirlos a Vercel Blob usando `uploadToBlob()`
4. Actualizar referencias en la base de datos

### 3. Optimización de Imágenes (Futuro)

Vercel Blob es compatible con Next.js Image Optimization o puedes usar servicios como Cloudinary para optimización automática.

---

## 📚 Recursos Adicionales

- [Documentación Oficial de Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- [SDK de @vercel/blob](https://www.npmjs.com/package/@vercel/blob)
- [API Reference](https://vercel.com/docs/storage/vercel-blob/sdk-reference)

---

## ✅ Checklist de Verificación

- [ ] Paquete `@vercel/blob` instalado
- [ ] Variable `BLOB_READ_WRITE_TOKEN` en `.env` local
- [ ] Variable `BLOB_READ_WRITE_TOKEN` en Vercel Dashboard
- [ ] Blob Storage creado en Vercel Dashboard
- [ ] Archivo `src/lib/blob.ts` creado
- [ ] Todos los endpoints de upload migrados
- [ ] Todos los endpoints de delete migrados
- [ ] Testing local completado
- [ ] Deploy a producción realizado
- [ ] Testing en producción completado
- [ ] Archivos accesibles en Vercel Dashboard Storage

---

## 🎉 ¡Migración Completada

Tu aplicación ahora está completamente migrada a Vercel Blob Storage. Los archivos se gestionan dinámicamente en la nube, con URLs públicas, CDN global y sin limitaciones del filesystem read-only de Vercel.

**Soporte:** Si tienes problemas, revisa los logs en Vercel Dashboard o consulta la documentación oficial.
