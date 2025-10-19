# Copa Corrientes Diversa 2024

Landing page dinámica para el torneo internacional mixto de deportes LGBTQ+ en Corrientes, Argentina.

## 🏆 Características

- **Diseño Responsivo**: Optimizado para dispositivos móviles y desktop
- **Rutas Dinámicas**: Navegación fluida entre secciones
- **Datos Editables**: Sistema de datos JSON para fácil actualización
- **Secciones**:
  - 🏠 Página principal con información del torneo
  - 🏅 Listado de deportes con filtros
  - 📋 Detalle de cada deporte (reglamento, fixture, planillas)
  - 🌟 Auspiciantes
  - 📱 Integración con WhatsApp e Instagram

## 🚀 Tecnologías

- **SvelteKit 2** - Framework principal
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **CSS Vanilla** - Estilos personalizados

## 📁 Estructura del Proyecto

```
copa-corrientes-diversa/
├── src/
│   ├── lib/
│   │   ├── data.json              # Datos del torneo
│   │   └── stores/
│   │       └── dataStore.ts       # Store de Svelte para datos
│   ├── routes/
│   │   ├── +layout.svelte         # Layout principal con navbar
│   │   ├── +page.svelte           # Página de inicio
│   │   ├── deportes/
│   │   │   ├── +page.svelte       # Lista de deportes
│   │   │   └── [id]/
│   │   │       └── +page.svelte   # Detalle de deporte
│   │   └── sponsors/
│   │       └── +page.svelte       # Auspiciantes
│   └── app.css                    # Estilos globales
├── static/
│   ├── data.json                  # Datos públicos
│   ├── banners/                   # Imágenes de banners
│   ├── auspiciantes/              # Logos de sponsors
│   ├── planillas/                 # Planillas de inscripción
│   ├── reglamentos/               # PDFs de reglamentos
│   └── fixtures/                  # PDFs de fixtures
└── package.json
```

## 🛠️ Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+ 
- npm o pnpm

### Instalación

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Abrir en el navegador
# http://localhost:5173
```

### Producción

```bash
# Build para producción
npm run build

# Preview del build
npm run preview
```

## 📝 Editar Contenido

### 1. Editar Información del Torneo

Edita el archivo `static/data.json`:

```json
{
  "torneoInfo": {
    "nombre": "Copa Corrientes Diversa 2024",
    "descripcion": "Tu descripción aquí...",
    ...
  }
}
```

### 2. Agregar/Editar Deportes

```json
{
  "deportes": [
    {
      "id": "voley",
      "nombre": "Voley",
      "planilla": "/planillas/voley.xlsx",
      "reglamento": "/reglamentos/reglamento-voley.pdf",
      ...
    }
  ]
}
```

### 3. Agregar Auspiciantes

1. Sube el logo a `static/auspiciantes/`
2. Agrega al JSON:

```json
{
  "sponsors": [
    {
      "id": "sponsor-001",
      "nombre": "Nombre del Sponsor",
      "urlImage": "/auspiciantes/logo.jpg",
      ...
    }
  ]
}
```

### 4. Agregar Documentos

- **Reglamentos**: Coloca PDFs en `static/reglamentos/`
- **Fixtures**: Coloca PDFs en `static/fixtures/`
- **Planillas**: Coloca archivos Excel en `static/planillas/`

Luego actualiza la URL en el deporte correspondiente en `data.json`.

## 🎨 Personalización de Estilos

Los estilos globales están en `src/app.css`. Para personalizar colores:

```css
/* Cambiar color principal */
.titulo {
  background: linear-gradient(90deg, #TU_COLOR 60%, #OTRO_COLOR 100%);
}
```

## 📱 Contacto e Integración

### WhatsApp
Actualiza el número en `data.json`:
```json
{
  "organizador": {
    "celularWhatsapp": "+543794765770"
  }
}
```

### Redes Sociales
Los enlaces de Instagram y Facebook están en el navbar (`src/routes/+layout.svelte`).

## 🔄 Actualizar en Vivo

1. Edita `static/data.json`
2. Recarga la página - los cambios se aplicarán automáticamente
3. No necesitas rebuild para cambios en JSON

## 📦 Deploy

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Sube la carpeta 'build'
```

### GitHub Pages
Requiere adapter estático. Ver documentación de SvelteKit.

## 🤝 Contribuir

Este proyecto fue creado para la Fundación Corrientes Diversa. Para contribuir o reportar issues, contacta al equipo de desarrollo.

## 📄 Licencia

© 2024 Fundación Corrientes Diversa. Todos los derechos reservados.

## 🏳️‍🌈 Créditos

Desarrollado con ❤️ para promover la diversidad y el deporte inclusivo en Corrientes, Argentina.

---

**Contacto**: 
- 📧 Email: contacto@corrientesdiversa.org
- 📱 WhatsApp: +54 379 476-5770
- 📸 Instagram: [@fundacionctesdiversa.ok](https://www.instagram.com/fundacionctesdiversa.ok/)
