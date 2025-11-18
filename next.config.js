/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        domains: ['images.unsplash.com'],
    },
    // Desabilita o SWC para transformação - usa Babel que permite processar antes da validação
    swcMinify: false,
    webpack: (config, { isServer }) => {
        // Adiciona um loader para remover injeções do Tempo ANTES do Babel processar
        // O 'enforce: pre' garante que este loader roda antes de qualquer outro
        config.module.rules.push({
            test: /\.(ts|tsx|js|jsx)$/,
            enforce: 'pre',
            exclude: /node_modules/,
            use: [
                {
                    loader: 'string-replace-loader',
                    options: {
                        search: /^import\s+["']\.\/inject-tempo-devtools[^"']*["'];\s*\n?/gm,
                        replace: '',
                        flags: 'g',
                    },
                },
            ],
        });
        
        return config;
    },
};

module.exports = nextConfig;
