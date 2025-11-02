<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;

  // Usar los datos que vienen del servidor
  $: deportesData = data.deportes;
  $: selectedDeporteId = "";

  // Reactive filtered deportes
  $: filteredDeportes = selectedDeporteId
    ? deportesData.filter((d) => d.id === parseInt(selectedDeporteId))
    : deportesData;

  function filterByDeporte(deporteId: string) {
    selectedDeporteId = deporteId;
  }
</script>

<svelte:head>
  <title>Deportes - Copa Corrientes Diversa</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-8">
  <div class="text-center mb-8 md:mb-12 text-gray-800 px-4">
    <h1 class="text-2xl md:text-4xl font-bold mb-4 drop-shadow-lg">
      🏆 Deportes Copa Corrientes Diversa
    </h1>
    <p class="text-base md:text-lg lg:text-xl opacity-90">
      Selecciona un deporte para ver más información, reglamentos, fixtures y
      horarios
    </p>
  </div>

  <!-- Filtro por deporte -->
  <div class="mb-6 md:mb-8 px-4">
    <div class="bg-white rounded-lg p-4 md:p-6 shadow-lg">
      <label
        for="deporte-filter"
        class="block font-semibold text-gray-800 mb-3"
      >
        Filtrar por Deporte:
      </label>
      <select
        id="deporte-filter"
        bind:value={selectedDeporteId}
        on:change={() => filterByDeporte(selectedDeporteId)}
        class="w-full p-3 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-blue-500"
      >
        <option value="">Todos los deportes</option>
        {#each deportesData as deporte}
          <option value={deporte.id}>{deporte.nombre}</option>
        {/each}
      </select>
    </div>
  </div>

  <!-- Deportes agrupados -->
  {#if filteredDeportes.length > 0}
    {#each filteredDeportes as deporte}
      <div class="mb-8 md:mb-12 px-4">
        <h2
          class="text-xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6 text-center"
        >
          {deporte.nombre}
        </h2>

        <!-- Card del deporte -->
        <div class="bg-white rounded-2xl shadow-lg p-4 md:p-8">
          <!-- Información del deporte -->
          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8"
          >
            <!-- Imagen/Icono del deporte -->
            <div class="flex justify-center items-center">
              <div
                class="bg-gradient-to-br from-blue-500 to-blue-700 rounded-full p-8 md:p-12 shadow-lg"
              >
                <i class="bi bi-trophy-fill text-4xl md:text-6xl text-white"
                ></i>
              </div>
            </div>

            <!-- Información detallada -->
            <div class="flex flex-col justify-center space-y-4">
              {#if deporte.fechasCompetencia && deporte.fechasCompetencia.length > 0}
                <div class="flex items-center gap-3">
                  <div class="bg-blue-100 rounded-full p-2">
                    <i class="bi bi-calendar-event text-blue-600 text-lg"></i>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-800">
                      {deporte.fechasCompetencia.length} fecha{deporte
                        .fechasCompetencia.length > 1
                        ? "s"
                        : ""} de competencia
                    </p>
                    <p class="text-sm text-gray-600">Programación del torneo</p>
                  </div>
                </div>
              {/if}

              {#if deporte.locationsNombre && deporte.locationsNombre.length > 0}
                <div class="flex items-center gap-3">
                  <div class="bg-green-100 rounded-full p-2">
                    <i class="bi bi-geo-alt-fill text-green-600 text-lg"></i>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-800">Ubicación</p>
                    <p class="text-sm text-gray-600">
                      {deporte.locationsNombre[0]}
                    </p>
                  </div>
                </div>
              {/if}
            </div>
          </div>

          <!-- Card de ver más información -->
          <div class="mb-6 md:mb-8">
            <div
              class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 md:p-8 text-white shadow-lg border-4 border-white hover:shadow-xl transition-all duration-300"
            >
              <div
                class="flex flex-col md:flex-row items-center justify-between gap-4"
              >
                <div class="flex-1 text-center md:text-left">
                  <h3 class="text-xl md:text-2xl font-bold mb-2">
                    📋 Información Completa del Deporte
                  </h3>
                  <p class="text-sm md:text-base opacity-90 mb-3">
                    Para acceder a la información completa del deporte, haz clic
                    en el botón "Ver más"
                  </p>
                  <div
                    class="flex flex-wrap justify-center md:justify-start gap-2 text-xs md:text-sm"
                  >
                    {#if deporte.horarios && deporte.horarios.length > 0}
                      <span
                        class="bg-blue-500 bg-opacity-20 px-2 py-1 rounded-full"
                      >
                        ⏰ Horarios
                      </span>
                    {/if}
                    {#if deporte.locationsNombre && deporte.locationsNombre.length > 0}
                      <span
                        class="bg-green-500 bg-opacity-20 px-2 py-1 rounded-full"
                      >
                        📍 Lugares
                      </span>
                    {/if}
                    {#if deporte.reglamento}
                      <span
                        class="bg-yellow-500 bg-opacity-20 px-2 py-1 rounded-full"
                      >
                        📄 Reglamento
                      </span>
                    {/if}
                    {#if deporte.fixture}
                      <span
                        class="bg-blue-500 bg-opacity-20 px-2 py-1 rounded-full"
                      >
                        📊 Fixture
                      </span>
                    {/if}
                    {#if deporte.planilla}
                      <span
                        class="bg-green-500 bg-opacity-20 px-2 py-1 rounded-full"
                      >
                        📋 Planilla
                      </span>
                    {/if}
                    {#if deporte.grupoUrlWhatsapp}
                      <span
                        class="bg-blue-500 bg-opacity-20 px-2 py-1 rounded-full"
                      >
                        💬 WhatsApp
                      </span>
                    {/if}
                  </div>
                </div>
                <div class="flex-shrink-0">
                  <a
                    href="/deportes/{deporte.id}"
                    class="inline-flex items-center gap-2 bg-white text-indigo-600 font-bold px-6 md:px-8 py-3 md:py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
                  >
                    <i class="bi bi-eye-fill"></i>
                    <span>Ver más</span>
                    <i class="bi bi-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/each}
  {:else}
    <div class="bg-white rounded-2xl p-16 shadow-lg text-center mx-4">
      <div class="text-8xl mb-6">🏆</div>
      <h2 class="text-2xl font-bold text-gray-800 mb-4">
        {#if selectedDeporteId}
          No hay deportes que coincidan con el filtro
        {:else}
          No hay deportes registrados aún
        {/if}
      </h2>
      <p class="text-gray-600 text-lg">
        {#if selectedDeporteId}
          Intenta seleccionar un deporte diferente o "Todos los deportes".
        {:else}
          Los deportes de la Copa Corrientes Diversa se publicarán próximamente.
        {/if}
      </p>
    </div>
  {/if}

  <!-- Estadísticas generales -->
  {#if deportesData.length > 0}
    <div
      class="mt-12 md:mt-16 bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-6 md:p-8 text-white text-center mx-4"
    >
      <h3 class="text-xl md:text-2xl font-bold mb-4">
        📊 Estadísticas del Torneo
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div
          class="bg-white bg-opacity-20 rounded-lg p-3 md:p-4 text-green-800"
        >
          <div class="text-2xl md:text-3xl font-bold">
            {deportesData.length}
          </div>
          <div class="text-xs md:text-sm opacity-90">Deportes Disponibles</div>
        </div>
        <div class="bg-white bg-opacity-20 rounded-lg p-3 md:p-4 text-blue-800">
          <div class="text-2xl md:text-3xl font-bold">
            {deportesData.filter((d) => d.reglamento).length}
          </div>
          <div class="text-xs md:text-sm opacity-90">Con Reglamentos</div>
        </div>
        <div
          class="bg-white bg-opacity-20 rounded-lg p-3 md:p-4 text-yellow-800"
        >
          <div class="text-2xl md:text-3xl font-bold">
            {deportesData.filter((d) => d.fixture).length}
          </div>
          <div class="text-xs md:text-sm opacity-90">Con Fixtures</div>
        </div>
      </div>
    </div>
  {/if}
</div>
