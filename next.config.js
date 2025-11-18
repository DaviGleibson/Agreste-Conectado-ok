/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        domains: ['images.unsplash.com'],
    },
    webpack: (config, { isServer }) => {
        // Adiciona um loader para remover injeções do Tempo
        // O 'enforce: pre' tenta processar antes do SWC
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
