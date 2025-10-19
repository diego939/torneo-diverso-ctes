<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;

  let currentSlide = 0;

  // Usar los datos que vienen del servidor
  $: torneo = data.torneoInfo;
  $: bannersData = data.banners;

  function nextSlide() {
    if (bannersData.length > 0 && bannersData[0].urlImagenes) {
      currentSlide = (currentSlide + 1) % bannersData[0].urlImagenes.length;
    }
  }

  function prevSlide() {
    if (bannersData.length > 0 && bannersData[0].urlImagenes) {
      currentSlide =
        (currentSlide - 1 + bannersData[0].urlImagenes.length) %
        bannersData[0].urlImagenes.length;
    }
  }
</script>

<div class="max-w-6xl mx-auto px-4">
  {#if torneo}
    <!-- Banner principal -->
    <div class="grid mt-2">
      <img
        class="w-full max-w-6xl mx-auto mb-4 bg-black border border-slate-900 rounded-2xl shadow-sm block"
        src={torneo.imagenPrincipal}
        alt={torneo.nombre}
      />
    </div>

    <!-- Presentación del torneo -->
    <div
      class="w-full max-w-6xl mx-auto mb-5 px-2.5 py-4.5 border border-gray-200 bg-white rounded-2xl shadow-sm mt-2 mb-4"
    >
      <div
        class="rounded-2xl shadow-sm mb-4 overflow-hidden bg-black border border-gray-200"
      >
        <div
          class="rounded-t-2xl font-semibold bg-black text-white text-center tracking-wide px-3 md:px-5 py-3 md:py-4 text-xl md:text-3xl"
        >
          Copa Corrientes Diversa {data.config?.anio}
        </div>
        <div
          class="text-center bg-cover bg-center text-white p-4 md:p-8"
          style="background-image: url(/images/pride-patern.jpg); opacity: 0.9;"
        >
          <p class="text-white font-medium drop-shadow-lg text-sm md:text-xl">
            {torneo.descripcion}
          </p>
        </div>
      </div>
    </div>

    <!-- Carrusel de cronograma -->
    {#if bannersData.length > 0 && bannersData[0].urlImagenes && bannersData[0].urlImagenes.length > 0}
      <div
        class="w-full max-w-6xl mx-auto mb-5 px-2.5 py-4.5 border border-gray-200 bg-white rounded-2xl shadow-sm mt-2 mb-4"
      >
        <h2 class="text-center text-lg md:text-2xl font-bold mb-4 md:mb-6">
          Copa Corrientes Diversa {data.config?.anio} 🏆
        </h2>
        <div class="relative max-w-4xl mx-auto my-5 rounded-xl overflow-hidden">
          <button
            class="absolute left-1 md:left-2.5 top-1/2 -translate-y-1/2 bg-black/50 text-white border-none p-2 md:p-4 cursor-pointer rounded-full text-lg md:text-2xl transition-colors duration-300 z-10 hover:bg-black/80"
            on:click={prevSlide}
            aria-label="Anterior"
          >
            <i class="bi bi-chevron-left"></i>
          </button>
          <img
            src={bannersData[0].urlImagenes[currentSlide]}
            alt="Cronograma"
            class="w-full h-auto block"
          />
          <button
            class="absolute right-1 md:right-2.5 top-1/2 -translate-y-1/2 bg-black/50 text-white border-none p-2 md:p-4 cursor-pointer rounded-full text-lg md:text-2xl transition-colors duration-300 z-10 hover:bg-black/80"
            on:click={nextSlide}
            aria-label="Siguiente"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
        <div class="flex justify-center gap-2.5 mt-4">
          {#each bannersData[0].urlImagenes as _, index}
            <button
              class="w-3 h-3 rounded-full border-2 border-blue-900 bg-transparent cursor-pointer transition-colors duration-300 {index ===
              currentSlide
                ? 'bg-blue-900'
                : ''}"
              on:click={() => (currentSlide = index)}
              aria-label="Ir a imagen {index + 1}"
            ></button>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Fundamentación -->
    <div
      class="w-full max-w-6xl mx-auto mb-5 px-2.5 py-4.5 border border-gray-200 bg-white rounded-2xl shadow-sm mt-2 mb-4"
    >
      <h2 class="text-center text-lg md:text-2xl font-bold mb-4 md:mb-6">
        {torneo.fundamentacionTitulo}
      </h2>
      <div
        class="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 md:gap-5 mt-4 md:mt-5"
      >
        {#each torneo.fundamentacionTexto as texto}
          <div class="bg-gray-50 p-4 md:p-5 rounded-xl">
            <p class="text-justify text-sm md:text-base">{texto}</p>
          </div>
        {/each}
      </div>
    </div>

    <!-- CTA Deportes -->
    <div
      class="w-full max-w-6xl mx-auto mb-5 px-2.5 py-4.5 border border-gray-200 bg-white rounded-2xl shadow-sm text-center"
    >
      <h2 class="text-lg md:text-2xl font-bold mb-3 md:mb-4">
        Participa en nuestros deportes
      </h2>
      <p class="mb-4 md:mb-6 text-gray-600 text-sm md:text-base">
        Consulta los horarios, reglamentos y fixtures de cada disciplina
      </p>
      <a
        href="/deportes"
        class="inline-block rounded-lg transition-all duration-200 px-6 md:px-10 py-3 md:py-4 border-none cursor-pointer font-medium bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white hover:shadow-lg text-base md:text-xl"
      >
        Ver Deportes <i class="bi bi-arrow-right"></i>
      </a>
    </div>
  {:else}
    <div class="text-center py-16">
      <p class="text-lg">Cargando información del torneo...</p>
    </div>
  {/if}
</div>

<!-- Todo convertido a clases de Tailwind CSS -->
