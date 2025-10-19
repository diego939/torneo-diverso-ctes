<script lang="ts">
  import "../app.css";
  import type { LayoutData } from "./$types";
  import { onMount, onDestroy } from "svelte";
  import { goto } from "$app/navigation";
  import { navigating } from "$app/stores";
  import ToastContainer from "$lib/components/ToastContainer.svelte";

  export let data: LayoutData;

  // Usar los datos que vienen del servidor
  $: org = data.organizador;

  // Estado para el menú móvil
  let isMobileMenuOpen = false;
  // Estado para el dropdown de usuario
  let isUserDropdownOpen = false;

  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }

  function closeMobileMenu() {
    isMobileMenuOpen = false;
  }

  function toggleUserDropdown() {
    isUserDropdownOpen = !isUserDropdownOpen;
  }

  function closeUserDropdown() {
    isUserDropdownOpen = false;
  }

  // Navigation functions
  function navigateTo(path: string) {
    goto(path);
    closeMobileMenu();
  }

  // Cerrar dropdown al hacer clic fuera
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const userButton = document.getElementById("user-menu-button");
    const userDropdown = document.getElementById("user-dropdown");

    if (
      userButton &&
      userDropdown &&
      !userButton.contains(target) &&
      !userDropdown.contains(target)
    ) {
      closeUserDropdown();
    }
  }

  // Agregar event listener cuando el componente se monta
  onMount(() => {
    if (typeof document !== "undefined") {
      document.addEventListener("click", handleClickOutside);
    }
  });

  onDestroy(() => {
    if (typeof document !== "undefined") {
      document.removeEventListener("click", handleClickOutside);
    }
  });
</script>

<nav
  class="bg-white border-gray-200 dark:bg-gray-900 sticky top-0 z-50 shadow-lg"
>
  <div
    class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4"
  >
    <button
      on:click={() => navigateTo("/")}
      class="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer"
    >
      <img
        src="/images/fundaac-logo.png"
        class="h-8"
        alt="Fundación Corrientes Diversa"
      />
      <span
        class="self-center text-xs md:text-sm lg:text-md font-semibold whitespace-nowrap dark:text-white"
        >Copa Corrientes Diversa</span
      >
    </button>

    <div
      class="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse"
    >
      <button
        type="button"
        class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        on:click={toggleMobileMenu}
        aria-expanded={isMobileMenuOpen}
        aria-controls="navbar-user"
      >
        <span class="sr-only">Open main menu</span>
        <svg
          class="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 17 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </button>
    </div>

    <div
      class="items-center justify-between w-full md:flex md:w-auto md:order-1 {isMobileMenuOpen
        ? 'block'
        : 'hidden'}"
      id="navbar-user"
    >
      <ul
        class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
      >
        <li>
          <button
            on:click={() => navigateTo("/deportes")}
            class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 w-full text-left"
          >
            <i class="bi bi-trophy-fill mr-2"></i>Deportes
          </button>
        </li>
        <li>
          <button
            on:click={() => navigateTo("/sponsors")}
            class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 w-full text-left"
          >
            <i class="bi bi-star-fill mr-2"></i>Sponsors
          </button>
        </li>
        <li>
          <button
            on:click={() => navigateTo("/podios")}
            class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 w-full text-left"
          >
            <i class="bi bi-trophy-fill mr-2"></i>Podios
          </button>
        </li>
        <li>
          <a
            href="https://www.instagram.com/fundacionctesdiversa.ok/"
            target="_blank"
            class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
            on:click={closeMobileMenu}
          >
            <i class="bi bi-instagram mr-2"></i>Instagram
          </a>
        </li>
        {#if org?.celularWhatsapp}
          <li>
            <a
              href="https://wa.me/{org.celularWhatsapp}"
              target="_blank"
              class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              on:click={closeMobileMenu}
            >
              <i class="bi bi-whatsapp mr-2"></i>{org.nombreRedes || "Contacto"}
            </a>
          </li>
        {/if}
        <li>
          <button
            on:click={() => navigateTo("/admin")}
            class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 w-full text-left"
          >
            <i class="bi bi-person-fill mr-2"></i>Admin
          </button>
        </li>
      </ul>
    </div>
  </div>
</nav>

<!-- Navigation Spinner -->
{#if $navigating}
  <div class="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
    <div class="h-full bg-blue-600 animate-pulse"></div>
  </div>
  <div
    class="fixed inset-0 bg-black bg-opacity-10 z-40 flex items-center justify-center"
  >
    <div class="bg-white rounded-lg p-6 shadow-lg flex items-center space-x-3">
      <div
        class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"
      ></div>
      <span class="text-gray-700">Cargando...</span>
    </div>
  </div>
{/if}

<main class="min-h-[calc(100vh-200px)] py-5">
  <slot />
</main>

<footer class="text-center py-8 bg-black text-white mt-12">
  <div class="max-w-4xl mx-auto px-4">
    <div class="mb-6">
      <p class="text-sm font-semibold mb-2">
        Copa Corrientes Diversa {data.config?.anio} 🏳️‍🌈
      </p>
    </div>

    <!-- Redes Sociales -->
    <div class="flex justify-center gap-6 mb-6">
      <a
        href="https://www.instagram.com/fundacionctesdiversa.ok/"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
      >
        <i class="bi bi-instagram text-lg"></i>
        <span class="hidden sm:inline">Instagram</span>
      </a>

      {#if org?.celularWhatsapp}
        <a
          href="https://wa.me/{org.celularWhatsapp}"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
        >
          <i class="bi bi-whatsapp text-lg"></i>
          <span class="hidden sm:inline">{org.nombreRedes || "WhatsApp"}</span>
        </a>
      {/if}
    </div>

    <div class="border-t border-gray-700 pt-4">
      <p class="text-sm text-gray-400">© DiegoDavid17</p>
    </div>
  </div>
</footer>

<!-- Toast Container -->
<ToastContainer />

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
  />
  <link rel="icon" href="/images/fundaac-logo.png" />
</svelte:head>
