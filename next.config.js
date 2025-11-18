/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        domains: ['images.unsplash.com'],
    },
    webpack: (config, { isServer }) => {
        // Adiciona um loader para remover injeções do Tempo antes do processamento
        // Este loader processa os arquivos antes do SWC
        if (!isServer) {
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
        }
        
        return config;
    },
};

module.exports = nextConfig;
