<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  // Props
  export let currentUser: any = null;
  export let onLogout: () => void;

  // Estado del sidebar
  let sidebarOpen = false;
  let sidebarElement: HTMLElement;

  // Función para cerrar sesión
  function handleLogout() {
    if (onLogout) {
      onLogout();
    }
  }

  // Función para determinar si un enlace está activo
  function isActive(path: string): boolean {
    const currentPath = $page.url.pathname;

    // Caso especial para dashboard (página raíz del admin)
    if (path === "/admin" && currentPath === "/admin") {
      return true;
    }

    // Para otras rutas, verificar si la ruta actual comienza con la ruta del enlace
    if (path !== "/admin" && currentPath.startsWith(path)) {
      return true;
    }

    return false;
  }

  // Variables reactivas para cada enlace - dependen directamente de $page
  $: currentPath = $page.url.pathname;
  $: isDashboardActive = currentPath === "/admin";
  $: isConfigActive = currentPath === "/admin/config";
  $: isOrganizadorActive = currentPath === "/admin/organizador";
  $: isTorneoActive = currentPath === "/admin/torneo";
  $: isBannersActive = currentPath === "/admin/banners";
  $: isDeportesActive = currentPath.startsWith("/admin/deportes");
  $: isSponsorsActive = currentPath === "/admin/sponsors";
  $: isEquiposActive = currentPath === "/admin/equipos";
  $: isPodiosActive = currentPath === "/admin/podios";

  // Función para toggle del sidebar
  function toggleSidebar(event: MouseEvent) {
    event.stopPropagation(); // Prevenir que se propague el evento
    sidebarOpen = !sidebarOpen;
    if (sidebarElement) {
      if (sidebarOpen) {
        sidebarElement.classList.remove("-translate-x-full");
        sidebarElement.classList.add("translate-x-0");
      } else {
        sidebarElement.classList.remove("translate-x-0");
        sidebarElement.classList.add("-translate-x-full");
      }
    }
  }

  // Función para cerrar sidebar
  function closeSidebar() {
    sidebarOpen = false;
    if (sidebarElement) {
      sidebarElement.classList.remove("translate-x-0");
      sidebarElement.classList.add("-translate-x-full");
    }
  }

  // Función para manejar navegación con goto
  function handleNavigation(path: string) {
    goto(path);
    // Solo cerrar en móvil (pantallas pequeñas)
    if (window.innerWidth < 640) {
      closeSidebar();
    }
  }

  // Cerrar sidebar al hacer clic fuera
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const hamburgerButton = document.querySelector(
      '[aria-controls="admin-sidebar"]'
    );

    // No cerrar si se hace clic en el botón hamburguesa o dentro del sidebar
    if (
      sidebarOpen &&
      !sidebarElement?.contains(target) &&
      !hamburgerButton?.contains(target)
    ) {
      closeSidebar();
    }
  }

  onMount(() => {
    // Agregar event listener para cerrar al hacer clic fuera
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });
</script>

<!-- Botón para abrir/cerrar sidebar en móvil -->
<button
  on:click={toggleSidebar}
  aria-controls="admin-sidebar"
  type="button"
  class="fixed top-20 left-4 z-50 inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white shadow-lg"
>
  <span class="sr-only">Abrir sidebar</span>
  <svg
    class="w-6 h-6"
    aria-hidden="true"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clip-rule="evenodd"
      fill-rule="evenodd"
      d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
    ></path>
  </svg>
</button>

<!-- Overlay para móvil -->
{#if sidebarOpen}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
    on:click={closeSidebar}
    on:keydown={(e) => e.key === "Escape" && closeSidebar()}
    role="button"
    tabindex="0"
  ></div>
{/if}

<!-- Sidebar -->
<aside
  bind:this={sidebarElement}
  id="admin-sidebar"
  class="fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] transition-transform -translate-x-full sm:translate-x-0"
  aria-label="Sidebar"
>
  <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
    <!-- Botón cerrar para móvil -->
    <div class="flex justify-end mb-4 sm:hidden">
      <button
        on:click={closeSidebar}
        class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg"
        aria-label="Cerrar sidebar"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>

    <!-- Header del Sidebar -->
    <div class="mb-6">
      <div
        class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-lg mb-4"
      >
        <h1 class="text-lg font-bold">🏳️‍🌈 Panel Admin</h1>
        <p class="text-sm opacity-90">{currentUser?.email || "Usuario"}</p>
      </div>
    </div>

    <!-- Navegación Principal -->
    <ul class="space-y-2 font-medium">
      <li>
        <button
          on:click={() => handleNavigation("/admin")}
          class="w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group {isDashboardActive
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
            : ''}"
        >
          <svg
            class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 21"
          >
            <path
              d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"
            />
            <path
              d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"
            />
          </svg>
          <span class="ms-3">Dashboard</span>
        </button>
      </li>

      <li>
        <button
          on:click={() => handleNavigation("/admin/config")}
          class="w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group {isConfigActive
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
            : ''}"
        >
          <svg
            class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="ms-3">Configuración</span>
        </button>
      </li>

      <li>
        <button
          on:click={() => handleNavigation("/admin/organizador")}
          class="w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group {isOrganizadorActive
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
            : ''}"
        >
          <svg
            class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 18"
          >
            <path
              d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"
            />
          </svg>
          <span class="ms-3">Organizador</span>
        </button>
      </li>

      <li>
        <button
          on:click={() => handleNavigation("/admin/torneo")}
          class="w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group {isTorneoActive
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
            : ''}"
        >
          <svg
            class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 20"
          >
            <path
              d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z"
            />
          </svg>
          <span class="ms-3">Torneo</span>
        </button>
      </li>

      <li>
        <button
          on:click={() => handleNavigation("/admin/banners")}
          class="w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group {isBannersActive
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
            : ''}"
        >
          <svg
            class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="ms-3">Banners</span>
        </button>
      </li>

      <li>
        <button
          on:click={() => handleNavigation("/admin/deportes")}
          class="w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group {isDeportesActive
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
            : ''}"
        >
          <svg
            class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fill-rule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="ms-3">Deportes</span>
        </button>
      </li>

      <li>
        <button
          on:click={() => handleNavigation("/admin/sponsors")}
          class="w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group {isSponsorsActive
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
            : ''}"
        >
          <svg
            class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
          <span class="ms-3">Sponsors</span>
        </button>
      </li>

      <li>
        <button
          on:click={() => handleNavigation("/admin/equipos")}
          class="w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group {isEquiposActive
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
            : ''}"
        >
          <svg
            class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 18"
          >
            <path
              d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"
            />
          </svg>
          <span class="ms-3">Equipos</span>
        </button>
      </li>

      <li>
        <button
          on:click={() => handleNavigation("/admin/podios")}
          class="w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group {isPodiosActive
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
            : ''}"
        >
          <svg
            class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
          <span class="ms-3">Podios</span>
        </button>
      </li>
    </ul>

    <!-- Separador -->
    <div class="my-6 border-t border-gray-200 dark:border-gray-700"></div>

    <!-- Botón de Cerrar Sesión -->
    <div class="px-2">
      <button
        on:click={handleLogout}
        class="w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-red-100 dark:hover:bg-red-900 group"
      >
        <svg
          class="w-5 h-5 text-red-500 transition duration-75 dark:text-red-400 group-hover:text-red-600"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 16"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
          />
        </svg>
        <span class="ms-3 text-red-600 dark:text-red-400">Cerrar Sesión</span>
      </button>
    </div>
  </div>
</aside>
