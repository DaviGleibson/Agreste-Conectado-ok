// Plugin SWC para remover injeções do Tempo
module.exports = function removeTempoInjections() {
    return {
        visitor: {
            Program(path) {
                // Remove imports do Tempo devtools
                path.node.body = path.node.body.filter(node => {
                    if (node.type === 'ImportDeclaration') {
                        const source = node.source?.value || '';
                        if (source.includes('inject-tempo-devtools')) {
                            return false;
                        }
                    }
                    return true;
                });
            }
        }
    };
};

