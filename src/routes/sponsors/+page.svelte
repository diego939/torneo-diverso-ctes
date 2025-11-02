<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;

  // Usar los datos que vienen del servidor
  $: sponsorsData = data.sponsors;
</script>

<div class="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
  <!-- Sección principal de sponsors -->
  <div class="bg-white rounded-2xl shadow-lg p-4 md:p-8">
    <h1
      class="text-center text-2xl md:text-4xl font-bold text-blue-900 mb-3 md:mb-4"
    >
      Sponsors
    </h1>
    <p class="text-center text-sm md:text-lg text-gray-600 mb-8 md:mb-12 px-2">
      Agradecemos el apoyo de nuestros sponsors que hacen posible este evento
    </p>

    {#if sponsorsData.length > 0}
      <div
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6"
      >
        {#each sponsorsData as sponsor}
          <div
            class="bg-white border border-gray-200 rounded-xl p-3 md:p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col items-center justify-center min-h-[120px] md:min-h-[180px] group"
          >
            {#if sponsor.redesUrl}
              <a
                href={sponsor.redesUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="flex flex-col items-center gap-3 text-decoration-none w-full"
              >
                <img
                  src={sponsor.urlImage}
                  alt={sponsor.nombre}
                  class="max-w-full max-h-16 md:max-h-24 object-contain group-hover:scale-105 transition-transform duration-200"
                />
                {#if sponsor.redesNombre}
                  <p
                    class="text-center font-semibold text-blue-900 text-xs md:text-sm"
                  >
                    {sponsor.redesNombre}
                  </p>
                {/if}
              </a>
            {:else}
              <img
                src={sponsor.urlImage}
                alt={sponsor.nombre}
                class="max-w-full max-h-16 md:max-h-24 object-contain group-hover:scale-105 transition-transform duration-200"
              />
              <p
                class="text-center font-semibold text-blue-900 text-xs md:text-sm mt-3"
              >
                {sponsor.nombre}
              </p>
            {/if}
          </div>
        {/each}
      </div>
    {:else}
      <div class="text-center py-8 md:py-16">
        <p class="text-sm md:text-lg text-gray-500">Cargando auspiciantes...</p>
      </div>
    {/if}
  </div>

  <!-- Agradecimientos especiales -->
  <div
    class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-4 md:p-8 text-center"
  >
    <h2 class="text-xl md:text-3xl font-bold text-blue-900 mb-4 md:mb-6">
      Agradecimientos Especiales
    </h2>
    <p
      class="text-sm md:text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto px-2"
    >
      Este evento es posible gracias al apoyo de: {#each sponsorsData as sponsor}
        {" " + sponsor.nombre},
      {/each} que promueven la diversidad y el deporte inclusivo.
    </p>
  </div>
</div>

<!-- Todo convertido a clases de Tailwind CSS -->
