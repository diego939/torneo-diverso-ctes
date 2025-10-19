<script lang="ts">
  import { onMount } from "svelte";
  import { toast } from "$lib/stores/toast";

  export let data;

  let deportes = data.deportes;
  let loading = false;
  let editingDeporte: any = null;
  let selectedRed = "";

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

  async function deleteDeporte(deporte: any) {
    if (
      !confirm(`¿Estás seguro de que quieres eliminar "${deporte.nombre}"?`)
    ) {
      return;
    }

    loading = true;

    try {
      const response = await fetch(`/api/admin/deportes/${deporte.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadDeportes();
        toast.success("Deporte eliminado exitosamente");
      } else {
        const error = await response.json();
        toast.error(error.message || "Error al eliminar");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      loading = false;
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
  async function deleteFile(filePath: string) {
    if (!filePath) return;

    try {
      const response = await fetch("/api/admin/delete-file", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath }),
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

<div class="max-w-6xl mx-auto p-8">
  <div class="text-center mb-8 text-gray-800 relative">
    <h1 class="text-3xl mb-2 drop-shadow-lg">
      <i class="bi bi-eye-fill"></i> Gestión de Deportes
    </h1>
    <p class="opacity-90 mb-4">Administra los deportes del torneo</p>
    <button
      on:click={() => openForm()}
      class="bg-gradient-to-r from-green-800 to-teal-800 text-white border-0 py-3 px-6 rounded-lg font-semibold cursor-pointer transition-transform duration-300 hover:transform hover:-translate-y-0.5"
    >
      <i class="bi bi-plus-circle-fill"></i> Agregar Deporte
    </button>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each deportes as deporte}
      <div
        class="bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="m-0 text-gray-800">{deporte.nombre}</h3>
          <div class="flex gap-2">
            <button
              on:click={() => openForm(deporte)}
              class="bg-transparent border-0 text-xl cursor-pointer p-1 rounded transition-colors duration-300 hover:bg-blue-50"
            >
              ✏️
            </button>
            <button
              on:click={() => deleteDeporte(deporte)}
              class="bg-transparent border-0 text-xl cursor-pointer p-1 rounded transition-colors duration-300 hover:bg-red-50"
            >
              🗑️
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <p class="m-0 text-gray-600">
            <strong>Equipos:</strong>
            {deporte.equipos.length}
          </p>
          <p class="m-0 text-gray-600">
            <strong>Podios:</strong>
            {deporte.podios.length}
          </p>
          {#if deporte.grupoUrlWhatsapp}
            <p class="m-0 text-gray-600">
              <strong>WhatsApp:</strong>
              <a
                href={deporte.grupoUrlWhatsapp}
                target="_blank"
                class="text-indigo-500 no-underline hover:underline"
                >Ver Grupo</a
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
      class="relative bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-gray-200"
    >
      <!-- Modal header -->
      <div
        class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200 flex-shrink-0 bg-gray-50"
      >
        <h3 class="text-xl font-semibold text-gray-800">
          {editingDeporte ? "Editar Deporte" : "Nuevo Deporte"}{formData.nombre
            ? `: ${formData.nombre}`
            : ""}
        </h3>
        <button
          type="button"
          class="text-gray-600 bg-transparent hover:bg-gray-200 hover:text-gray-800 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
          data-modal-hide="deporte-modal"
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
          <label for="nombre" class="block font-semibold text-gray-800 mb-2">
            Nombre del Deporte:
          </label>
          <input
            id="nombre"
            type="text"
            bind:value={formData.nombre}
            placeholder="Ej: Fútbol 5"
            disabled={loading}
            class="w-full p-3 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <!-- Planilla -->
        <div>
          <label for="planilla" class="block font-semibold text-gray-800 mb-2">
            Planilla (Excel/PDF):
          </label>
          <div class="space-y-2">
            {#if formData.planilla}
              <div
                class="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg"
              >
                <span class="text-green-700"
                  >📄 Archivo actual: {formData.planilla.split("/").pop()}</span
                >
                <button
                  type="button"
                  on:click={() => {
                    formData.planilla = "";
                    planillaFile = null;
                  }}
                  class="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            {/if}
            <input
              id="planilla"
              type="file"
              accept=".xlsx,.xls,.pdf"
              on:change={(e) => handleFileChange(e, "planilla")}
              disabled={loading || uploadingFile}
              class="w-full p-3 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p class="text-sm text-gray-500">
              Formatos permitidos: .xlsx, .xls, .pdf (máx. 10MB)
            </p>
          </div>
        </div>

        <!-- Reglamento -->
        <div>
          <label
            for="reglamento"
            class="block font-semibold text-gray-800 mb-2"
          >
            Reglamento (PDF):
          </label>
          <div class="space-y-2">
            {#if formData.reglamento}
              <div
                class="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg"
              >
                <span class="text-green-700"
                  >📄 Archivo actual: {formData.reglamento
                    .split("/")
                    .pop()}</span
                >
                <button
                  type="button"
                  on:click={() => {
                    formData.reglamento = "";
                    reglamentoFile = null;
                  }}
                  class="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            {/if}
            <input
              id="reglamento"
              type="file"
              accept=".pdf"
              on:change={(e) => handleFileChange(e, "reglamento")}
              disabled={loading || uploadingFile}
              class="w-full p-3 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p class="text-sm text-gray-500">
              Formato permitido: .pdf (máx. 10MB)
            </p>
          </div>
        </div>

        <!-- Fixture -->
        <div>
          <label for="fixture" class="block font-semibold text-gray-800 mb-2">
            Fixture (PDF/Excel):
          </label>
          <div class="space-y-2">
            {#if formData.fixture}
              <div
                class="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg"
              >
                <span class="text-green-700"
                  >📄 Archivo actual: {formData.fixture.split("/").pop()}</span
                >
                <button
                  type="button"
                  on:click={() => {
                    formData.fixture = "";
                    fixtureFile = null;
                  }}
                  class="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            {/if}
            <input
              id="fixture"
              type="file"
              accept=".pdf,.xlsx,.xls"
              on:change={(e) => handleFileChange(e, "fixture")}
              disabled={loading || uploadingFile}
              class="w-full p-3 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p class="text-sm text-gray-500">
              Formatos permitidos: .pdf, .xlsx, .xls (máx. 10MB)
            </p>
          </div>
        </div>

        <div>
          <label
            for="grupoUrlWhatsapp"
            class="block font-semibold text-gray-800 mb-2"
          >
            URL del Grupo de WhatsApp:
          </label>
          <input
            id="grupoUrlWhatsapp"
            type="url"
            bind:value={formData.grupoUrlWhatsapp}
            placeholder="https://chat.whatsapp.com/..."
            disabled={loading}
            class="w-full p-3 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <!-- Fechas de Competencia -->
        <div>
          <label class="block font-semibold text-gray-800 mb-2">
            Fechas de Competencia:
          </label>
          <div id="fechas-container" class="space-y-2">
            {#each formData.fechasCompetencia as fecha, index}
              <div class="flex gap-2">
                <input
                  type="datetime-local"
                  bind:value={formData.fechasCompetencia[index]}
                  disabled={loading}
                  class="flex-1 p-2 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  on:click={() => {
                    formData.fechasCompetencia =
                      formData.fechasCompetencia.filter((_, i) => i !== index);
                  }}
                  disabled={loading}
                  class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400"
                >
                  ✕
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
              class="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100"
            >
              + Agregar Fecha
            </button>
          </div>
        </div>

        <!-- Horarios -->
        <div>
          <label class="block font-semibold text-gray-800 mb-2">
            Descripción de Horarios:
          </label>
          <div id="horarios-container" class="space-y-2">
            {#each formData.horarios as horario, index}
              <div class="flex gap-2">
                <input
                  type="text"
                  bind:value={formData.horarios[index]}
                  placeholder="Ej: Sábado 10/2 de 9 a 13:30 hs"
                  disabled={loading}
                  class="flex-1 p-2 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  on:click={() => {
                    formData.horarios = formData.horarios.filter(
                      (_, i) => i !== index
                    );
                  }}
                  disabled={loading}
                  class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400"
                >
                  ✕
                </button>
              </div>
            {/each}
            <button
              type="button"
              on:click={() => {
                formData.horarios = [...formData.horarios, ""];
              }}
              disabled={loading}
              class="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100"
            >
              + Agregar Descripción de Horario
            </button>
          </div>
        </div>

        <!-- Ubicaciones -->
        <div>
          <label class="block font-semibold text-gray-800 mb-2">
            Ubicaciones:
          </label>
          <div id="ubicaciones-container" class="space-y-2">
            {#each formData.locationsNombre as location, index}
              <div class="flex gap-2">
                <input
                  type="text"
                  bind:value={formData.locationsNombre[index]}
                  placeholder="Nombre de la ubicación"
                  disabled={loading}
                  class="flex-1 p-2 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <input
                  type="url"
                  bind:value={formData.locationsUrl[index]}
                  placeholder="URL de Google Maps"
                  disabled={loading}
                  class="flex-1 p-2 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  on:click={() => {
                    formData.locationsNombre = formData.locationsNombre.filter(
                      (_, i) => i !== index
                    );
                    formData.locationsUrl = formData.locationsUrl.filter(
                      (_, i) => i !== index
                    );
                  }}
                  disabled={loading}
                  class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400"
                >
                  ✕
                </button>
              </div>
            {/each}
            <button
              type="button"
              on:click={() => {
                formData.locationsNombre = [...formData.locationsNombre, ""];
                formData.locationsUrl = [...formData.locationsUrl, ""];
              }}
              disabled={loading}
              class="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100"
            >
              + Agregar Ubicación
            </button>
          </div>
        </div>

        <!-- Redes Sociales -->
        <div>
          <label class="block font-semibold text-gray-800 mb-2">
            Redes Sociales:
          </label>
          <div id="redes-container" class="space-y-2">
            {#each Object.entries(formData.redesSociales) as [red, cuentas]}
              <div class="border border-gray-300 rounded-lg p-3">
                <label class="block font-semibold text-gray-700 mb-2 capitalize"
                  >{red}:</label
                >
                <div class="space-y-2">
                  {#each cuentas as cuenta, index}
                    <div class="flex gap-2">
                      <input
                        type="text"
                        bind:value={formData.redesSociales[red][index].nombre}
                        placeholder="Nombre de usuario"
                        disabled={loading}
                        class="flex-1 p-2 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <input
                        type="url"
                        bind:value={formData.redesSociales[red][index].url}
                        placeholder="URL del perfil"
                        disabled={loading}
                        class="flex-1 p-2 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <button
                        type="button"
                        on:click={() => {
                          formData.redesSociales[red] = formData.redesSociales[
                            red
                          ].filter((_, i) => i !== index);
                          if (formData.redesSociales[red].length === 0) {
                            delete formData.redesSociales[red];
                            formData.redesSociales = {
                              ...formData.redesSociales,
                            };
                          }
                        }}
                        disabled={loading}
                        class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400"
                      >
                        ✕
                      </button>
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
                    class="w-full py-2 px-4 bg-blue-200 text-blue-700 rounded-lg hover:bg-blue-300 disabled:bg-gray-100"
                  >
                    + Agregar {red}
                  </button>
                </div>
              </div>
            {/each}
            <div class="flex gap-2">
              <select
                bind:value={selectedRed}
                disabled={loading}
                class="flex-1 p-2 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400"
              >
                Agregar Red
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- Modal footer -->
      <div
        class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600 flex-shrink-0 bg-gray-50"
      >
        <button
          type="button"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          on:click={saveDeporte}
          disabled={loading || uploadingFile}
        >
          {loading
            ? "Guardando..."
            : uploadingFile
              ? "Subiendo archivos..."
              : "💾 Guardar"}
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
