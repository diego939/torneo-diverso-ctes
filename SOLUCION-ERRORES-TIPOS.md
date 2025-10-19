# 🔧 Solución de Errores de Tipos

## ⚠️ Error Actual

Si ves errores como:

```
Property 'sponsors' does not exist on type '{}'
Property 'organizador' does not exist on type '{}'
```

## ✅ Solución

SvelteKit genera automáticamente los tipos en `./$types`. Solo necesitas sincronizarlos:

### Paso 1: Detén el servidor si está corriendo

```bash
# Presiona Ctrl+C en la terminal donde corre npm run dev
```

### Paso 2: Sincroniza SvelteKit

```bash
npx svelte-kit sync
```

### Paso 3: Reinicia el servidor

```bash
npm run dev
```

## 🎯 Explicación

Los archivos `+page.server.ts` y `+layout.server.ts` que creamos definen qué datos se pasan a los componentes. SvelteKit genera automáticamente los tipos en archivos `./$types` para que tengas autocompletado.

Cuando creas nuevos archivos `+page.server.ts`, necesitas ejecutar `svelte-kit sync` para que genere los tipos correspondientes.

## 🔍 Verificación

Después de sincronizar, deberías ver:

1. **En el editor**: Autocompletado funcionando
2. **Sin errores**: TypeScript no muestra errores
3. **Tipos inferidos**: Puedes hacer hover sobre `data` y ver los tipos

## 🚀 Todo Debería Funcionar

Incluso si ves esos errores en el editor, **la aplicación funcionará correctamente** porque los tipos son solo para desarrollo.

Pero es mejor sincronizar para tener autocompletado y validación.

## 📝 Para el Futuro

Cada vez que crees un nuevo archivo `+page.server.ts` o `+layout.server.ts`:

```bash
npx svelte-kit sync
```

O simplemente reinicia `npm run dev` (lo hace automáticamente).

---

**¿Los errores persisten?**

- Reinicia tu editor (VSCode, etc.)
- Ejecuta `npm run dev` de nuevo
- Verifica que las dependencias estén instaladas: `npm install`

