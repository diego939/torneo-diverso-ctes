<script lang="ts">
  import { onMount } from "svelte";
  import { toast } from "$lib/stores/toast";

  export let data;

  let podios = data.podios;
  let deportes = data.deportes;
  let loading = false;
  let editingPodio: any = null;
  let selectedDeporteId = "";

  let formData: any = {
    equipoNombre: "",
    puesto: "",
    deporteId: "",
  };

  let selectedEquipos: any[] = [];

  // Reactive filtered podios
  $: filteredPodios = selectedDeporteId
    ? podios.filter((p) => p.deporteId === parseInt(selectedDeporteId))
    : podios;

  // Reactive filtered deportes (for display)
  $: filteredDeportes = selectedDeporteId
    ? deportes.filter((d) => d.id === parseInt(selectedDeporteId))
    : deportes;

  onMount(() => {
    loadPodios();
  });

  async function loadPodios() {
    try {
      const url = selectedDeporteId
        ? `/api/admin/podios?deporteId=${selectedDeporteId}`
        : "/api/admin/podios";
      const response = await fetch(url);
      if (response.ok) {
        podios = await response.json();
      }
    } catch (error) {
      console.error("Error cargando podios:", error);
    }
  }

  function filterByDeporte(deporteId: string) {
    selectedDeporteId = deporteId;
    // No need to reload podios since we have reactive filtering
  }

  function openForm(podio: any = null) {
    editingPodio = podio;
    if (podio) {
      formData = {
        equipoNombre: podio.equipoNombre,
        puesto: podio.puesto.toString(),
        deporteId: podio.deporteId.toString(),
      };
    } else {
      formData = {
        equipoNombre: "",
        puesto: "",
        deporteId: "",
      };
    }

    // Update selected equipos when opening form
    updateSelectedEquipos();

    // Show the modal
    const modal = document.getElementById("podio-modal");
    if (modal) {
      modal.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");
    }
  }

  function closeForm() {
    // Hide the modal
    const modal = document.getElementById("podio-modal");
    if (modal) {
      modal.classList.add("hidden");
      modal.setAttribute("aria-hidden", "true");
    }

    editingPodio = null;
    formData = {
      equipoNombre: "",
      puesto: "",
      deporteId: "",
    };
    selectedEquipos = [];
  }

  async function savePodio() {
    if (!formData.equipoNombre) {
      toast.error("El nombre del equipo es requerido");
      return;
    }

    if (!formData.puesto) {
      toast.error("El puesto es requerido");
      return;
    }

    if (!formData.deporteId) {
      toast.error("El deporte es requerido");
      return;
    }

    const puesto = parseInt(formData.puesto);
    if (puesto < 1 || puesto > 10) {
      toast.error("El puesto debe estar entre 1 y 10");
      return;
    }

    loading = true;

    try {
      const dataToSend = {
        ...formData,
        puesto: puesto,
      };

      const url = editingPodio
        ? `/api/admin/podios/${editingPodio.id}`
        : "/api/admin/podios";

      const method = editingPodio ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        await loadPodios();
        closeForm();
        toast.success(
          editingPodio
            ? "Podio actualizado exitosamente"
            : "Podio creado exitosamente"
        );
      } else {
        const error = await response.json();
        toast.error(error.error || "Error al guardar");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      loading = false;
    }
  }

  async function deletePodio(podio: any) {
    if (
      !confirm(
        `¿Estás seguro de que quieres eliminar el puesto ${podio.puesto} de "${podio.equipoNombre}"?`
      )
    ) {
      return;
    }

    loading = true;

    try {
      const response = await fetch(`/api/admin/podios/${podio.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadPodios();
        toast.success("Podio eliminado exitosamente");
      } else {
        const error = await response.json();
        toast.error(error.error || "Error al eliminar");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      loading = false;
    }
  }

  function getEquiposByDeporte(deporteId: string) {
    const deporte = deportes.find((d: any) => d.id === parseInt(deporteId));
    return deporte?.equipos || [];
  }

  function getPuestoEmoji(puesto: number) {
    switch (puesto) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "🏅";
    }
  }

  function updateSelectedEquipos() {
    if (formData.deporteId) {
      selectedEquipos = getEquiposByDeporte(formData.deporteId);
    } else {
      selectedEquipos = [];
    }
  }

  function handleDeporteChange() {
    formData.equipoNombre = ""; // Reset team selection when sport changes
    updateSelectedEquipos();
  }
</script>

<svelte:head>
  <title>Podios - Panel de Administración</title>
</svelte:head>

<div class="max-w-6xl mx-auto p-8">
  <div class="text-center mb-8 text-gray-800 relative">
    <h1 class="text-3xl mb-2 drop-shadow-lg">
      <i class="bi bi-trophy-fill"></i> Gestión de Podios
    </h1>
    <p class="opacity-90 mb-4">
      Administra los resultados y podios de cada deporte
    </p>
    <button
      on:click={() => openForm()}
      class="bg-gradient-to-r from-green-800 to-teal-800 text-white border-0 py-3 px-6 rounded-lg font-semibold cursor-pointer transition-transform duration-300 hover:transform hover:-translate-y-0.5"
    >
      <i class="bi bi-plus-circle-fill"></i> Agregar Podio
    </button>
  </div>

  <!-- Filtro por deporte -->
  <div class="mb-6">
    <div class="bg-white rounded-lg p-4 shadow-lg">
      <label
        for="deporte-filter"
        class="block font-semibold text-gray-800 mb-2"
      >
        Filtrar por Deporte:
      </label>
      <select
        id="deporte-filter"
        bind:value={selectedDeporteId}
        on:change={() => filterByDeporte(selectedDeporteId)}
        class="w-full md:w-auto p-3 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500"
      >
        <option value="">Todos los deportes</option>
        {#each deportes as deporte}
          <option value={deporte.id}>{deporte.nombre}</option>
        {/each}
      </select>
    </div>
  </div>

  <!-- Podios agrupados por deporte -->
  {#each filteredDeportes as deporte}
    {@const deportePodios = filteredPodios.filter(
      (p) => p.deporteId === deporte.id
    )}
    {#if deportePodios.length > 0}
      <div class="mb-6 md:mb-8">
        <h2
          class="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center md:text-left"
        >
          {deporte.nombre}
        </h2>
        <div
          class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
        >
          <div class="overflow-x-auto">
            <table class="w-full min-w-[600px]">
              <thead
                class="bg-gradient-to-r from-yellow-600 to-orange-600 text-white"
              >
                <tr>
                  <th
                    class="px-3 md:px-6 py-3 md:py-4 text-center font-semibold text-sm md:text-base"
                    >Puesto</th
                  >
                  <th
                    class="px-3 md:px-6 py-3 md:py-4 text-left font-semibold text-sm md:text-base"
                    >Equipo/Participante</th
                  >
                  <th
                    class="px-3 md:px-6 py-3 md:py-4 text-center font-semibold text-sm md:text-base"
                    >Acciones</th
                  >
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                {#each deportePodios.sort((a, b) => a.puesto - b.puesto) as podio}
                  <tr class="hover:bg-gray-50 transition-colors duration-200">
                    <td class="px-3 md:px-6 py-3 md:py-4 text-center">
                      <div
                        class="flex items-center justify-center gap-1 md:gap-2"
                      >
                        <span class="text-lg md:text-2xl"
                          >{getPuestoEmoji(podio.puesto)}</span
                        >
                        <span class="font-bold text-sm md:text-lg"
                          >{podio.puesto}°</span
                        >
                      </div>
                    </td>
                    <td class="px-3 md:px-6 py-3 md:py-4">
                      <div
                        class="font-medium text-gray-900 text-sm md:text-base"
                      >
                        {podio.equipoNombre}
                      </div>
                    </td>
                    <td class="px-3 md:px-6 py-3 md:py-4 text-center">
                      <div class="flex justify-center gap-1 md:gap-2">
                        <button
                          on:click={() => openForm(podio)}
                          class="bg-transparent border-0 text-lg md:text-xl cursor-pointer p-1 rounded transition-colors duration-300 hover:bg-blue-50"
                          title="Editar podio"
                        >
                          ✏️
                        </button>
                        <button
                          on:click={() => deletePodio(podio)}
                          class="bg-transparent border-0 text-lg md:text-xl cursor-pointer p-1 rounded transition-colors duration-300 hover:bg-red-50"
                          title="Eliminar podio"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    {/if}
  {/each}

  {#if filteredPodios.length === 0}
    <div class="bg-white rounded-2xl p-12 shadow-lg text-center">
      <div class="text-6xl mb-4">🏅</div>
      <h2 class="text-gray-800 mb-4">
        {#if selectedDeporteId}
          No hay podios para {filteredDeportes[0]?.nombre || "este deporte"}
        {:else}
          No hay podios registrados
        {/if}
      </h2>
      <p class="text-gray-600 mb-6">
        {#if selectedDeporteId}
          Agrega los primeros podios para {filteredDeportes[0]?.nombre ||
            "este deporte"}.
        {:else}
          Comienza agregando los primeros podios para los deportes.
        {/if}
      </p>
    </div>
  {/if}

  <!-- Main modal -->
  <div
    id="podio-modal"
    tabindex="-1"
    aria-hidden="true"
    class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black bg-opacity-50"
  >
    <!-- Modal content -->
    <div
      class="relative bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col border border-gray-200"
    >
      <!-- Modal header -->
      <div
        class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200 flex-shrink-0 bg-gray-50"
      >
        <h3 class="text-xl font-semibold text-gray-800">
          {editingPodio ? "Editar Podio" : "Nuevo Podio"}
        </h3>
        <button
          type="button"
          class="text-gray-600 bg-transparent hover:bg-gray-200 hover:text-gray-800 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
          data-modal-hide="podio-modal"
          on:click={closeForm}
        >
          <svg
            class="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
      </div>
      <!-- Modal body -->
      <div class="p-4 md:p-5 space-y-4 overflow-y-auto flex-1">
        <div>
          <label for="deporteId" class="block font-semibold text-gray-800 mb-2">
            Deporte:
          </label>
          <select
            id="deporteId"
            bind:value={formData.deporteId}
            on:change={handleDeporteChange}
            disabled={loading}
            class="w-full p-3 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Seleccionar deporte</option>
            {#each deportes as deporte}
              <option value={deporte.id}>{deporte.nombre}</option>
            {/each}
          </select>
        </div>

        <div>
          <label
            for="equipoNombre"
            class="block font-semibold text-gray-800 mb-2"
          >
            Equipo/Participante:
          </label>
          {#if selectedEquipos.length > 0}
            <select
              id="equipoNombre"
              bind:value={formData.equipoNombre}
              disabled={loading}
              class="w-full p-3 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Seleccionar equipo</option>
              {#each selectedEquipos as equipo}
                <option value={equipo.nombre}>{equipo.nombre}</option>
              {/each}
            </select>
          {:else}
            <input
              id="equipoNombre"
              type="text"
              bind:value={formData.equipoNombre}
              placeholder="Nombre del equipo/participante"
              disabled={loading || !formData.deporteId}
              class="w-full p-3 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p class="text-sm text-gray-500 mt-1">
              {#if !formData.deporteId}
                Primero selecciona un deporte
              {:else}
                No hay equipos registrados para este deporte
              {/if}
            </p>
          {/if}
        </div>

        <div>
          <label for="puesto" class="block font-semibold text-gray-800 mb-2">
            Puesto:
          </label>
          <select
            id="puesto"
            bind:value={formData.puesto}
            disabled={loading}
            class="w-full p-3 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Seleccionar puesto</option>
            <option value="1">1° Lugar 🥇</option>
            <option value="2">2° Lugar 🥈</option>
            <option value="3">3° Lugar 🥉</option>
            <option value="4">4° Lugar 🏅</option>
            <option value="5">5° Lugar 🏅</option>
            <option value="6">6° Lugar 🏅</option>
            <option value="7">7° Lugar 🏅</option>
            <option value="8">8° Lugar 🏅</option>
            <option value="9">9° Lugar 🏅</option>
            <option value="10">10° Lugar 🏅</option>
          </select>
        </div>

        {#if formData.deporteId && selectedEquipos.length > 0}
          <div class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-sm text-green-800">
              <strong
                >{selectedEquipos.length} equipos/participantes disponibles en {deportes.find(
                  (d) => d.id === parseInt(formData.deporteId)
                )?.nombre}:</strong
              >
            </p>
            <div class="mt-2 text-sm text-green-700">
              {#each selectedEquipos as equipo}
                <span
                  class="inline-block mr-2 mb-1 px-2 py-1 bg-green-100 rounded"
                >
                  {equipo.nombre}
                </span>
              {/each}
            </div>
          </div>
        {:else if formData.deporteId && selectedEquipos.length === 0}
          <div
            class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <p class="text-sm text-yellow-800">
              <strong
                >No hay equipos/participantes registrados para {deportes.find(
                  (d) => d.id === parseInt(formData.deporteId)
                )?.nombre}</strong
              >
            </p>
            <p class="text-xs text-yellow-700 mt-1">
              Puedes escribir el nombre del equipo/participante manualmente en
              el campo de arriba.
            </p>
          </div>
        {/if}
      </div>
      <!-- Modal footer -->
      <div
        class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600 flex-shrink-0 bg-gray-50"
      >
        <button
          type="button"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          on:click={savePodio}
          disabled={loading}
        >
          {loading ? "Guardando..." : "🏅 Guardar"}
        </button>
        <button
          type="button"
          class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          on:click={closeForm}
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</div>
