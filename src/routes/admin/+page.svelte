<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  let stats = {
    organizadores: 0,
    torneos: 0,
    banners: 0,
    deportes: 0,
    sponsors: 0,
    equipos: 0,
    podios: 0,
  };

  onMount(async () => {
    await loadStats();
  });

  async function loadStats() {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        stats = await response.json();
      }
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    }
  }
</script>

<svelte:head>
  <title>Dashboard - Panel de Administración</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-8">
  <!-- Dashboard Header -->
  <div class="text-center mb-12 text-gray-700">
    <h1 class="text-4xl font-bold mb-4 drop-shadow-lg">
      Panel de Administración
    </h1>
    <p class="text-lg opacity-90">
      Gestiona todos los aspectos del torneo Copa Corrientes Diversa
    </p>
  </div>

  <!-- Quick Actions -->
  <div class="bg-white rounded-2xl p-8 shadow-lg">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
      🚀 Acciones Rápidas
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <a
        href="/admin/torneo"
        class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 text-gray-800 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-indigo-300 group"
      >
        <div class="text-3xl mb-4">🏆</div>
        <h3 class="font-semibold mb-2">Editar Torneo</h3>
        <p class="text-sm text-gray-600">
          Modificar información del torneo principal
        </p>
      </a>

      <a
        href="/admin/deportes"
        class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 text-gray-800 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-indigo-300 group"
      >
        <div class="text-3xl mb-4">⚽</div>
        <h3 class="font-semibold mb-2">Gestionar Deportes</h3>
        <p class="text-sm text-gray-600">
          Agregar o editar deportes del torneo
        </p>
      </a>

      <a
        href="/admin/sponsors"
        class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 text-gray-800 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-indigo-300 group"
      >
        <div class="text-3xl mb-4">💼</div>
        <h3 class="font-semibold mb-2">Sponsors</h3>
        <p class="text-sm text-gray-600">Administrar patrocinadores</p>
      </a>

      <a
        href="/admin/config"
        class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 text-gray-800 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-indigo-300 group"
      >
        <div class="text-3xl mb-4">⚙️</div>
        <h3 class="font-semibold mb-2">Configuración</h3>
        <p class="text-sm text-gray-600">Ajustar configuración general</p>
      </a>
    </div>
  </div>
</div>

<!-- Todo convertido a clases de Tailwind CSS -->
