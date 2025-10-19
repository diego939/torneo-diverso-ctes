# 🎉 ¡Tu Aplicación Está Lista!

## ⚡ Inicio Rápido (3 pasos)

### 1️⃣ Instalar

```bash
cd copa-corrientes-diversa
npm install
```

### 2️⃣ Ejecutar

```bash
npm run dev
```

### 3️⃣ Abrir

Navega a: **http://localhost:5173**

---

## 🎯 ¿Qué Tienes Ahora?

Tu landing page HTML estática de 3000+ líneas ha sido convertida en una **aplicación web moderna** con:

### ✅ Rutas Separadas
- `/` → Página de inicio
- `/deportes` → Lista de todos los deportes
- `/deportes/voley` → Detalle de cada deporte (dinámico)
- `/sponsors` → Auspiciantes

### ✅ Datos Editables
Todo el contenido está en **un solo archivo JSON** fácil de editar:
```
static/data.json
```

### ✅ Recursos Migrados
- ✅ 16 imágenes (banners + logos)
- ✅ 12 reglamentos PDF
- ✅ 3 fixtures PDF
- ✅ 12 planillas Excel
- ✅ Todos los estilos CSS

---

## 📝 Editar Contenido

### Para cambiar CUALQUIER texto o dato:

1. Abre: `static/data.json`
2. Edita lo que necesites
3. Guarda
4. Recarga el navegador

**Ejemplo - Cambiar nombre del torneo:**
```json
{
  "torneoInfo": {
    "nombre": "Copa Corrientes Diversa 2025"  👈 Edita aquí
  }
}
```

### Para agregar documentos (PDFs, Excel):

1. Copia el archivo a la carpeta correspondiente:
   - `static/reglamentos/` → PDFs de reglamentos
   - `static/fixtures/` → PDFs de fixtures
   - `static/planillas/` → Archivos Excel

2. Actualiza la ruta en `data.json`:
```json
{
  "deportes": [
    {
      "id": "voley",
      "reglamento": "/reglamentos/tu-archivo.pdf"  👈 Ruta del archivo
    }
  ]
}
```

---

## 📂 Estructura Simple

```
copa-corrientes-diversa/
│
├── static/
│   ├── data.json          ← ⭐ EDITA AQUÍ para cambiar contenido
│   ├── banners/           ← Imágenes del sitio
│   ├── auspiciantes/      ← Logos de sponsors
│   ├── reglamentos/       ← PDFs de reglamentos
│   ├── fixtures/          ← PDFs de fixtures
│   └── planillas/         ← Excel de inscripción
│
└── src/
    └── routes/            ← Páginas del sitio
```

---

## 🛠️ Comandos Útiles

```bash
npm run dev              # Iniciar desarrollo
npm run dev -- --host    # Ver en tu móvil (misma red WiFi)
npm run build            # Compilar para producción
npm run preview          # Ver versión de producción
npm run check            # Verificar errores
```

---

## 📚 Documentación

- **INICIO-RAPIDO.md** → Guía detallada de inicio
- **MIGRACION-COMPLETA.md** → Explicación técnica completa
- **ESTRUCTURA-VISUAL.txt** → Visualización del proyecto
- **README.md** → Documentación completa

---

## 🎨 Personalizar Colores

Edita `src/app.css` y busca:

```css
background: linear-gradient(90deg, #062a85 60%, #3a7bd5 100%);
```

Cambia `#062a85` y `#3a7bd5` por tus colores preferidos.

---

## 📱 Ver en tu Móvil

1. Inicia el servidor con:
   ```bash
   npm run dev -- --host
   ```

2. En tu móvil (misma red WiFi), abre:
   ```
   http://TU-IP-LOCAL:5173
   ```
   
   (Tu IP aparecerá en la terminal cuando ejecutes el comando)

---

## 🚀 Publicar en Internet

### Opción 1: Vercel (Gratis y Fácil)

1. Crea cuenta en https://vercel.com
2. Conecta tu repositorio Git
3. ¡Listo! Se publica automáticamente

### Opción 2: Netlify (Gratis)

1. Ejecuta: `npm run build`
2. Arrastra la carpeta `build` a https://app.netlify.com/drop
3. ¡Publicado!

---

## ❓ Problemas Comunes

### No se ven los datos
→ Verifica que `static/data.json` sea JSON válido en https://jsonlint.com

### No se ven las imágenes
→ Verifica que las rutas empiecen con `/`
- ✅ Correcto: `/banners/imagen.png`
- ❌ Incorrecto: `banners/imagen.png`

### Error al instalar
```bash
rm -rf node_modules
npm install
```

---

## 🏳️‍🌈 ¡Listo para Usar!

Tu aplicación está **100% funcional** y lista para:
- ✅ Mostrar información del torneo
- ✅ Listar todos los deportes
- ✅ Mostrar detalles de cada deporte
- ✅ Descargar reglamentos y planillas
- ✅ Ver auspiciantes
- ✅ Contactar por WhatsApp

**¡Éxito con tu torneo! 🎉**

---

**Fundación Corrientes Diversa**  
🌐 Instagram: [@fundacionctesdiversa.ok](https://www.instagram.com/fundacionctesdiversa.ok/)  
📱 WhatsApp: +54 379 476-5770

