# Equivalencias de Clases CSS a Tailwind

Este archivo muestra las clases de Tailwind equivalentes a las clases CSS personalizadas que se eliminaron.

## Navbar

### Antes (CSS personalizado):

```css
.navbar-flowbite {
  background: linear-gradient(to right, #0f172a, #1e293b, #0f172a);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

### Ahora (Tailwind - Estilo Flowbite):

```html
<nav
  class="bg-white border-gray-200 dark:bg-gray-900 sticky top-0 z-50 shadow-lg"
>
  <div
    class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4"
  >
    <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
      <img src="/logo.png" class="h-8" alt="Logo" />
      <span
        class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
        >Brand</span
      >
    </a>
    <!-- Menú y dropdown aquí -->
  </div>
</nav>
```

## Botones

### Antes (CSS personalizado):

```css
.btn {
  border-radius: 8px;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.btn-primary {
  background: linear-gradient(90deg, #062a85 60%, #3a7bd5 100%);
  color: white;
}
```

### Ahora (Tailwind):

```html
<button
  class="rounded-lg transition-all duration-200 px-5 py-2.5 border-none cursor-pointer font-medium bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white hover:shadow-lg"
></button>
```

## Cards

### Antes (CSS personalizado):

```css
.card {
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  margin-bottom: 18px;
  overflow: hidden;
  background: white;
  border: 1px solid #e0e0e0;
}
```

### Ahora (Tailwind):

```html
<div
  class="rounded-2xl shadow-sm mb-4 overflow-hidden bg-white border border-gray-200"
></div>
```

## Grids

### Antes (CSS personalizado):

```css
.deportes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px 0;
}
```

### Ahora (Tailwind):

```html
<div
  class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 py-5"
></div>
```

## Títulos

### Antes (CSS personalizado):

```css
.titulo {
  font-family: "Century Gothic", CenturyGothic, AppleGothic, sans-serif;
  color: #fff;
  font-size: 1.3rem;
  font-weight: 500;
  text-align: center;
  background: linear-gradient(90deg, #062a85 60%, #3a7bd5 100%);
  margin: 0 0 25px;
  padding: 20px 10px;
  border-radius: 35px 0px 35px 0px;
  border: 2px solid #030f2e;
  box-shadow: 0 4px 16px rgba(6, 42, 133, 0.08);
}
```

### Ahora (Tailwind):

```html
<h1
  class="font-['Century_Gothic'] text-white text-xl font-medium text-center bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 mb-6 px-2.5 py-5 rounded-[35px_0_35px_0] border-2 border-slate-900 shadow-lg"
></h1>
```

## Paneles

### Antes (CSS personalizado):

```css
.panel-seccion {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 20px auto;
  padding: 18px 10px;
  border: 1px solid #e0e0e0;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}
```

### Ahora (Tailwind):

```html
<div
  class="w-full max-w-6xl mx-auto mb-5 px-2.5 py-4.5 border border-gray-200 bg-white rounded-2xl shadow-sm"
></div>
```

## Tablas

### Antes (CSS personalizado):

```css
.table {
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 0;
  width: 100%;
  border-collapse: collapse;
}

.table th {
  background: #f8f9fa;
  font-weight: 600;
}
```

### Ahora (Tailwind):

```html
<table class="rounded-xl overflow-hidden mb-0 w-full border-collapse">
  <thead>
    <tr>
      <th class="bg-gray-50 font-semibold">Header</th>
    </tr>
  </thead>
</table>
```

## Utilidades

### Antes (CSS personalizado):

```css
.text-center {
  text-align: center;
}
.mt-2 {
  margin-top: 0.5rem;
}
.mb-4 {
  margin-bottom: 1.5rem;
}
```

### Ahora (Tailwind - ya incluidas):

```html
<div class="text-center mt-2 mb-4"></div>
```

## Responsive

### Antes (CSS personalizado):

```css
@media (max-width: 768px) {
  .panel-seccion {
    width: 99%;
    padding: 8px 2px;
  }
}
```

### Ahora (Tailwind):

```html
<div
  class="w-full max-w-6xl mx-auto mb-5 px-2.5 py-4.5 max-md:w-[99%] max-md:px-0.5 max-md:py-2"
></div>
```
