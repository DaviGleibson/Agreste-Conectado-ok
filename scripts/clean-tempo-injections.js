// Script para remover injeções do Tempo dos arquivos
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const targetFile = path.join(__dirname, '../src/components/VideoSection.tsx');

function cleanFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        // Remove imports do Tempo que aparecem antes do "use client"
        content = content.replace(
            /^import\s+["']\.\/inject-tempo-devtools[^"']*["'];\s*\n?/gm,
            ''
        );
        
        // Se o conteúdo mudou, salva o arquivo
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`[Tempo Cleaner] Removidas injeções do Tempo de ${path.basename(filePath)}`);
        }
    } catch (error) {
        // Ignora erros
    }
}

// Limpa o arquivo imediatamente
cleanFile(targetFile);

// Monitora mudanças no arquivo
const watcher = chokidar.watch(targetFile, {
    persistent: true,
    ignoreInitial: false,
});

watcher.on('change', (filePath) => {
    // Aguarda um pouco para garantir que o Tempo terminou de injetar
    setTimeout(() => {
        cleanFile(filePath);
    }, 100);
});

console.log(`[Tempo Cleaner] Monitorando ${targetFile}...`);

