<script lang="ts">
  import { onMount } from "svelte";
  import { toast } from "$lib/stores/toast";

  export let data;

  let equipos = data.equipos;
  let deportes = data.deportes;
  let loading = false;
  let editingEquipo: any = null;
  let selectedDeporteId = "";
  let logoFile: File | null = null;
  let uploadingFile = false;

  let formData: any = {
    nombre: "",
    local: false,
    urlLogo: "",
    instagram: "",
    facebook: "",
    twitter: "",
    deporteId: "",
  };

  onMount(() => {
    loadEquipos();
  });

  async function loadEquipos() {
    try {
      const url = selectedDeporteId
        ? `/api/admin/equipos?deporteId=${selectedDeporteId}`
        : "/api/admin/equipos";
      const response = await fetch(url);
      if (response.ok) {
        equipos = await response.json();
      }
    } catch (error) {
      console.error("Error cargando equipos:", error);
    }
  }

  function filterByDeporte(deporteId: string) {
    selectedDeporteId = deporteId;
    loadEquipos();
  }

  function openForm(equipo: any = null) {
    editingEquipo = equipo;
    if (equipo) {
      formData = {
        nombre: equipo.nombre,
        local: equipo.local,
        urlLogo: equipo.urlLogo,
        instagram: equipo.instagram || "",
        facebook: equipo.facebook || "",
        twitter: equipo.twitter || "",
        deporteId: equipo.deporteId.toString(),
      };
    } else {
      formData = {
        nombre: "",
        local: false,
        urlLogo: "/equipos/sin-logo.jpg",
        instagram: "",
        facebook: "",
        twitter: "",
        deporteId: "",
      };
    }

    // Show the modal
    const modal = document.getElementById("equipo-modal");
    if (modal) {
      modal.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");
    }
  }

  function closeForm() {
    // Hide the modal
    const modal = document.getElementById("equipo-modal");
    if (modal) {
      modal.classList.add("hidden");
      modal.setAttribute("aria-hidden", "true");
    }

    editingEquipo = null;
    formData = {
      nombre: "",
      local: false,
      urlLogo: "/equipos/sin-logo.jpg",
      instagram: "",
      facebook: "",
      twitter: "",
      deporteId: "",
    };

    // Limpiar archivo seleccionado
    logoFile = null;
  }

  async function saveEquipo() {
    if (!formData.nombre) {
      toast.error("El nombre es requerido");
      return;
    }

    if (!formData.deporteId) {
      toast.error("El deporte es requerido");
      return;
    }

    loading = true;

    try {
      // Subir logo si hay uno nuevo
      let logoUrl = formData.urlLogo;

      if (logoFile) {
        // Eliminar logo anterior si existe (solo si no es el logo por defecto)
        if (formData.urlLogo && formData.urlLogo !== "/equipos/sin-logo.jpg") {
          await deleteLogo(formData.urlLogo);
        }
        logoUrl = await uploadLogo(logoFile);
        if (!logoUrl) return;
      } else if (!logoUrl) {
        // Si no hay logo ni archivo nuevo, usar el logo por defecto
        logoUrl = "/equipos/sin-logo.jpg";
      }

      // Preparar datos para enviar
      const dataToSend = {
        ...formData,
        urlLogo: logoUrl,
        local: formData.local === "true" || formData.local === true,
      };

      const url = editingEquipo
        ? `/api/admin/equipos/${editingEquipo.id}`
        : "/api/admin/equipos";

      const method = editingEquipo ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        await loadEquipos();
        closeForm();
        toast.success(
          editingEquipo
            ? "Equipo actualizado exitosamente"
            : "Equipo creado exitosamente"
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

  async function deleteEquipo(equipo: any) {
    if (!confirm(`¿Estás seguro de que quieres eliminar "${equipo.nombre}"?`)) {
      return;
    }

    loading = true;

    try {
      const response = await fetch(`/api/admin/equipos/${equipo.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Eliminar logo del servidor (solo si no es el logo por defecto)
        if (equipo.urlLogo && equipo.urlLogo !== "/equipos/sin-logo.jpg") {
          await deleteLogo(equipo.urlLogo);
        }
        await loadEquipos();
        toast.success("Equipo eliminado exitosamente");
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

  // Función para subir logo
  async function uploadLogo(file: File) {
    if (!file) return null;

    uploadingFile = true;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload-equipo", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        return result.url;
      } else {
        const error = await response.json();
        toast.error(error.error || "Error al subir logo");
        return null;
      }
    } catch (error) {
      toast.error("Error de conexión al subir logo");
      return null;
    } finally {
      uploadingFile = false;
    }
  }

  // Función para eliminar logo
  async function deleteLogo(logoPath: string) {
    if (!logoPath) return;

    // Proteger el logo por defecto
    if (
      logoPath === "/equipos/sin-logo.jpg" ||
      logoPath.includes("sin-logo.jpg")
    ) {
      console.warn(
        "Intento de eliminar el logo por defecto - operación cancelada"
      );
      return;
    }

    try {
      const response = await fetch("/api/admin/delete-equipo-image", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath: logoPath }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error deleting logo:", error);
      }
    } catch (error) {
      console.error("Error deleting logo:", error);
    }
  }

  // Función para manejar cambio de archivo
  function handleLogoChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      logoFile = file;
    }
  }
</script>

<svelte:head>
  <title>Equipos - Panel de Administración</title>
</svelte:head>

<div class="max-w-6xl mx-auto p-8">
  <div class="text-center mb-8 text-gray-800 relative">
    <h1 class="text-3xl mb-2 drop-shadow-lg">
      <i class="bi bi-people-fill"></i> Gestión de Equipos
    </h1>
    <p class="opacity-90 mb-4">Administra los equipos participantes</p>
    <button
      on:click={() => openForm()}
      class="bg-gradient-to-r from-green-800 to-teal-800 text-white border-0 py-3 px-6 rounded-lg font-semibold cursor-pointer transition-transform duration-300 hover:transform hover:-translate-y-0.5"
    >
      <i class="bi bi-plus-circle-fill"></i> Agregar Equipo
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

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each equipos as equipo}
      <div
        class="bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl"
      >
        <div class="flex justify-between items-center mb-4">
          <div class="flex-1">
            <h3 class="m-0 text-gray-800">{equipo.nombre}</h3>
            <p class="text-sm text-gray-500 m-0">{equipo.deporte.nombre}</p>
          </div>
          <div class="flex gap-2">
            <button
              on:click={() => openForm(equipo)}
              class="bg-transparent border-0 text-xl cursor-pointer p-1 rounded transition-colors duration-300 hover:bg-blue-50"
            >
              ✏️
            </button>
            <button
              on:click={() => deleteEquipo(equipo)}
              class="bg-transparent border-0 text-xl cursor-pointer p-1 rounded transition-colors duration-300 hover:bg-red-50"
            >
              🗑️
            </button>
          </div>
        </div>

        <div class="text-center mb-4">
          <img
            src={equipo.urlLogo || "/equipos/sin-logo.jpg"}
            alt={equipo.nombre}
            class="w-full h-24 object-contain rounded-lg border border-gray-200 mx-auto"
          />
        </div>

        <div class="space-y-2">
          <p class="m-0 text-gray-600">
            <strong>Tipo:</strong>
            {equipo.local ? "Local" : "Visitante"}
          </p>
          {#if equipo.instagram}
            <p class="m-0 text-gray-600">
              <strong>Instagram:</strong>
              <a
                href={equipo.instagram}
                target="_blank"
                class="text-indigo-500 no-underline hover:underline ml-1"
                >Ver perfil</a
              >
            </p>
          {/if}
          {#if equipo.facebook}
            <p class="m-0 text-gray-600">
              <strong>Facebook:</strong>
              <a
                href={equipo.facebook}
                target="_blank"
                class="text-indigo-500 no-underline hover:underline ml-1"
                >Ver perfil</a
              >
            </p>
          {/if}
          {#if equipo.twitter}
            <p class="m-0 text-gray-600">
              <strong>Twitter:</strong>
              <a
                href={equipo.twitter}
                target="_blank"
                class="text-indigo-500 no-underline hover:underline ml-1"
                >Ver perfil</a
              >
            </p>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <!-- Main modal -->
  <div
    id="equipo-modal"
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
          {editingEquipo ? "Editar Equipo" : "Nuevo Equipo"}
          {formData.nombre ? `: ${formData.nombre}` : ""}
        </h3>
        <button
          type="button"
          class="text-gray-600 bg-transparent hover:bg-gray-200 hover:text-gray-800 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
          data-modal-hide="equipo-modal"
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
            Nombre del Equipo:
          </label>
          <input
            id="nombre"
            type="text"
            bind:value={formData.nombre}
            placeholder="Ej: Carayá Handball"
            disabled={loading}
            class="w-full p-3 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label for="deporteId" class="block font-semibold text-gray-800 mb-2">
            Deporte:
          </label>
          <select
            id="deporteId"
            bind:value={formData.deporteId}
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
          <fieldset class="border-0 p-0 m-0">
            <legend class="block font-semibold text-gray-800 mb-2">
              Tipo de Equipo:
            </legend>
            <div class="flex gap-4">
              <label class="flex items-center">
                <input
                  type="radio"
                  bind:group={formData.local}
                  value={true}
                  disabled={loading}
                  class="mr-2"
                />
                Local
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  bind:group={formData.local}
                  value={false}
                  disabled={loading}
                  class="mr-2"
                />
                Visitante
              </label>
            </div>
          </fieldset>
        </div>

        <!-- Logo -->
        <div>
          <label for="logo" class="block font-semibold text-gray-800 mb-2">
            Logo del Equipo (opcional):
          </label>
          <div class="space-y-2">
            {#if formData.urlLogo}
              <div
                class="flex items-center gap-2 p-2 {formData.urlLogo ===
                '/equipos/sin-logo.jpg'
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-green-50 border border-green-200'} rounded-lg"
              >
                <img
                  src={formData.urlLogo}
                  alt="Logo actual"
                  class="w-12 h-12 object-contain"
                />
                <span
                  class="{formData.urlLogo === '/equipos/sin-logo.jpg'
                    ? 'text-blue-700'
                    : 'text-green-700'} flex-1"
                >
                  {formData.urlLogo === "/equipos/sin-logo.jpg"
                    ? "Logo por defecto"
                    : "Logo actual"}
                </span>
                {#if formData.urlLogo !== "/equipos/sin-logo.jpg"}
                  <button
                    type="button"
                    on:click={() => {
                      formData.urlLogo = "/equipos/sin-logo.jpg";
                      logoFile = null;
                    }}
                    class="text-red-500 hover:text-red-700"
                    title="Usar logo por defecto"
                  >
                    ✕
                  </button>
                {/if}
              </div>
            {/if}
            <input
              id="logo"
              type="file"
              accept=".jpg,.jpeg,.png,.svg,.webp"
              on:change={handleLogoChange}
              disabled={loading || uploadingFile}
              class="w-full p-3 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p class="text-sm text-gray-500">
              Formatos permitidos: JPG, JPEG, PNG, SVG, WEBP (máx. 5MB)
            </p>
          </div>
        </div>

        <div>
          <label for="instagram" class="block font-semibold text-gray-800 mb-2">
            Instagram (opcional):
          </label>
          <input
            id="instagram"
            type="url"
            bind:value={formData.instagram}
            placeholder="https://www.instagram.com/equipo_xyz"
            disabled={loading}
            class="w-full p-3 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label for="facebook" class="block font-semibold text-gray-800 mb-2">
            Facebook (opcional):
          </label>
          <input
            id="facebook"
            type="url"
            bind:value={formData.facebook}
            placeholder="https://www.facebook.com/equipo_xyz"
            disabled={loading}
            class="w-full p-3 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label for="twitter" class="block font-semibold text-gray-800 mb-2">
            Twitter (opcional):
          </label>
          <input
            id="twitter"
            type="url"
            bind:value={formData.twitter}
            placeholder="https://www.twitter.com/equipo_xyz"
            disabled={loading}
            class="w-full p-3 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
      </div>
      <!-- Modal footer -->
      <div
        class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600 flex-shrink-0 bg-gray-50"
      >
        <button
          type="button"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          on:click={saveEquipo}
          disabled={loading || uploadingFile}
        >
          {loading
            ? "Guardando..."
            : uploadingFile
              ? "Subiendo logo..."
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
