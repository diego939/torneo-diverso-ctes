<script lang="ts">
  import { onMount } from "svelte";
  import { toast } from "$lib/stores/toast";

  export let data;

  let sponsors = data.sponsors;
  let loading = false;
  let editingSponsor: any = null;
  let imageFile: File | null = null;
  let uploadingFile = false;

  // Variables para modal de confirmación de eliminación
  let sponsorToDelete: any = null;
  let showDeleteModal = false;
  let deleting = false;

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

  function confirmDelete(sponsor: any) {
    sponsorToDelete = sponsor;
    showDeleteModal = true;
  }

  function closeDeleteModal() {
    showDeleteModal = false;
    sponsorToDelete = null;
  }

  async function deleteSponsor() {
    if (!sponsorToDelete) return;

    deleting = true;

    try {
      const response = await fetch(
        `/api/admin/sponsors/${sponsorToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Eliminar imagen del servidor
        if (sponsorToDelete.urlImage) {
          await deleteImage(sponsorToDelete.urlImage);
        }
        await loadSponsors();
        toast.success("Sponsor eliminado exitosamente");
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

<div class="max-w-6xl mx-auto p-4 md:p-8">
  <div class="text-center mb-6 md:mb-8 text-gray-800 relative">
    <h1
      class="text-2xl md:text-3xl mb-2 drop-shadow-lg flex items-center justify-center gap-2"
    >
      <i class="bi bi-star-fill"></i>
      Gestión de Sponsors
    </h1>
    <p class="text-sm md:text-base opacity-90 mb-4">
      Administra los patrocinadores del torneo
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
      Agregar Sponsor
    </button>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
    {#each sponsors as sponsor}
      <div
        class="bg-white rounded-2xl p-4 md:p-6 shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="m-0 text-base md:text-lg text-gray-800 break-words flex-1">
            {sponsor.nombre}
          </h3>
          <div class="flex gap-2 flex-shrink-0">
            <button
              on:click={() => openForm(sponsor)}
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
              on:click={() => confirmDelete(sponsor)}
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
            <p class="m-0 text-sm md:text-base text-gray-600 break-words">
              <strong>Red Social:</strong>
              <a
                href={sponsor.redesUrl}
                target="_blank"
                class="text-indigo-500 no-underline hover:underline ml-1 truncate block"
                title={sponsor.redesUrl}>{sponsor.redesNombre}</a
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
      class="relative bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] md:max-h-[80vh] flex flex-col border border-gray-200 mx-4"
    >
      <!-- Modal header -->
      <div
        class="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 flex-shrink-0 bg-gray-50"
      >
        <h3
          class="text-lg md:text-xl font-semibold text-gray-800 break-words flex-1 pr-2"
        >
          {editingSponsor ? "Editar Sponsor" : "Nuevo Sponsor"}
          {formData.nombre ? `: ${formData.nombre}` : ""}
        </h3>
        <button
          type="button"
          class="text-gray-600 bg-transparent hover:bg-gray-200 hover:text-gray-800 rounded-lg text-sm w-8 h-8 flex-shrink-0 inline-flex justify-center items-center"
          data-modal-hide="sponsor-modal"
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
            Nombre del Sponsor:
          </label>
          <input
            id="nombre"
            type="text"
            bind:value={formData.nombre}
            placeholder="Ej: Empresa XYZ"
            disabled={loading}
            class="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <!-- Imagen -->
        <div>
          <label
            for="image"
            class="block text-sm md:text-base font-semibold text-gray-800 mb-2"
          >
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
                  class="w-12 h-12 object-contain flex-shrink-0"
                />
                <span class="text-xs md:text-sm text-green-700 flex-1 truncate"
                  >Imagen actual</span
                >
                <button
                  type="button"
                  on:click={() => {
                    formData.urlImage = "";
                    imageFile = null;
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
              id="image"
              type="file"
              accept=".jpg,.jpeg,.png,.svg,.webp"
              on:change={handleImageChange}
              disabled={loading || uploadingFile}
              class="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-xs md:text-sm transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p class="text-xs md:text-sm text-gray-500">
              Formatos permitidos: JPG, JPEG, PNG, SVG, WEBP (máx. 5MB)
            </p>
          </div>
        </div>

        <div>
          <label
            for="redesNombre"
            class="block text-sm md:text-base font-semibold text-gray-800 mb-2"
          >
            Nombre en Redes Sociales (opcional):
          </label>
          <input
            id="redesNombre"
            type="text"
            bind:value={formData.redesNombre}
            placeholder="Ej: @empresa_xyz"
            disabled={loading}
            class="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label
            for="redesUrl"
            class="block text-sm md:text-base font-semibold text-gray-800 mb-2"
          >
            URL de Red Social (opcional):
          </label>
          <input
            id="redesUrl"
            type="url"
            bind:value={formData.redesUrl}
            placeholder="https://www.instagram.com/empresa_xyz"
            disabled={loading}
            class="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base transition-colors duration-300 focus:outline-none focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
      </div>
      <!-- Modal footer -->
      <div
        class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 md:p-5 border-t border-gray-200 rounded-b flex-shrink-0 bg-gray-50"
      >
        <button
          type="button"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm md:text-base px-4 md:px-5 py-2 md:py-2.5 text-center flex items-center justify-center gap-2 w-full sm:w-auto order-2 sm:order-1"
          on:click={saveSponsor}
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
            Subiendo imagen...
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
  {#if showDeleteModal && sponsorToDelete}
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
            ¿Estás seguro de que quieres eliminar el sponsor
            <strong class="text-gray-900">"{sponsorToDelete.nombre}"</strong>?
          </p>
          <p class="text-xs md:text-sm text-red-600">
            Esta acción no se puede deshacer. Todos los datos relacionados con
            este sponsor serán eliminados permanentemente, incluyendo su imagen.
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
            on:click={deleteSponsor}
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
