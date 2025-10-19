<script lang="ts">
  import { page } from "$app/stores";

  // Props
  export let currentUser: any = null;
  export let onLogout: () => void;

  // Función para cerrar sesión
  function handleLogout() {
    if (onLogout) {
      onLogout();
    }
  }

  // Función para determinar si un enlace está activo
  function isActive(path: string): boolean {
    return $page.url.pathname === path;
  }
</script>

<div
  class="bg-white shadow-lg border-b border-gray-200 fixed top-[72px] left-0 right-0"
  style="z-index: 50;"
>
  <!-- Header con logo y usuario -->
  <div
    class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4"
  >
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div class="flex items-center justify-center sm:justify-start space-x-3">
        <div>
          <h1 class="text-xl font-bold">🏳️‍🌈 {currentUser.email}</h1>
        </div>
      </div>

      {#if currentUser}
        <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <button
            on:click={handleLogout}
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <i class="bi bi-box-arrow-right"></i>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      {/if}
    </div>
  </div>

  <!-- Botonera de navegación -->
  <div class="px-6 py-4 bg-gray-50">
    <div class="flex flex-wrap gap-2">
      <a
        href="/admin"
        class="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 {isActive(
          '/admin'
        )
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-200'}"
      >
        <i class="bi bi-speedometer2"></i>
        <span>Dashboard</span>
      </a>

      <a
        href="/admin/config"
        class="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 {isActive(
          '/admin/config'
        )
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-200'}"
      >
        <i class="bi bi-gear-fill"></i>
        <span>Configuración</span>
      </a>

      <a
        href="/admin/organizador"
        class="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 {isActive(
          '/admin/organizador'
        )
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-200'}"
      >
        <i class="bi bi-person-badge"></i>
        <span>Organizador</span>
      </a>

      <a
        href="/admin/torneo"
        class="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 {isActive(
          '/admin/torneo'
        )
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-200'}"
      >
        <i class="bi bi-trophy"></i>
        <span>Torneo</span>
      </a>

      <a
        href="/admin/banners"
        class="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 {isActive(
          '/admin/banners'
        )
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-200'}"
      >
        <i class="bi bi-images"></i>
        <span>Banners</span>
      </a>

      <a
        href="/admin/deportes"
        class="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 {isActive(
          '/admin/deportes'
        )
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-200'}"
      >
        <i class="bi bi-ball-heart"></i>
        <span>Deportes</span>
      </a>

      <a
        href="/admin/sponsors"
        class="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 {isActive(
          '/admin/sponsors'
        )
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-200'}"
      >
        <i class="bi bi-hand-thumbs-up"></i>
        <span>Sponsors</span>
      </a>

      <a
        href="/admin/equipos"
        class="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 {isActive(
          '/admin/equipos'
        )
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-200'}"
      >
        <i class="bi bi-people"></i>
        <span>Equipos</span>
      </a>

      <a
        href="/admin/podios"
        class="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 {isActive(
          '/admin/podios'
        )
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-200'}"
      >
        <i class="bi bi-award"></i>
        <span>Podios</span>
      </a>
    </div>
  </div>
</div>
