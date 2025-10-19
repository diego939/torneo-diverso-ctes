<script lang="ts">
  import { onMount } from "svelte";
  import { invalidateAll } from "$app/navigation";
  import { toast } from "$lib/stores/toast";

  export let data;

  let config = data.config;
  let loading = false;

  let formData = {
    anio: config?.anio || new Date().getFullYear(),
    descripcion: config?.descripcion || "",
  };

  async function saveConfig() {
    if (!formData.anio || !formData.descripcion) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    loading = true;

    try {
      const response = await fetch("/api/admin/config", {
        method: config ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        config = result;
        toast.success("Configuración guardada exitosamente");
        // Invalidar todos los datos para refrescar la página
        await invalidateAll();
      } else {
        const error = await response.json();
        toast.error(error.message || "Error al guardar");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Configuración - Panel de Administración</title>
</svelte:head>

<div class="max-w-4xl mx-auto p-8">
  <div class="text-center mb-8 text-gray-800">
    <h1 class="text-3xl mb-2 drop-shadow-lg">⚙️ Configuración General</h1>
    <p class="opacity-90">Gestiona la configuración principal del torneo</p>
  </div>

  <div class="bg-white rounded-2xl p-8 shadow-lg mb-8">
    <div class="mb-8">
      <h2 class="text-gray-800 mb-6 pb-2 border-b-2 border-indigo-500">
        📅 Información General
      </h2>

      <div class="mb-6">
        <label for="anio" class="block font-semibold text-gray-800 mb-2"
          >Año del Torneo:</label
        >
        <input
          id="anio"
          type="number"
          bind:value={formData.anio}
          min="2020"
          disabled={loading}
          class="w-full p-3 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      <div class="mb-6">
        <label for="descripcion" class="block font-semibold text-gray-800 mb-2"
          >Descripción:</label
        >
        <textarea
          id="descripcion"
          bind:value={formData.descripcion}
          rows="4"
          disabled={loading}
          placeholder="Descripción del torneo..."
          class="w-full p-3 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        ></textarea>
      </div>
    </div>

    <div class="text-center">
      <button
        on:click={saveConfig}
        disabled={loading}
        class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 py-4 px-8 rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
      >
        {loading ? "Guardando..." : "💾 Guardar Configuración"}
      </button>
    </div>
  </div>

  {#if config}
    <div class="bg-white rounded-2xl p-8 shadow-lg">
      <h2 class="text-gray-800 mb-6 pb-2 border-b-2 border-green-500">
        📋 Configuración Actual
      </h2>
      <div class="flex flex-col gap-4">
        <div class="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
          <strong class="text-gray-800">Año:</strong>
          {config.anio}
        </div>
        <div class="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
          <strong class="text-gray-800">Descripción:</strong>
          {config.descripcion}
        </div>
        <div class="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
          <strong class="text-gray-800">Última actualización:</strong>
          {new Date(config.updatedAt).toLocaleString()}
        </div>
      </div>
    </div>
  {/if}
</div>
