<script lang="ts">
  import { onMount } from "svelte";
  import { toast } from "$lib/stores/toast";
  import { enhance } from "$app/forms";
  import type { PageData } from "./$types";

  export let data: PageData;

  let banners = data.banners;
  let availableImages = data.availableImages;
  let isLoading = false;
  let showCreateForm = false;
  let editingBanner: any = null;
  let showDeleteConfirm = false;
  let bannerToDelete: any = null;
  let uploadingFile = false;
  let dragOver = false;

  // Formulario de banner
  let formData = {
    encabezado: "",
    textoPie: "",
    urlLocation: "",
    torneoId: 0,
  };

  // Imágenes separadas para mejor reactividad
  let bannerImagenes: string[] = [];

  // Obtener torneos disponibles (asumiendo que hay una relación)
  let torneos: any[] = [];

  onMount(async () => {
    try {
      const response = await fetch("/api/admin/torneos");
      if (response.ok) {
        torneos = await response.json();
        if (torneos.length > 0) {
          formData.torneoId = torneos[0].id;
        }
      }
    } catch (err) {
      console.error("Error cargando torneos:", err);
    }
  });

  function startCreate() {
    showCreateForm = true;
    editingBanner = null;
    formData = {
      encabezado: "",
      textoPie: "",
      urlLocation: "",
      torneoId: torneos.length > 0 ? torneos[0].id : 0,
    };
    bannerImagenes = [];
  }

  function startEdit(banner: any) {
    editingBanner = banner;
    showCreateForm = true;
    formData = {
      encabezado: banner.encabezado,
      textoPie: banner.textoPie,
      urlLocation: banner.urlLocation,
      torneoId: banner.torneoId,
    };
    bannerImagenes = Array.isArray(banner.urlImagenes)
      ? banner.urlImagenes
      : [];
  }

  function cancelForm() {
    showCreateForm = false;
    editingBanner = null;
    formData = {
      encabezado: "",
      textoPie: "",
      urlLocation: "",
      torneoId: torneos.length > 0 ? torneos[0].id : 0,
    };
    bannerImagenes = [];
  }

  function toggleImage(imageUrl: string) {
    if (bannerImagenes.includes(imageUrl)) {
      bannerImagenes = bannerImagenes.filter((img) => img !== imageUrl);
    } else {
      bannerImagenes = [...bannerImagenes, imageUrl];
    }
  }

  function confirmDelete(banner: any) {
    bannerToDelete = banner;
    showDeleteConfirm = true;
  }

  function cancelDelete() {
    showDeleteConfirm = false;
    bannerToDelete = null;
  }

  function handleSuccess(message: string) {
    toast.success(message);
    showCreateForm = false;
    editingBanner = null;
  }

  function handleError(error: string) {
    toast.error(error);
  }

  // Funciones para manejo de archivos
  async function handleFileUpload(file: File) {
    if (!file) return;

    uploadingFile = true;
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/admin/upload-banner", {
        method: "POST",
        body: uploadFormData,
      });

      const result = await response.json();

      if (result.success) {
        // Agregar la nueva imagen a la lista de disponibles
        availableImages = [...availableImages, result.url].sort();
        // También agregarla a las imágenes seleccionadas
        bannerImagenes = [...bannerImagenes, result.url];
        toast.success("Imagen subida exitosamente");
      } else {
        toast.error(result.error || "Error subiendo imagen");
      }
    } catch (err) {
      console.error("Error subiendo archivo:", err);
      toast.error("Error subiendo imagen");
    } finally {
      uploadingFile = false;
    }
  }

  function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    dragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    dragOver = true;
  }

  function handleDragLeave(event: DragEvent) {
    event.preventDefault();
    dragOver = false;
  }

  // Funciones para reordenar imágenes
  function moveImageUp(index: number) {
    if (index > 0) {
      const newImages = [...bannerImagenes];
      [newImages[index - 1], newImages[index]] = [
        newImages[index],
        newImages[index - 1],
      ];
      bannerImagenes = newImages;
    }
  }

  function moveImageDown(index: number) {
    if (index < bannerImagenes.length - 1) {
      const newImages = [...bannerImagenes];
      [newImages[index], newImages[index + 1]] = [
        newImages[index + 1],
        newImages[index],
      ];
      bannerImagenes = newImages;
    }
  }

  function removeImageFromBanner(imageUrl: string) {
    bannerImagenes = bannerImagenes.filter((img) => img !== imageUrl);
  }
</script>

<svelte:head>
  <title>Banners - Panel de Administración</title>
</svelte:head>

<div class="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
  <div class="text-center mb-8 md:mb-12">
    <h1 class="text-2xl md:text-3xl mb-2 drop-shadow-lg text-gray-800">
      🎨 Gestión de Banners
    </h1>
    <p class="text-sm md:text-base text-gray-600">
      Administra los banners del torneo
    </p>
  </div>

  <!-- Botón para crear nuevo banner -->
  <div class="mb-6">
    <button
      type="button"
      on:click={startCreate}
      class="bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm md:text-base w-full sm:w-auto justify-center"
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
      Nuevo Banner
    </button>
  </div>

  <!-- Lista de banners -->
  <div class="grid gap-4 md:gap-6">
    {#each banners as banner}
      <div class="bg-white rounded-lg shadow-lg p-4 md:p-6">
        <div
          class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4"
        >
          <div class="flex-1 min-w-0">
            <h3
              class="text-lg md:text-xl font-semibold text-gray-800 mb-2 break-words"
            >
              {banner.encabezado}
            </h3>
            <p class="text-sm md:text-base text-gray-600 mb-2 break-words">
              {banner.textoPie}
            </p>
            {#if banner.urlLocation}
              <p class="text-xs md:text-sm text-blue-600 truncate">
                <a
                  href={banner.urlLocation}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1"
                  title={banner.urlLocation}
                >
                  <svg
                    class="w-4 h-4 flex-shrink-0"
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
                      d="M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.102-1.101m-.758-4.899a4 4 0 0 0 5.656 0l4-4a4 4 0 0 0-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  <span class="truncate">{banner.urlLocation}</span>
                </a>
              </p>
            {/if}
            <p class="text-xs md:text-sm text-gray-500 mt-2">
              Torneo: {banner.torneo.nombre}
            </p>
          </div>
          <div class="flex gap-2 flex-shrink-0">
            <button
              type="button"
              on:click={() => startEdit(banner)}
              class="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              title="Editar"
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
                  d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                />
              </svg>
            </button>
            <button
              type="button"
              on:click={() => confirmDelete(banner)}
              class="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
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
                  d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Imágenes del banner -->
        {#if Array.isArray(banner.urlImagenes) && banner.urlImagenes.length > 0}
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center"
          >
            {#each banner.urlImagenes as imageUrl}
              <div class="relative w-full max-w-xs">
                <img
                  src={String(imageUrl)}
                  alt=""
                  class="w-full h-32 sm:h-24 md:h-28 lg:h-32 xl:h-36 object-cover rounded border hover:scale-105 transition-transform duration-200"
                />
              </div>
            {/each}
          </div>
        {:else}
          <p class="text-gray-500 text-sm italic">Sin imágenes</p>
        {/if}
      </div>
    {:else}
      <div class="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
        <div class="text-4xl md:text-6xl mb-4">🎨</div>
        <h3 class="text-lg md:text-xl text-gray-600 mb-2">No hay banners</h3>
        <p class="text-sm md:text-base text-gray-500">
          Crea tu primer banner para comenzar
        </p>
      </div>
    {/each}
  </div>

  <!-- Formulario de creación/edición -->
  {#if showCreateForm}
    <div
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div class="p-4 md:p-6">
          <div class="flex justify-between items-center mb-4 md:mb-6">
            <h2 class="text-xl md:text-2xl font-semibold text-gray-800">
              {editingBanner ? "Editar Banner" : "Nuevo Banner"}
            </h2>
            <button
              type="button"
              on:click={cancelForm}
              class="p-1 text-gray-500 hover:text-gray-700"
              title="Cerrar"
            >
              <svg
                class="w-6 h-6"
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

          <form
            method="POST"
            action={editingBanner ? "?/update" : "?/create"}
            use:enhance={() => {
              return async ({ result }) => {
                if (result.type === "success") {
                  handleSuccess(
                    String(result.data?.message || "Operación exitosa")
                  );
                  // Recargar la página para mostrar los cambios
                  window.location.reload();
                } else if (result.type === "failure") {
                  handleError(
                    String(result.data?.error || "Error desconocido")
                  );
                }
              };
            }}
          >
            {#if editingBanner}
              <input type="hidden" name="id" value={editingBanner.id} />
            {/if}

            <!-- Campos ocultos para mantener el orden de las imágenes -->
            {#each bannerImagenes as imageUrl}
              <input type="hidden" name="imagenes" value={imageUrl} />
            {/each}

            <div class="grid md:grid-cols-2 gap-4 md:gap-6">
              <!-- Encabezado -->
              <div class="md:col-span-2">
                <label
                  for="encabezado"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Encabezado *
                </label>
                <input
                  type="text"
                  id="encabezado"
                  name="encabezado"
                  bind:value={formData.encabezado}
                  required
                  class="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Título del banner"
                />
              </div>

              <!-- Texto del pie -->
              <div class="md:col-span-2">
                <label
                  for="textoPie"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Texto del Pie *
                </label>
                <textarea
                  id="textoPie"
                  name="textoPie"
                  bind:value={formData.textoPie}
                  required
                  rows="4"
                  class="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Texto que aparecerá en la parte inferior del banner"
                ></textarea>
              </div>

              <!-- URL de ubicación -->
              <div class="md:col-span-2">
                <label
                  for="urlLocation"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  URL de Ubicación
                </label>
                <input
                  type="url"
                  id="urlLocation"
                  name="urlLocation"
                  bind:value={formData.urlLocation}
                  class="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://ejemplo.com"
                />
              </div>

              <!-- Torneo -->
              <div class="md:col-span-2">
                <label
                  for="torneoId"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Torneo *
                </label>
                <select
                  id="torneoId"
                  name="torneoId"
                  bind:value={formData.torneoId}
                  required
                  class="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {#each torneos as torneo}
                    <option value={torneo.id}>{torneo.nombre}</option>
                  {/each}
                </select>
              </div>
            </div>

            <!-- Subida de nuevas imágenes -->
            <div class="mt-4 md:mt-6">
              <h3
                class="text-base md:text-lg font-medium text-gray-700 mb-3 md:mb-4"
              >
                Subir Nueva Imagen
              </h3>
              <div
                class="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-6 text-center transition-colors {dragOver
                  ? 'border-blue-500 bg-blue-50'
                  : 'hover:border-gray-400'}"
                role="region"
                aria-label="Zona de subida de archivos"
                on:drop={handleDrop}
                on:dragover={handleDragOver}
                on:dragleave={handleDragLeave}
              >
                <input
                  type="file"
                  id="file-upload"
                  accept="image/*"
                  on:change={handleFileSelect}
                  class="sr-only"
                  disabled={uploadingFile}
                />
                <label for="file-upload" class="cursor-pointer">
                  {#if uploadingFile}
                    <div class="text-blue-600">
                      <div
                        class="animate-spin w-6 h-6 md:w-8 md:h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"
                      ></div>
                      <p class="text-xs md:text-sm">Subiendo imagen...</p>
                    </div>
                  {:else}
                    <div class="text-gray-600">
                      <svg
                        class="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 text-gray-400"
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <p class="text-xs md:text-sm mb-2">
                        Arrastra una imagen aquí o haz clic para seleccionar
                      </p>
                      <p class="text-xs text-gray-500">
                        Formatos: JPG, PNG, GIF, WebP (máx. 5MB)
                      </p>
                    </div>
                  {/if}
                </label>
              </div>
            </div>

            <!-- Imágenes seleccionadas para el banner -->
            {#if bannerImagenes.length > 0}
              <div class="mt-4 md:mt-6">
                <h3
                  class="text-base md:text-lg font-medium text-gray-700 mb-3 md:mb-4"
                >
                  Imágenes del Banner ({bannerImagenes.length})
                </h3>
                <div class="space-y-2 md:space-y-3">
                  {#each bannerImagenes as imageUrl, index}
                    <div
                      class="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg"
                    >
                      <span
                        class="text-xs md:text-sm text-gray-500 w-6 flex-shrink-0"
                        >{index + 1}.</span
                      >
                      <img
                        src={imageUrl}
                        alt=""
                        class="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded border hover:scale-105 transition-transform duration-200 flex-shrink-0"
                      />
                      <div class="flex-1 min-w-0">
                        <p
                          class="text-xs md:text-sm font-medium text-gray-800 truncate"
                        >
                          {imageUrl.split("/").pop()}
                        </p>
                        <p class="text-xs text-gray-500">Imagen del banner</p>
                      </div>
                      <div class="flex gap-1 flex-shrink-0">
                        <button
                          type="button"
                          on:click={() => moveImageUp(index)}
                          disabled={index === 0}
                          class="p-1.5 md:p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                          title="Mover arriba"
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
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          on:click={() => moveImageDown(index)}
                          disabled={index === bannerImagenes.length - 1}
                          class="p-1.5 md:p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                          title="Mover abajo"
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
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          on:click={() => removeImageFromBanner(imageUrl)}
                          class="p-1.5 md:p-2 text-red-500 hover:text-red-700"
                          title="Quitar del banner"
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
                </div>
              </div>
            {/if}

            <!-- Selección de imágenes disponibles -->
            <div class="mt-4 md:mt-6">
              <h3
                class="text-base md:text-lg font-medium text-gray-700 mb-3 md:mb-4"
              >
                Imágenes Disponibles
              </h3>
              <div
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 max-h-80 overflow-y-auto justify-items-center"
              >
                {#each availableImages as imageUrl}
                  <div class="relative w-full max-w-xs">
                    <label class="cursor-pointer">
                      <input
                        type="checkbox"
                        value={imageUrl}
                        checked={bannerImagenes.includes(imageUrl)}
                        on:change={() => toggleImage(imageUrl)}
                        class="sr-only"
                      />
                      <div
                        class="border-2 rounded-lg p-2 transition-colors {bannerImagenes.includes(
                          imageUrl
                        )
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'}"
                      >
                        <img
                          src={imageUrl}
                          alt=""
                          class="w-full h-32 sm:h-20 md:h-24 lg:h-28 xl:h-32 object-cover rounded hover:scale-105 transition-transform duration-200"
                        />
                        <div class="text-center mt-2">
                          <span class="text-xs text-gray-600">
                            {imageUrl.split("/").pop()}
                          </span>
                        </div>
                      </div>
                    </label>
                  </div>
                {/each}
              </div>
              {#if availableImages.length === 0}
                <p class="text-gray-500 text-sm italic">
                  No hay imágenes disponibles. Sube una imagen arriba para
                  comenzar.
                </p>
              {/if}
            </div>

            <!-- Botones -->
            <div
              class="flex flex-col sm:flex-row justify-end gap-3 md:gap-4 mt-4 md:mt-6 pt-4 md:pt-6 border-t"
            >
              <button
                type="button"
                on:click={cancelForm}
                class="px-4 md:px-6 py-2 text-sm md:text-base text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                class="px-4 md:px-6 py-2 text-sm md:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors w-full sm:w-auto"
              >
                {isLoading
                  ? "Guardando..."
                  : editingBanner
                    ? "Actualizar"
                    : "Crear"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  {/if}

  <!-- Confirmación de eliminación -->
  {#if showDeleteConfirm && bannerToDelete}
    <div
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-4 md:p-6">
          <h3
            class="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4"
          >
            Confirmar Eliminación
          </h3>
          <p
            class="text-sm md:text-base text-gray-600 mb-4 md:mb-6 break-words"
          >
            ¿Estás seguro de que quieres eliminar el banner "{bannerToDelete.encabezado}"?
            Esta acción no se puede deshacer.
          </p>
          <div class="flex flex-col sm:flex-row justify-end gap-3 md:gap-4">
            <button
              type="button"
              on:click={cancelDelete}
              class="px-4 py-2 text-sm md:text-base text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              Cancelar
            </button>
            <form
              method="POST"
              action="?/delete"
              use:enhance={() => {
                return async ({ result }) => {
                  if (result.type === "success") {
                    handleSuccess(
                      String(result.data?.message || "Banner eliminado")
                    );
                    showDeleteConfirm = false;
                    bannerToDelete = null;
                    window.location.reload();
                  } else if (result.type === "failure") {
                    handleError(
                      String(result.data?.error || "Error al eliminar")
                    );
                  }
                };
              }}
            >
              <input type="hidden" name="id" value={bannerToDelete.id} />
              <button
                type="submit"
                class="px-4 py-2 text-sm md:text-base bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto"
              >
                Eliminar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
