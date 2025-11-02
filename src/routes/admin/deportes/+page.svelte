<script lang="ts">
  import { onMount } from "svelte";
  import { toast } from "$lib/stores/toast";

  export let data;

  let deportes = data.deportes;
  let loading = false;
  let editingDeporte: any = null;
  let selectedRed = "";

  // Variables para modal de confirmación de eliminación
  let deporteToDelete: any = null;
  let showDeleteModal = false;
  let deleting = false;

  // Variables para manejo de archivos
  let planillaFile: File | null = null;
  let reglamentoFile: File | null = null;
  let fixtureFile: File | null = null;
  let uploadingFile = false;

  let formData: any = {
    nombre: "",
    planilla: "",
    reglamento: "",
    fixture: "",
    fechasCompetencia: [],
    horarios: [],
    locationsNombre: [],
    locationsUrl: [],
    grupoUrlWhatsapp: "",
    redesSociales: {},
  };

  onMount(() => {
    loadDeportes();
  });

  async function loadDeportes() {
    try {
      const response = await fetch("/api/admin/deportes");
      if (response.ok) {
        deportes = await response.json();
      }
    } catch (error) {
      console.error("Error cargando deportes:", error);
    }
  }

  function openForm(deporte: any = null) {
    editingDeporte = deporte;

    // Limpiar archivos seleccionados antes de abrir
    planillaFile = null;
    reglamentoFile = null;
    fixtureFile = null;

    // Limpiar inputs HTML de archivos
    const planillaInput = document.getElementById(
      "planilla"
    ) as HTMLInputElement;
    const reglamentoInput = document.getElementById(
      "reglamento"
    ) as HTMLInputElement;
    const fixtureInput = document.getElementById("fixture") as HTMLInputElement;

    if (planillaInput) planillaInput.value = "";
    if (reglamentoInput) reglamentoInput.value = "";
    if (fixtureInput) fixtureInput.value = "";

    if (deporte) {
      formData = {
        nombre: deporte.nombre,
        planilla: deporte.planilla,
        reglamento: deporte.reglamento,
        fixture: deporte.fixture,
        fechasCompetencia: Array.isArray(deporte.fechasCompetencia)
          ? deporte.fechasCompetencia
          : [],
        horarios: Array.isArray(deporte.horarios) ? deporte.horarios : [],
        locationsNombre: Array.isArray(deporte.locationsNombre)
          ? deporte.locationsNombre
          : [],
        locationsUrl: Array.isArray(deporte.locationsUrl)
          ? deporte.locationsUrl
          : [],
        grupoUrlWhatsapp: deporte.grupoUrlWhatsapp,
        redesSociales:
          typeof deporte.redesSociales === "object"
            ? deporte.redesSociales
            : {},
      };
    } else {
      formData = {
        nombre: "",
        planilla: "",
        reglamento: "",
        fixture: "",
        fechasCompetencia: [],
        horarios: [],
        locationsNombre: [],
        locationsUrl: [],
        grupoUrlWhatsapp: "",
        redesSociales: {},
      };
    }

    // Show the modal using Flowbite
    const modal = document.getElementById("deporte-modal");
    if (modal) {
      modal.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");
    }
  }

  function closeForm() {
    // Hide the Flowbite modal
    const modal = document.getElementById("deporte-modal");
    if (modal) {
      modal.classList.add("hidden");
      modal.setAttribute("aria-hidden", "true");
    }

    editingDeporte = null;
    formData = {
      nombre: "",
      planilla: "",
      reglamento: "",
      fixture: "",
      fechasCompetencia: [],
      horarios: [],
      locationsNombre: [],
      locationsUrl: [],
      grupoUrlWhatsapp: "",
      redesSociales: {},
    };

    // Limpiar archivos seleccionados
    planillaFile = null;
    reglamentoFile = null;
    fixtureFile = null;

    // Limpiar inputs HTML de archivos
    const planillaInput = document.getElementById(
      "planilla"
    ) as HTMLInputElement;
    const reglamentoInput = document.getElementById(
      "reglamento"
    ) as HTMLInputElement;
    const fixtureInput = document.getElementById("fixture") as HTMLInputElement;

    if (planillaInput) planillaInput.value = "";
    if (reglamentoInput) reglamentoInput.value = "";
    if (fixtureInput) fixtureInput.value = "";
  }

  async function saveDeporte() {
    if (!formData.nombre) {
      toast.error("El nombre es requerido");
      return;
    }

    loading = true;

    try {
      // Subir archivos si hay nuevos
      let planillaUrl = formData.planilla;
      let reglamentoUrl = formData.reglamento;
      let fixtureUrl = formData.fixture;

      if (planillaFile) {
        // Eliminar archivo anterior si existe
        if (formData.planilla) {
          await deleteFile(formData.planilla);
        }
        planillaUrl = await uploadFile(planillaFile, "planilla");
        if (!planillaUrl) return;
      }

      if (reglamentoFile) {
        // Eliminar archivo anterior si existe
        if (formData.reglamento) {
          await deleteFile(formData.reglamento);
        }
        reglamentoUrl = await uploadFile(reglamentoFile, "reglamento");
        if (!reglamentoUrl) return;
      }

      if (fixtureFile) {
        // Eliminar archivo anterior si existe
        if (formData.fixture) {
          await deleteFile(formData.fixture);
        }
        fixtureUrl = await uploadFile(fixtureFile, "fixture");
        if (!fixtureUrl) return;
      }

      // Preparar datos para enviar
      const dataToSend = {
        ...formData,
        planilla: planillaUrl,
        reglamento: reglamentoUrl,
        fixture: fixtureUrl,
      };

      const url = editingDeporte
        ? `/api/admin/deportes/${editingDeporte.id}`
        : "/api/admin/deportes";

      const method = editingDeporte ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        await loadDeportes();
        closeForm();
        toast.success(
          editingDeporte
            ? "Deporte actualizado exitosamente"
            : "Deporte creado exitosamente"
        );
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

  function confirmDelete(deporte: any) {
    deporteToDelete = deporte;
    showDeleteModal = true;
  }

  function closeDeleteModal() {
    showDeleteModal = false;
    deporteToDelete = null;
  }

  async function deleteDeporte() {
    if (!deporteToDelete) return;

    deleting = true;

    try {
      const response = await fetch(
        `/api/admin/deportes/${deporteToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        await loadDeportes();
        toast.success("Deporte eliminado exitosamente");
        closeDeleteModal();
      } else {
        const error = await response.json();
        toast.error(error.message || "Error al eliminar");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      deleting = false;
    }
  }

  // Función para subir archivos
  async function uploadFile(file: File, type: string) {
    if (!file) return null;

    uploadingFile = true;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      formData.append("deporteId", editingDeporte?.id || "new");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        return result.url;
      } else {
        const error = await response.json();
        toast.error(error.error || "Error al subir archivo");
        return null;
      }
    } catch (error) {
      toast.error("Error de conexión al subir archivo");
      return null;
    } finally {
      uploadingFile = false;
    }
  }

  // Función para eliminar archivo
  async function deleteFile(fileUrl: string) {
    if (!fileUrl) return;

    try {
      const response = await fetch("/api/admin/delete-file", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileUrl }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error deleting file:", error);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }

  // Función para manejar cambio de archivos
  function handleFileChange(event: any, type: string) {
    const file = event.target.files[0];
    if (file) {
      switch (type) {
        case "planilla":
          planillaFile = file;
          break;
        case "reglamento":
          reglamentoFile = file;
          break;
        case "fixture":
          fixtureFile = file;
          break;
      }
    }
  }
</script>

<svelte:head>
  <title>Deportes - Panel de Administración</title>
</svelte:head>

<div class="max-w-6xl mx-auto p-4 md:p-8">
  <div class="text-center mb-6 md:mb-8 text-gray-800 relative">
    <h1
      class="text-2xl md:text-3xl mb-2 drop-shadow-lg flex items-center justify-center gap-2"
    >
      <svg
        class="w-6 h-6 md:w-7 md:h-7"
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
          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z"
        />
      </svg>
      Gestión de Deportes
    </h1>
    <p class="text-sm md:text-base opacity-90 mb-4">
      Administra los deportes del torneo
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
      Agregar Deporte
    </button>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
    {#each deportes as deporte}
      <div
        class="bg-white rounded-2xl p-4 md:p-6 shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="m-0 text-base md:text-lg text-gray-800 break-words flex-1">
            {deporte.nombre}
          </h3>
          <div class="flex gap-2 flex-shrink-0">
            <button
              on:click={() => openForm(deporte)}
              class="bg-transparent border-0 cursor-pointer p-2 rounded transition-colors duration-300 hover:bg-blue-50"
              title="Editar"
            >
              <svg
                class="w-5 h-5 text-blue-500"
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
              on:click={() => confirmDelete(deporte)}
              class="bg-transparent border-0 cursor-pointer p-2 rounded transition-colors duration-300 hover:bg-red-50"
              title="Eliminar"
            >
              <svg
                class="w-5 h-5 text-red-500"
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
        </div>

        <div class="space-y-2">
          <p class="m-0 text-sm md:text-base text-gray-600">
            <strong>Equipos:</strong>
            {deporte.equipos.length}
          </p>
          <p class="m-0 text-sm md:text-base text-gray-600">
            <strong>Podios:</strong>
            {deporte.podios.length}
          </p>
          {#if deporte.grupoUrlWhatsapp}
            <p class="m-0 text-sm md:text-base text-gray-600 break-words">
              <strong>WhatsApp:</strong>
              <a
                href={deporte.grupoUrlWhatsapp}
                target="_blank"
                class="text-indigo-500 no-underline hover:underline truncate block"
                title={deporte.grupoUrlWhatsapp}>Ver Grupo</a
              >
            </p>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <!-- Main modal -->
  <div
    id="deporte-modal"
    tabindex="-1"
    aria-hidden="true"
    class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black bg-opacity-50"
  >
    <!-- Modal content -->
    <div
      class="relative bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] md:max-h-[80vh] flex flex-col border border-gray-200 mx-4"
    >
      <!-- Modal header -->
      <div
        class="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 flex-shrink-0 bg-gray-50"
      >
        <h3
          class="text-lg md:text-xl font-semibold text-gray-800 break-words flex-1 pr-2"
        >
          {editingDeporte ? "Editar Deporte" : "Nuevo Deporte"}{formData.nombre
            ? `: ${formData.nombre}`
            : ""}
        </h3>
        <button
          type="button"
          class="text-gray-600 bg-transparent hover:bg-gray-200 hover:text-gray-800 rounded-lg text-sm w-8 h-8 flex-shrink-0 inline-flex justify-center items-center"
          data-modal-hide="deporte-modal"
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
            for="nombre"
            class="block text-sm md:text-base font-semibold text-gray-800 mb-2"
          >
            Nombre del Deporte:
          </label>
          <input
            id="nombre"
            type="text"
            bind:value={formData.nombre}
            placeholder="Ej: Fútbol 5"
            disabled={loading}
            class="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <!-- Planilla -->
        <div>
          <label
            for="planilla"
            class="block text-sm md:text-base font-semibold text-gray-800 mb-2"
          >
            Planilla (Excel/PDF):
          </label>
          <div class="space-y-2">
            {#if formData.planilla}
              <div
                class="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg"
              >
                <svg
                  class="w-4 h-4 text-green-700 flex-shrink-0"
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
                    d="M7 7h10M7 12h10m-7 5h7M5 5h1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                  />
                </svg>
                <span class="text-xs md:text-sm text-green-700 truncate flex-1"
                  >Archivo actual: {formData.planilla.split("/").pop()}</span
                >
                <button
                  type="button"
                  on:click={() => {
                    formData.planilla = "";
                    planillaFile = null;
                  }}
                  class="text-red-500 hover:text-red-700 flex-shrink-0"
                  title="Eliminar"
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
                </button>
              </div>
            {/if}
            <input
              id="planilla"
              type="file"
              accept=".xlsx,.xls,.pdf"
              on:change={(e) => handleFileChange(e, "planilla")}
              disabled={loading || uploadingFile}
              class="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-xs md:text-sm transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p class="text-xs md:text-sm text-gray-500">
              Formatos permitidos: .xlsx, .xls, .pdf (máx. 10MB)
            </p>
          </div>
        </div>

        <!-- Reglamento -->
        <div>
          <label
            for="reglamento"
            class="block text-sm md:text-base font-semibold text-gray-800 mb-2"
          >
            Reglamento (PDF):
          </label>
          <div class="space-y-2">
            {#if formData.reglamento}
              <div
                class="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg"
              >
                <svg
                  class="w-4 h-4 text-green-700 flex-shrink-0"
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
                    d="M7 7h10M7 12h10m-7 5h7M5 5h1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                  />
                </svg>
                <span class="text-xs md:text-sm text-green-700 truncate flex-1"
                  >Archivo actual: {formData.reglamento.split("/").pop()}</span
                >
                <button
                  type="button"
                  on:click={() => {
                    formData.reglamento = "";
                    reglamentoFile = null;
                  }}
                  class="text-red-500 hover:text-red-700 flex-shrink-0"
                  title="Eliminar"
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
                </button>
              </div>
            {/if}
            <input
              id="reglamento"
              type="file"
              accept=".pdf"
              on:change={(e) => handleFileChange(e, "reglamento")}
              disabled={loading || uploadingFile}
              class="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-xs md:text-sm transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p class="text-xs md:text-sm text-gray-500">
              Formato permitido: .pdf (máx. 10MB)
            </p>
          </div>
        </div>

        <!-- Fixture -->
        <div>
          <label
            for="fixture"
            class="block text-sm md:text-base font-semibold text-gray-800 mb-2"
          >
            Fixture (PDF/Excel):
          </label>
          <div class="space-y-2">
            {#if formData.fixture}
              <div
                class="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg"
              >
                <svg
                  class="w-4 h-4 text-green-700 flex-shrink-0"
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
                    d="M7 7h10M7 12h10m-7 5h7M5 5h1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                  />
                </svg>
                <span class="text-xs md:text-sm text-green-700 truncate flex-1"
                  >Archivo actual: {formData.fixture.split("/").pop()}</span
                >
                <button
                  type="button"
                  on:click={() => {
                    formData.fixture = "";
                    fixtureFile = null;
                  }}
                  class="text-red-500 hover:text-red-700 flex-shrink-0"
                  title="Eliminar"
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
                </button>
              </div>
            {/if}
            <input
              id="fixture"
              type="file"
              accept=".pdf,.xlsx,.xls"
              on:change={(e) => handleFileChange(e, "fixture")}
              disabled={loading || uploadingFile}
              class="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-xs md:text-sm transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p class="text-xs md:text-sm text-gray-500">
              Formatos permitidos: .pdf, .xlsx, .xls (máx. 10MB)
            </p>
          </div>
        </div>

        <div>
          <label
            for="grupoUrlWhatsapp"
            class="block text-sm md:text-base font-semibold text-gray-800 mb-2"
          >
            URL del Grupo de WhatsApp:
          </label>
          <input
            id="grupoUrlWhatsapp"
            type="url"
            bind:value={formData.grupoUrlWhatsapp}
            placeholder="https://chat.whatsapp.com/..."
            disabled={loading}
            class="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <!-- Fechas de Competencia -->
        <div>
          <div
            class="block text-sm md:text-base font-semibold text-gray-800 mb-2"
          >
            Fechas de Competencia:
          </div>
          <div id="fechas-container" class="space-y-2">
            {#each formData.fechasCompetencia as fecha, index}
              <div class="flex flex-col sm:flex-row gap-2">
                <input
                  type="datetime-local"
                  bind:value={formData.fechasCompetencia[index]}
                  disabled={loading}
                  class="flex-1 p-2 border-2 border-gray-300 rounded-lg text-xs md:text-sm transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  on:click={() => {
                    formData.fechasCompetencia =
                      formData.fechasCompetencia.filter(
                        (_: string, i: number) => i !== index
                      );
                  }}
                  disabled={loading}
                  class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 flex items-center justify-center gap-2 text-sm md:text-base"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span class="sm:hidden">Eliminar</span>
                </button>
              </div>
            {/each}
            <button
              type="button"
              on:click={() => {
                formData.fechasCompetencia = [
                  ...formData.fechasCompetencia,
                  "",
                ];
              }}
              disabled={loading}
              class="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 text-sm md:text-base flex items-center justify-center gap-2"
            >
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
                  d="M12 5v14m7-7H5"
                />
              </svg>
              Agregar Fecha
            </button>
          </div>
        </div>

        <!-- Horarios -->
        <div>
          <div
            class="block text-sm md:text-base font-semibold text-gray-800 mb-2"
          >
            Descripción de Horarios:
          </div>
          <div id="horarios-container" class="space-y-2">
            {#each formData.horarios as horario, index}
              <div class="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  bind:value={formData.horarios[index]}
                  placeholder="Ej: Sábado 10/2 de 9 a 13:30 hs"
                  disabled={loading}
                  class="flex-1 p-2 border-2 border-gray-300 rounded-lg text-xs md:text-sm transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  on:click={() => {
                    formData.horarios = formData.horarios.filter(
                      (_: string, i: number) => i !== index
                    );
                  }}
                  disabled={loading}
                  class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 flex items-center justify-center gap-2 text-sm md:text-base"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span class="sm:hidden">Eliminar</span>
                </button>
              </div>
            {/each}
            <button
              type="button"
              on:click={() => {
                formData.horarios = [...formData.horarios, ""];
              }}
              disabled={loading}
              class="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 text-sm md:text-base flex items-center justify-center gap-2"
            >
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
                  d="M12 5v14m7-7H5"
                />
              </svg>
              Agregar Descripción de Horario
            </button>
          </div>
        </div>

        <!-- Ubicaciones -->
        <div>
          <div
            class="block text-sm md:text-base font-semibold text-gray-800 mb-2"
          >
            Ubicaciones:
          </div>
          <div id="ubicaciones-container" class="space-y-2">
            {#each formData.locationsNombre as location, index}
              <div class="space-y-2">
                <input
                  type="text"
                  bind:value={formData.locationsNombre[index]}
                  placeholder="Nombre de la ubicación"
                  disabled={loading}
                  class="w-full p-2 border-2 border-gray-300 rounded-lg text-xs md:text-sm transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <div class="flex gap-2">
                  <input
                    type="url"
                    bind:value={formData.locationsUrl[index]}
                    placeholder="URL de Google Maps"
                    disabled={loading}
                    class="flex-1 p-2 border-2 border-gray-300 rounded-lg text-xs md:text-sm transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    on:click={() => {
                      formData.locationsNombre =
                        formData.locationsNombre.filter(
                          (_: string, i: number) => i !== index
                        );
                      formData.locationsUrl = formData.locationsUrl.filter(
                        (_: string, i: number) => i !== index
                      );
                    }}
                    disabled={loading}
                    class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 flex items-center justify-center gap-2 text-sm md:text-base"
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span class="sm:hidden">Eliminar</span>
                  </button>
                </div>
              </div>
            {/each}
            <button
              type="button"
              on:click={() => {
                formData.locationsNombre = [...formData.locationsNombre, ""];
                formData.locationsUrl = [...formData.locationsUrl, ""];
              }}
              disabled={loading}
              class="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 text-sm md:text-base flex items-center justify-center gap-2"
            >
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
                  d="M12 5v14m7-7H5"
                />
              </svg>
              Agregar Ubicación
            </button>
          </div>
        </div>

        <!-- Redes Sociales -->
        <div>
          <div
            class="block text-sm md:text-base font-semibold text-gray-800 mb-2"
          >
            Redes Sociales:
          </div>
          <div id="redes-container" class="space-y-2">
            {#each Object.entries(formData.redesSociales) as [red, cuentas]}
              {@const cuentasArray = cuentas as any[]}
              <div class="border border-gray-300 rounded-lg p-3">
                <div
                  class="block text-sm md:text-base font-semibold text-gray-700 mb-2 capitalize"
                >
                  {red}:
                </div>
                <div class="space-y-2">
                  {#each cuentasArray as cuenta, index}
                    <div class="space-y-2">
                      <input
                        type="text"
                        bind:value={formData.redesSociales[red][index].nombre}
                        placeholder="Nombre de usuario"
                        disabled={loading}
                        class="w-full p-2 border-2 border-gray-300 rounded-lg text-xs md:text-sm transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <div class="flex gap-2">
                        <input
                          type="url"
                          bind:value={formData.redesSociales[red][index].url}
                          placeholder="URL del perfil"
                          disabled={loading}
                          class="flex-1 p-2 border-2 border-gray-300 rounded-lg text-xs md:text-sm transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                        <button
                          type="button"
                          on:click={() => {
                            formData.redesSociales[red] =
                              formData.redesSociales[red].filter(
                                (_: any, i: number) => i !== index
                              );
                            if (formData.redesSociales[red].length === 0) {
                              delete formData.redesSociales[red];
                              formData.redesSociales = {
                                ...formData.redesSociales,
                              };
                            }
                          }}
                          disabled={loading}
                          class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 flex items-center justify-center"
                          aria-label="Eliminar cuenta"
                          title="Eliminar cuenta"
                        >
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  {/each}
                  <button
                    type="button"
                    on:click={() => {
                      if (!formData.redesSociales[red]) {
                        formData.redesSociales[red] = [];
                      }
                      formData.redesSociales[red] = [
                        ...formData.redesSociales[red],
                        { nombre: "", url: "" },
                      ];
                      formData.redesSociales = { ...formData.redesSociales };
                    }}
                    disabled={loading}
                    class="w-full py-2 px-4 bg-blue-200 text-blue-700 rounded-lg hover:bg-blue-300 disabled:bg-gray-100 text-sm md:text-base flex items-center justify-center gap-2"
                  >
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
                        d="M12 5v14m7-7H5"
                      />
                    </svg>
                    Agregar {red}
                  </button>
                </div>
              </div>
            {/each}
            <div class="flex flex-col sm:flex-row gap-2">
              <select
                bind:value={selectedRed}
                disabled={loading}
                class="flex-1 p-2 border-2 border-gray-300 rounded-lg text-xs md:text-sm transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Seleccionar red social</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
              </select>
              <button
                type="button"
                on:click={() => {
                  if (selectedRed && !formData.redesSociales[selectedRed]) {
                    formData.redesSociales[selectedRed] = [];
                    formData.redesSociales = { ...formData.redesSociales };
                  }
                }}
                disabled={loading || !selectedRed}
                class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 text-sm md:text-base flex items-center justify-center gap-2"
              >
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
                    d="M12 5v14m7-7H5"
                  />
                </svg>
                Agregar Red
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- Modal footer -->
      <div
        class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 md:p-5 border-t border-gray-200 rounded-b flex-shrink-0 bg-gray-50"
      >
        <button
          type="button"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm md:text-base px-4 md:px-5 py-2 md:py-2.5 text-center flex items-center justify-center gap-2 w-full sm:w-auto order-2 sm:order-1"
          on:click={saveDeporte}
          disabled={loading || uploadingFile}
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
          {:else if uploadingFile}
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
            Subiendo archivos...
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
                d="M5 13l4 4L19 7"
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
  {#if showDeleteModal && deporteToDelete}
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
        on:keydown={(e) => e.stopPropagation()}
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
            ¿Estás seguro de que quieres eliminar el deporte
            <strong class="text-gray-900">"{deporteToDelete.nombre}"</strong>?
          </p>
          <p class="text-xs md:text-sm text-red-600">
            Esta acción no se puede deshacer. Todos los datos relacionados con
            este deporte serán eliminados permanentemente.
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
            on:click={deleteDeporte}
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
