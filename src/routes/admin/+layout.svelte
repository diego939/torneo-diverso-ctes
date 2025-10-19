<script lang="ts">
  import { onMount } from "svelte";
  import LoginForm from "$lib/components/LoginForm.svelte";
  import AdminSidebar from "$lib/components/AdminSidebar.svelte";

  export const data = undefined;

  let isAuthenticated = false;
  let currentUser: any;

  onMount(() => {
    // Verificar autenticación básica
    const storedUser = localStorage.getItem("admin_user");
    if (storedUser) {
      isAuthenticated = true;
      currentUser = JSON.parse(storedUser);
    }
  });

  function logout() {
    localStorage.removeItem("admin_user");
    isAuthenticated = false;
    currentUser = null;
  }

  function handleLogin(event: CustomEvent<any>) {
    isAuthenticated = true;
    currentUser = event.detail;
  }
</script>

<svelte:head>
  <title>Panel de Administración - Copa Corrientes Diversa</title>
  <script
    src="https://cdn.jsdelivr.net/npm/flowbite@2.2.1/dist/flowbite.min.js"
  ></script>
</svelte:head>

<div class="min-h-screen">
  {#if isAuthenticated}
    <!-- Sidebar de administración -->
    <AdminSidebar {currentUser} onLogout={logout} />

    <!-- Contenido principal -->
    <div class="p-4 sm:ml-64">
      <div class="min-h-screen">
        <slot />
      </div>
    </div>
  {:else}
    <div class="flex justify-center items-center min-h-screen p-8">
      <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 class="text-center mb-8 text-2xl font-bold text-gray-800">
          🔐 Acceso al Panel de Administración
        </h2>
        <LoginForm
          bind:isAuthenticated
          bind:currentUser
          on:login={handleLogin}
        />
      </div>
    </div>
  {/if}
</div>

<!-- Todo convertido a clases de Tailwind CSS -->
