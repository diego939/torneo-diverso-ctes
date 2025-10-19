<script lang="ts">
  import { onMount } from "svelte";
  import { toast } from "$lib/stores/toast";

  export let data;

  let sponsors = data.sponsors;
  let loading = false;
  let editingSponsor: any = null;
  let imageFile: File | null = null;
  let uploadingFile = false;

  let formData: any = {
    nombre: "",
    urlImage: "",
    redesNombre: "",
    redesUrl: "",
  };

  onMount(() => {
    loadSponsors();
  });

  async function loadSponsors() {
    try {
      const response = await fetch("/api/admin/sponsors");
      if (response.ok) {
        sponsors = await response.json();
      }
    } catch (error) {
      console.error("Error cargando sponsors:", error);
    }
  }

  function openForm(sponsor: any = null) {
    editingSponsor = sponsor;
    if (sponsor) {
      formData = {
        nombre: sponsor.nombre,
        urlImage: sponsor.urlImage,
        redesNombre: sponsor.redesNombre || "",
        redesUrl: sponsor.redesUrl || "",
      };
    } else {
      formData = {
        nombre: "",
        urlImage: "",
        redesNombre: "",
        redesUrl: "",
      };
    }

    // Show the modal
    const modal = document.getElementById("sponsor-modal");
    if (modal) {
      modal.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");
    }
  }

  function closeForm() {
    // Hide the modal
    const modal = document.getElementById("sponsor-modal");
    if (modal) {
      modal.classList.add("hidden");
      modal.setAttribute("aria-hidden", "true");
    }

    editingSponsor = null;
    formData = {
      nombre: "",
      urlImage: "",
      redesNombre: "",
      redesUrl: "",
    };

    // Limpiar archivo seleccionado
    imageFile = null;
  }

  async function saveSponsor() {
    if (!formData.nombre) {
      toast.error("El nombre es requerido");
      return;
    }

    if (!formData.urlImage && !imageFile) {
      toast.error("La imagen es requerida");
      return;
    }

    loading = true;

    try {
      // Subir imagen si hay una nueva
      let imageUrl = formData.urlImage;

      if (imageFile) {
        // Eliminar imagen anterior si existe
        if (formData.urlImage) {
          await deleteImage(formData.urlImage);
        }
        imageUrl = await uploadImage(imageFile);
        if (!imageUrl) return;
      }

      // Preparar datos para enviar
      const dataToSend = {
        ...formData,
        urlImage: imageUrl,
      };

      const url = editingSponsor
        ? `/api/admin/sponsors/${editingSponsor.id}`
        : "/api/admin/sponsors";

      const method = editingSponsor ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        await loadSponsors();
        closeForm();
        toast.success(
          editingSponsor
            ? "Sponsor actualizado exitosamente"
            : "Sponsor creado exitosamente"
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

  async function deleteSponsor(sponsor: any) {
    if (
      !confirm(`¿Estás seguro de que quieres eliminar "${sponsor.nombre}"?`)
    ) {
      return;
    }

    loading = true;

    try {
      const response = await fetch(`/api/admin/sponsors/${sponsor.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Eliminar imagen del servidor
        if (sponsor.urlImage) {
          await deleteImage(sponsor.urlImage);
        }
        await loadSponsors();
        toast.success("Sponsor eliminado exitosamente");
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

  // Función para subir imagen
  async function uploadImage(file: File) {
    if (!file) return null;

    uploadingFile = true;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload-sponsor", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        return result.url;
      } else {
        const error = await response.json();
        toast.error(error.error || "Error al subir imagen");
        return null;
      }
    } catch (error) {
      toast.error("Error de conexión al subir imagen");
      return null;
    } finally {
      uploadingFile = false;
    }
  }

  // Función para eliminar imagen
  async function deleteImage(imagePath: string) {
    if (!imagePath) return;

    try {
      const response = await fetch("/api/admin/delete-sponsor-image", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath: imagePath }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error deleting image:", error);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  }

  // Función para manejar cambio de archivo
  function handleImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      imageFile = file;
    }
  }
</script>

<svelte:head>
  <title>Sponsors - Panel de Administración</title>
</svelte:head>

<div class="max-w-6xl mx-auto p-8">
  <div class="text-center mb-8 text-gray-800 relative">
    <h1 class="text-3xl mb-2 drop-shadow-lg">
      <i class="bi bi-star-fill"></i> Gestión de Sponsors
    </h1>
    <p class="opacity-90 mb-4">Administra los patrocinadores del torneo</p>
    <button
      on:click={() => openForm()}
      class="bg-gradient-to-r from-green-800 to-teal-800 text-white border-0 py-3 px-6 rounded-lg font-semibold cursor-pointer transition-transform duration-300 hover:transform hover:-translate-y-0.5"
    >
      <i class="bi bi-plus-circle-fill"></i> Agregar Sponsor
    </button>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each sponsors as sponsor}
      <div
        class="bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="m-0 text-gray-800">{sponsor.nombre}</h3>
          <div class="flex gap-2">
            <button
              on:click={() => openForm(sponsor)}
              class="bg-transparent border-0 text-xl cursor-pointer p-1 rounded transition-colors duration-300 hover:bg-blue-50"
            >
              ✏️
            </button>
            <button
              on:click={() => deleteSponsor(sponsor)}
              class="bg-transparent border-0 text-xl cursor-pointer p-1 rounded transition-colors duration-300 hover:bg-red-50"
            >
              🗑️
            </button>
          </div>
        </div>

        <div class="text-center mb-4">
          {#if sponsor.urlImage}
            <img
              src={sponsor.urlImage}
              alt={sponsor.nombre}
              class="w-full h-32 object-contain rounded-lg border border-gray-200"
            />
          {/if}
        </div>

        <div class="space-y-2">
          {#if sponsor.redesNombre && sponsor.redesUrl}
            <p class="m-0 text-gray-600">
              <strong>Red Social:</strong>
              <a
                href={sponsor.redesUrl}
                target="_blank"
                class="text-indigo-500 no-underline hover:underline ml-1"
                >{sponsor.redesNombre}</a
              >
            </p>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <!-- Main modal -->
  <div
    id="sponsor-modal"
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
          {editingSponsor ? "Editar Sponsor" : "Nuevo Sponsor"}
          {formData.nombre ? `: ${formData.nombre}` : ""}
        </h3>
        <button
          type="button"
          class="text-gray-600 bg-transparent hover:bg-gray-200 hover:text-gray-800 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
          data-modal-hide="sponsor-modal"
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
            Nombre del Sponsor:
          </label>
          <input
            id="nombre"
            type="text"
            bind:value={formData.nombre}
            placeholder="Ej: Empresa XYZ"
            disabled={loading}
            class="w-full p-3 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <!-- Imagen -->
        <div>
          <label for="image" class="block font-semibold text-gray-800 mb-2">
            Logo/Imagen:
          </label>
          <div class="space-y-2">
            {#if formData.urlImage}
              <div
                class="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg"
              >
                <img
                  src={formData.urlImage}
                  alt="Imagen actual"
                  class="w-12 h-12 object-contain"
                />
                <span class="text-green-700 flex-1">Imagen actual</span>
                <button
                  type="button"
                  on:click={() => {
                    formData.urlImage = "";
                    imageFile = null;
                  }}
                  class="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            {/if}
            <input
              id="image"
              type="file"
              accept=".jpg,.jpeg,.png,.svg,.webp"
              on:change={handleImageChange}
              disabled={loading || uploadingFile}
              class="w-full p-3 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p class="text-sm text-gray-500">
              Formatos permitidos: JPG, JPEG, PNG, SVG, WEBP (máx. 5MB)
            </p>
          </div>
        </div>

        <div>
          <label
            for="redesNombre"
            class="block font-semibold text-gray-800 mb-2"
          >
            Nombre en Redes Sociales (opcional):
          </label>
          <input
            id="redesNombre"
            type="text"
            bind:value={formData.redesNombre}
            placeholder="Ej: @empresa_xyz"
            disabled={loading}
            class="w-full p-3 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label for="redesUrl" class="block font-semibold text-gray-800 mb-2">
            URL de Red Social (opcional):
          </label>
          <input
            id="redesUrl"
            type="url"
            bind:value={formData.redesUrl}
            placeholder="https://www.instagram.com/empresa_xyz"
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
          on:click={saveSponsor}
          disabled={loading || uploadingFile}
        >
          {loading
            ? "Guardando..."
            : uploadingFile
              ? "Subiendo imagen..."
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
