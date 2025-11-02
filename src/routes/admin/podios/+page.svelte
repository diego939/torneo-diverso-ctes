<script lang="ts">
  import { onMount } from "svelte";
  import { toast } from "$lib/stores/toast";

  export let data;

  let podios = data.podios;
  let deportes = data.deportes;
  let loading = false;
  let editingPodio: any = null;
  let selectedDeporteId = "";

  // Variables para modal de confirmación de eliminación
  let podioToDelete: any = null;
  let showDeleteModal = false;
  let deleting = false;

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

  function confirmDelete(podio: any) {
    podioToDelete = podio;
    showDeleteModal = true;
  }

  function closeDeleteModal() {
    showDeleteModal = false;
    podioToDelete = null;
  }

  async function deletePodio() {
    if (!podioToDelete) return;

    deleting = true;

    try {
      const response = await fetch(`/api/admin/podios/${podioToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadPodios();
        toast.success("Podio eliminado exitosamente");
        closeDeleteModal();
      } else {
        const error = await response.json();
        toast.error(error.error || "Error al eliminar");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      deleting = false;
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

<div class="max-w-6xl mx-auto p-4 md:p-8">
  <div class="text-center mb-6 md:mb-8 text-gray-800 relative">
    <h1
      class="text-2xl md:text-3xl mb-2 drop-shadow-lg flex items-center justify-center gap-2"
    >
      <i class="bi bi-trophy-fill"></i>
      Gestión de Podios
    </h1>
    <p class="text-sm md:text-base opacity-90 mb-4">
      Administra los resultados y podios de cada deporte
    </p>
    <button
      on:click={() => openForm()}
      class="bg-gradient-to-r from-green-800 to-teal-800 text-white border-0 py-2 md:py-3 px-4 md:px-6 rounded-lg text-sm md:text-base font-semibold cursor-pointer transition-transform duration-300 hover:transform hover:-translate-y-0.5 flex items-center gap-2 mx-auto"
    >
      <svg
        class="w-5 h-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 5v14m7-7H5"
        />
      </svg>
      Agregar Podio
    </button>
  </div>

  <!-- Filtro por deporte -->
  <div class="mb-4 md:mb-6">
    <div class="bg-white rounded-lg p-3 md:p-4 shadow-lg">
      <label
        for="deporte-filter"
        class="block text-sm md:text-base font-semibold text-gray-800 mb-2"
      >
        Filtrar por Deporte:
      </label>
      <select
        id="deporte-filter"
        bind:value={selectedDeporteId}
        on:change={() => filterByDeporte(selectedDeporteId)}
        class="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500"
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
                          class="bg-transparent border-0 cursor-pointer p-2 rounded transition-colors duration-300 hover:bg-blue-50"
                          title="Editar podio"
                        >
                          <svg
                            class="w-4 h-4 md:w-5 md:h-5 text-blue-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                            />
                          </svg>
                        </button>
                        <button
                          on:click={() => confirmDelete(podio)}
                          class="bg-transparent border-0 cursor-pointer p-2 rounded transition-colors duration-300 hover:bg-red-50"
                          title="Eliminar podio"
                        >
                          <svg
                            class="w-4 h-4 md:w-5 md:h-5 text-red-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                            />
                          </svg>
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
    <div class="bg-white rounded-2xl p-8 md:p-12 shadow-lg text-center">
      <div class="text-6xl mb-4">
        <i class="bi bi-trophy-fill"></i>
      </div>
      <h2 class="text-lg md:text-xl text-gray-800 mb-4">
        {#if selectedDeporteId}
          No hay podios para {filteredDeportes[0]?.nombre || "este deporte"}
        {:else}
          No hay podios registrados
        {/if}
      </h2>
      <p class="text-sm md:text-base text-gray-600 mb-6">
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
      class="relative bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] md:max-h-[80vh] flex flex-col border border-gray-200 mx-4"
    >
      <!-- Modal header -->
      <div
        class="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 flex-shrink-0 bg-gray-50"
      >
        <h3
          class="text-lg md:text-xl font-semibold text-gray-800 break-words flex-1 pr-2"
        >
          {editingPodio ? "Editar Podio" : "Nuevo Podio"}
        </h3>
        <button
          type="button"
          class="text-gray-600 bg-transparent hover:bg-gray-200 hover:text-gray-800 rounded-lg text-sm w-8 h-8 flex-shrink-0 inline-flex justify-center items-center"
          data-modal-hide="podio-modal"
          on:click={closeForm}
          title="Cerrar"
        >
          <svg
            class="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
      </div>
      <!-- Modal body -->
      <div class="p-4 md:p-5 space-y-3 md:space-y-4 overflow-y-auto flex-1">
        <div>
          <label
            for="deporteId"
            class="block text-sm md:text-base font-semibold text-gray-800 mb-2"
          >
            Deporte:
          </label>
          <select
            id="deporteId"
            bind:value={formData.deporteId}
            on:change={handleDeporteChange}
            disabled={loading}
            class="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
            class="block text-sm md:text-base font-semibold text-gray-800 mb-2"
          >
            Equipo/Participante:
          </label>
          {#if selectedEquipos.length > 0}
            <select
              id="equipoNombre"
              bind:value={formData.equipoNombre}
              disabled={loading}
              class="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              class="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p class="text-xs md:text-sm text-gray-500 mt-1">
              {#if !formData.deporteId}
                Primero selecciona un deporte
              {:else}
                No hay equipos registrados para este deporte
              {/if}
            </p>
          {/if}
        </div>

        <div>
          <label
            for="puesto"
            class="block text-sm md:text-base font-semibold text-gray-800 mb-2"
          >
            Puesto:
          </label>
          <select
            id="puesto"
            bind:value={formData.puesto}
            disabled={loading}
            class="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
            <p class="text-xs md:text-sm text-green-800">
              <strong
                >{selectedEquipos.length} equipos/participantes disponibles en {deportes.find(
                  (d) => d.id === parseInt(formData.deporteId)
                )?.nombre}:</strong
              >
            </p>
            <div class="mt-2 text-xs md:text-sm text-green-700">
              {#each selectedEquipos as equipo}
                <span
                  class="inline-block mr-2 mb-1 px-2 py-1 bg-green-100 rounded break-words"
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
            <p class="text-xs md:text-sm text-yellow-800">
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
        class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 md:p-5 border-t border-gray-200 rounded-b flex-shrink-0 bg-gray-50"
      >
        <button
          type="button"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm md:text-base px-4 md:px-5 py-2 md:py-2.5 text-center flex items-center justify-center gap-2 w-full sm:w-auto order-2 sm:order-1"
          on:click={savePodio}
          disabled={loading}
        >
          {#if loading}
            <svg
              class="animate-spin w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 5v14m7-7H5"
              />
            </svg>
            Guardando...
          {:else}
            <svg
              class="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2Zm10-10V7a4 4 0 0 0-8 0v4h8Z"
              />
            </svg>
            Guardar
          {/if}
        </button>
        <button
          type="button"
          class="py-2 md:py-2.5 px-4 md:px-5 text-sm md:text-base font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 w-full sm:w-auto order-1 sm:order-2"
          on:click={closeForm}
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>

  <!-- Modal de confirmación de eliminación -->
  {#if showDeleteModal && podioToDelete}
    <div
      tabindex="-1"
      aria-hidden="true"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black bg-opacity-50"
      on:click|self={closeDeleteModal}
      on:keydown={(e) => {
        if (e.key === "Escape") closeDeleteModal();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <!-- Modal content -->
      <article
        class="relative bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 border border-gray-200"
        on:click|stopPropagation
      >
        <!-- Modal header -->
        <div
          class="flex items-center justify-between p-4 md:p-5 border-b border-gray-200 rounded-t bg-red-50"
        >
          <div class="flex items-center gap-3">
            <svg
              class="w-6 h-6 text-red-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z"
              />
            </svg>
            <h3
              id="delete-modal-title"
              class="text-lg md:text-xl font-semibold text-gray-800"
            >
              Confirmar Eliminación
            </h3>
          </div>
          <button
            type="button"
            class="text-gray-600 bg-transparent hover:bg-gray-200 hover:text-gray-800 rounded-lg text-sm w-8 h-8 flex-shrink-0 inline-flex justify-center items-center"
            on:click={closeDeleteModal}
            title="Cerrar"
          >
            <svg
              class="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span class="sr-only">Cerrar modal</span>
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-4 md:p-5">
          <p class="text-sm md:text-base text-gray-700 mb-4">
            ¿Estás seguro de que quieres eliminar el puesto
            <strong class="text-gray-900">{podioToDelete.puesto}°</strong> de
            <strong class="text-gray-900">"{podioToDelete.equipoNombre}"</strong
            >?
          </p>
          <p class="text-xs md:text-sm text-red-600">
            Esta acción no se puede deshacer. El podio será eliminado
            permanentemente.
          </p>
        </div>
        <!-- Modal footer -->
        <div
          class="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 p-4 md:p-5 border-t border-gray-200 rounded-b bg-gray-50"
        >
          <button
            type="button"
            class="py-2 md:py-2.5 px-4 md:px-5 text-sm md:text-base font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-700 focus:z-10 focus:ring-4 focus:ring-gray-100 w-full sm:w-auto order-2 sm:order-1"
            on:click={closeDeleteModal}
            disabled={deleting}
          >
            Cancelar
          </button>
          <button
            type="button"
            class="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm md:text-base px-4 md:px-5 py-2 md:py-2.5 text-center flex items-center justify-center gap-2 w-full sm:w-auto order-1 sm:order-2"
            on:click={deletePodio}
            disabled={deleting}
          >
            {#if deleting}
              <svg
                class="animate-spin w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 5v14m7-7H5"
                />
              </svg>
              Eliminando...
            {:else}
              <svg
                class="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                />
              </svg>
              Sí, eliminar
            {/if}
          </button>
        </div>
      </article>
    </div>
  {/if}
</div>
