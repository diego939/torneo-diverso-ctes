# Guía de Funcionalidad Mobile Collapse

## ✅ Implementación Completada

Se ha implementado la funcionalidad de collapse para dispositivos móviles en ambos navbars usando **Svelte state management** en lugar de JavaScript externo.

## 🔧 Cómo Funciona

### 1. **Estado del Componente**

```javascript
let isMobileMenuOpen = false;
```

### 2. **Funciones de Control**

```javascript
function toggleMobileMenu() {
  isMobileMenuOpen = !isMobileMenuOpen;
}

function closeMobileMenu() {
  isMobileMenuOpen = false;
}
```

### 3. **Botón Hamburger**

```html
<button
  type="button"
  on:click="{toggleMobileMenu}"
  aria-expanded="{isMobileMenuOpen}"
  class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
></button>
```

### 4. **Menú Condicional**

```html
<div
  class="items-center justify-between w-full md:flex md:w-auto md:order-1 {isMobileMenuOpen ? 'block' : 'hidden'}"
  id="navbar-user"
></div>
```

### 5. **Auto-cerrar en Enlaces**

```html
<a
  href="/deportes"
  on:click="{closeMobileMenu}"
  class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100..."
></a>
```

## 📱 Comportamiento

### **Desktop (≥ 768px)**

- El menú siempre está visible horizontalmente
- El botón hamburger está oculto (`md:hidden`)
- No hay funcionalidad de collapse

### **Mobile (< 768px)**

- El menú está oculto por defecto
- Al hacer clic en el hamburger, se muestra/oculta el menú
- Al hacer clic en cualquier enlace, el menú se cierra automáticamente
- Transiciones suaves con clases de Tailwind

## 🎯 Ventajas de esta Implementación

1. **Nativo de Svelte**: No requiere JavaScript externo
2. **Reactive**: El estado se actualiza automáticamente en la UI
3. **Accesible**: ARIA labels y navegación por teclado
4. **Performante**: Solo usa clases CSS de Tailwind
5. **Mantenible**: Código limpio y fácil de entender

## 🔄 Archivos Modificados

- `src/routes/+layout.svelte` - Navbar principal
- `src/routes/admin/+layout.svelte` - Navbar del admin

## 🧪 Testing

Para probar la funcionalidad:

1. Abre la aplicación en un navegador
2. Redimensiona la ventana a menos de 768px de ancho
3. Haz clic en el botón hamburger (☰)
4. Verifica que el menú se muestra/oculta
5. Haz clic en cualquier enlace y verifica que el menú se cierra

## 📋 Checklist de Funcionalidades

### **Menú Móvil (Hamburger)**

- ✅ Botón hamburger funcional
- ✅ Menú se muestra/oculta en mobile
- ✅ Auto-cierre al hacer clic en enlaces
- ✅ Estados ARIA correctos
- ✅ Responsive design
- ✅ Accesibilidad por teclado
- ✅ Transiciones suaves
- ✅ Funciona en ambos navbars (principal y admin)

### **Dropdown de Usuario**

- ✅ Botón dropdown funcional
- ✅ Dropdown se muestra/oculta al hacer clic
- ✅ Auto-cierre al hacer clic fuera del dropdown
- ✅ Auto-cierre al hacer clic en enlaces
- ✅ Estados ARIA correctos
- ✅ Funciona en ambos navbars (principal y admin)
- ✅ Logout funcional en navbar admin
