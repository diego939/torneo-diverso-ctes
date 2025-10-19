# 🚀 Guía de Inicio Rápido

## Primeros Pasos

### 1. Instalar Dependencias

```bash
cd copa-corrientes-diversa
npm install
```

### 2. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La aplicación se abrirá en: **http://localhost:5173**

## ✅ Checklist Inicial

Antes de lanzar tu sitio, verifica lo siguiente:

### Contenido

- [ ] Actualizar información del torneo en `static/data.json`
- [ ] Revisar fechas de competencia
- [ ] Actualizar ubicaciones de los deportes
- [ ] Verificar números de teléfono y emails
- [ ] Actualizar CBU/Alias para pagos
- [ ] Agregar enlaces de grupos de WhatsApp

### Imágenes

- [ ] Banner principal está en `static/banners/fondo-sitio.png`
- [ ] Logo en `static/banners/fundaac-logo.png`
- [ ] Imágenes de cronograma en `static/banners/cronograma-*.jpeg`
- [ ] Logos de sponsors en `static/auspiciantes/`

### Documentos

- [ ] PDFs de reglamentos en `static/reglamentos/`
- [ ] PDFs de fixtures en `static/fixtures/`
- [ ] Planillas Excel en `static/planillas/`

### Links y Contacto

- [ ] Verificar enlaces de Instagram
- [ ] Actualizar número de WhatsApp
- [ ] Probar enlaces de ubicación (Google Maps)
- [ ] Verificar enlaces de grupos de WhatsApp por deporte

## 📝 Ediciones Rápidas Comunes

### Cambiar Título del Torneo

Edita `static/data.json`:

```json
{
  "torneoInfo": {
    "nombre": "Nuevo Nombre del Torneo"
  }
}
```

### Agregar un Nuevo Deporte

```json
{
  "deportes": [
    {
      "id": "nuevo-deporte",
      "nombre": "Nombre del Deporte",
      "planilla": "/planillas/planilla.xlsx",
      "reglamento": "/reglamentos/reglamento.pdf",
      "fixture": "/fixtures/fixture.pdf",
      "fechasCompetencia": ["2024-02-10"],
      "locationsNombre": ["Ubicación"],
      "locationsUrl": ["https://maps.google.com"],
      "grupoUrlWhatsapp": "https://chat.whatsapp.com/..."
    }
  ]
}
```

### Cambiar Colores del Sitio

Edita `src/app.css`:

```css
/* Busca esta línea y cambia los colores */
background: linear-gradient(90deg, #062a85 60%, #3a7bd5 100%);
```

## 🐛 Solución de Problemas

### El sitio no carga los datos

1. Verifica que `static/data.json` sea un JSON válido
2. Usa un validador JSON online: https://jsonlint.com
3. Revisa la consola del navegador (F12)

### Las imágenes no se ven

1. Verifica que las rutas empiecen con `/` 
   - ✅ Correcto: `/banners/imagen.png`
   - ❌ Incorrecto: `banners/imagen.png`
2. Asegúrate de que los archivos estén en `static/`

### Errores al instalar

```bash
# Limpia e instala de nuevo
rm -rf node_modules package-lock.json
npm install
```

## 📱 Probar en Móvil

1. Encuentra tu IP local:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. Inicia el servidor:
   ```bash
   npm run dev -- --host
   ```

3. Accede desde tu móvil:
   ```
   http://TU-IP-LOCAL:5173
   ```

## 🌐 Publicar el Sitio

### Opción 1: Vercel (Recomendado)

1. Crea cuenta en https://vercel.com
2. Instala Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Publica:
   ```bash
   vercel
   ```

### Opción 2: Netlify

1. Build el proyecto:
   ```bash
   npm run build
   ```
2. Arrastra la carpeta `build` a https://app.netlify.com/drop

## 🔄 Actualizar Contenido en Vivo

Una vez publicado, para actualizar contenido:

1. Edita `static/data.json`
2. Haz commit y push a Git
3. El sitio se actualizará automáticamente (si usas Vercel/Netlify con Git)

**Alternativa sin Git:**

1. Edita `static/data.json` localmente
2. Ejecuta `npm run build`
3. Sube la carpeta `build` nuevamente

## 📞 Soporte

¿Necesitas ayuda? Contacta al equipo de desarrollo o consulta el README completo.

---

**¡Listo para lanzar! 🎉**

