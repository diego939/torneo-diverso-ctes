<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;

  $: podios = data.podios;
  $: deportes = data.deportes;
  $: selectedDeporteId = "";

  // Reactive filtered podios
  $: filteredPodios = selectedDeporteId
    ? podios.filter((p) => p.deporteId === parseInt(selectedDeporteId))
    : podios;

  // Reactive filtered deportes (for display)
  $: filteredDeportes = selectedDeporteId
    ? deportes.filter((d) => d.id === parseInt(selectedDeporteId))
    : deportes;

  function filterByDeporte(deporteId: string) {
    selectedDeporteId = deporteId;
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

  function getPuestoColor(puesto: number) {
    switch (puesto) {
      case 1:
        return "from-yellow-400 to-yellow-600";
      case 2:
        return "from-gray-300 to-gray-500";
      case 3:
        return "from-orange-400 to-orange-600";
      default:
        return "from-blue-400 to-blue-600";
    }
  }
</script>

<svelte:head>
  <title>Podios - Copa Corrientes Diversa</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-4 md:py-8">
  <div class="text-center mb-6 md:mb-12 text-gray-800">
    <h1
      class="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 drop-shadow-lg"
    >
      🏆 Podios Copa Corrientes Diversa
    </h1>
    <p class="text-sm md:text-base lg:text-lg xl:text-xl opacity-90 px-2">
      Los equipos/participantes destacados de cada deporte
    </p>
  </div>

  <!-- Filtro por deporte -->
  <div class="mb-4 md:mb-8">
    <div class="bg-white rounded-lg p-3 md:p-6 shadow-lg">
      <label
        for="deporte-filter"
        class="block text-sm md:text-base font-semibold text-gray-800 mb-2 md:mb-3"
      >
        Filtrar por Deporte:
      </label>
      <select
        id="deporte-filter"
        bind:value={selectedDeporteId}
        on:change={() => filterByDeporte(selectedDeporteId)}
        class="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base transition-colors duration-300 focus:outline-none focus:border-blue-500"
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
      <div class="mb-6 md:mb-12">
        <!-- Podium Display -->
        <div
          class="bg-white rounded-xl md:rounded-2xl shadow-lg p-3 md:p-6 lg:p-8"
        >
          <h2
            class="text-lg md:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 md:mb-6 text-center px-2"
          >
            {deporte.nombre}
          </h2>
          {#if deportePodios.length >= 3}
            <!-- Podium with 3 positions -->
            <div
              class="flex justify-center items-end gap-1.5 md:gap-3 lg:gap-4 mb-4 md:mb-6 lg:mb-8 overflow-x-auto pb-2 -mx-2 px-2"
            >
              <!-- 2nd Place -->
              {#each deportePodios.filter((p) => p.puesto === 2) as segundo}
                <div
                  class="flex flex-col items-center min-w-[90px] sm:min-w-[110px] md:min-w-[120px] flex-shrink-0"
                >
                  <div
                    class="bg-gradient-to-b from-gray-300 to-gray-500 text-white rounded-t-lg p-1.5 md:p-3 lg:p-4 w-20 sm:w-24 md:w-28 lg:w-32 h-14 sm:h-16 md:h-20 lg:h-24 flex items-center justify-center text-lg sm:text-xl md:text-2xl"
                  >
                    🥈
                  </div>
                  <div
                    class="bg-gray-500 text-white p-1.5 md:p-2 lg:p-3 w-20 sm:w-24 md:w-28 lg:w-32 text-center"
                  >
                    <div
                      class="font-bold text-xs sm:text-sm md:text-base lg:text-lg truncate w-full px-1"
                    >
                      {segundo.equipoNombre}
                    </div>
                    <div class="text-[10px] sm:text-xs md:text-sm mt-0.5">
                      2° Lugar
                    </div>
                  </div>
                </div>
              {/each}

              <!-- 1st Place -->
              {#each deportePodios.filter((p) => p.puesto === 1) as primero}
                <div
                  class="flex flex-col items-center min-w-[100px] sm:min-w-[120px] md:min-w-[140px] flex-shrink-0"
                >
                  <div
                    class="bg-gradient-to-b from-yellow-400 to-yellow-600 text-white rounded-t-lg p-2 md:p-3 lg:p-4 w-24 sm:w-28 md:w-32 lg:w-36 h-16 sm:h-18 md:h-24 lg:h-32 flex items-center justify-center text-xl sm:text-2xl md:text-3xl"
                  >
                    🥇
                  </div>
                  <div
                    class="bg-yellow-600 text-white p-1.5 md:p-2.5 lg:p-4 w-24 sm:w-28 md:w-32 lg:w-36 text-center"
                  >
                    <div
                      class="font-bold text-xs sm:text-sm md:text-lg lg:text-xl truncate w-full px-1"
                    >
                      {primero.equipoNombre}
                    </div>
                    <div class="text-[10px] sm:text-xs md:text-sm mt-0.5">
                      1° Lugar
                    </div>
                  </div>
                </div>
              {/each}

              <!-- 3rd Place -->
              {#each deportePodios.filter((p) => p.puesto === 3) as tercero}
                <div
                  class="flex flex-col items-center min-w-[90px] sm:min-w-[110px] md:min-w-[120px] flex-shrink-0"
                >
                  <div
                    class="bg-gradient-to-b from-orange-400 to-orange-600 text-white rounded-t-lg p-1.5 md:p-3 lg:p-4 w-20 sm:w-24 md:w-28 lg:w-32 h-12 sm:h-14 md:h-18 lg:h-20 flex items-center justify-center text-base sm:text-lg md:text-xl lg:text-2xl"
                  >
                    🥉
                  </div>
                  <div
                    class="bg-orange-600 text-white p-1.5 md:p-2 lg:p-3 w-20 sm:w-24 md:w-28 lg:w-32 text-center"
                  >
                    <div
                      class="font-bold text-xs sm:text-sm md:text-base lg:text-lg truncate w-full px-1"
                    >
                      {tercero.equipoNombre}
                    </div>
                    <div class="text-[10px] sm:text-xs md:text-sm mt-0.5">
                      3° Lugar
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {/if}

          <!-- Complete Results Table -->
          <div class="overflow-x-auto -mx-2 px-2">
            <table class="w-full min-w-[320px]">
              <thead
                class="bg-gradient-to-r from-blue-900 to-blue-700 text-white"
              >
                <tr>
                  <th
                    class="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-center font-semibold text-xs sm:text-sm md:text-base"
                    >Puesto</th
                  >
                  <th
                    class="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left font-semibold text-xs sm:text-sm md:text-base"
                    >Equipo/Participante</th
                  >
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                {#each deportePodios.sort((a, b) => a.puesto - b.puesto) as podio}
                  <tr class="hover:bg-gray-50 transition-colors duration-200">
                    <td
                      class="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-center"
                    >
                      <div
                        class="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3"
                      >
                        <span
                          class="text-xl sm:text-2xl md:text-3xl flex-shrink-0"
                          >{getPuestoEmoji(podio.puesto)}</span
                        >
                        <div class="flex flex-col items-center">
                          <span
                            class="font-bold text-sm sm:text-base md:text-lg lg:text-xl"
                            >{podio.puesto}°</span
                          >
                          <span
                            class="text-[10px] sm:text-xs text-gray-500 hidden sm:block"
                            >Lugar</span
                          >
                        </div>
                      </div>
                    </td>
                    <td class="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
                      <div
                        class="font-medium text-gray-900 text-sm sm:text-base md:text-lg break-words"
                      >
                        {podio.equipoNombre}
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
    <div
      class="bg-white rounded-xl md:rounded-2xl p-8 md:p-12 lg:p-16 shadow-lg text-center"
    >
      <div class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-4 md:mb-6">
        🏆
      </div>
      <h2
        class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4 px-2"
      >
        {#if selectedDeporteId}
          No hay podios para {filteredDeportes[0]?.nombre || "este deporte"}
        {:else}
          No hay podios registrados aún
        {/if}
      </h2>
      <p class="text-sm sm:text-base md:text-lg text-gray-600 px-2">
        {#if selectedDeporteId}
          Los resultados para {filteredDeportes[0]?.nombre || "este deporte"} se
          publicarán pronto.
        {:else}
          Los resultados de la Copa Corrientes Diversa se publicarán
          próximamente.
        {/if}
      </p>
    </div>
  {/if}

  <!-- Estadísticas generales -->
  {#if podios.length > 0}
    <div
      class="mt-8 md:mt-12 lg:mt-16 bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 text-white text-center"
    >
      <h3 class="text-lg sm:text-xl md:text-2xl font-bold mb-3 md:mb-4">
        🏅 Estadísticas del Torneo
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
        <div class="bg-white bg-opacity-20 rounded-lg p-3 md:p-4">
          <div class="text-xl sm:text-2xl md:text-3xl font-bold text-blue-500">
            {deportes.length}
          </div>
          <div
            class="text-xs sm:text-sm md:text-base opacity-90 mt-1 text-blue-500"
          >
            Deportes
          </div>
        </div>
        <div class="bg-white bg-opacity-20 rounded-lg p-3 md:p-4">
          <div class="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">
            {podios.length}
          </div>
          <div
            class="text-xs sm:text-sm md:text-base opacity-90 mt-1 text-green-600"
          >
            Equipos/Participantes en Podios
          </div>
        </div>
        <div class="bg-white bg-opacity-20 rounded-lg p-3 md:p-4">
          <div class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-600">
            {podios.filter((p) => p.puesto === 1).length}
          </div>
          <div
            class="text-xs sm:text-sm md:text-base opacity-90 mt-1 text-gray-600"
          >
            Campeones
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
