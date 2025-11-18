"use client";

export default function VideoSection() {
  return (
    <section
      id="video"
      className="py-20 md:py-32 bg-white relative overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Conheça Nossa Plataforma
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Veja como é fácil criar sua loja online e começar a vender
          </p>
        </div>

        {/* Video Container */}
        <div className="max-w-5xl mx-auto">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
            <video
              className="w-full h-full object-cover"
              controls
              poster="/videos/poster.jpg"
            >
              <source src="/videos/apresentacao.mp4" type="video/mp4" />
              <source src="/videos/apresentacao.webm" type="video/webm" />
              Seu navegador não suporta a tag de vídeo.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}

