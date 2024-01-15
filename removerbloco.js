const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const diretorioCSV = path.resolve(__dirname, 'C:\\Users\\gesta\\Documents\\inss_outros\\');
const arquivosCSV = fs.readdirSync(diretorioCSV).filter(file => file.endsWith('.csv'));

arquivosCSV.forEach(arquivo => {
    const linhas = [];
    let removerBloco = false;

    console.log(`Processando arquivo: ${arquivo}`);

   
    const caminhoCompleto = path.join(diretorioCSV, arquivo);

   
    fs.createReadStream(caminhoCompleto)
        .pipe(csv({ separator: ';' }))
        .on('data', (linha) => {
           
            if (Object.values(linha).join(';').includes('-;-;-;-;-;-;-;-;-;-;-;-;-')) {
                removerBloco = true;
            }

           
            if (!removerBloco) {
                linhas.push(linha);
            }
        })
        .on('end', () => {
           
            const ultimaLinha = linhas[linhas.length - 1];
            if (ultimaLinha) {
                ultimaLinha[Object.keys(ultimaLinha).pop()] = ultimaLinha[Object.keys(ultimaLinha).pop()].replace(/;$/, '');
            }

       
            const novoConteudo = linhas.map(linha => Object.values(linha).join(';')).join('\n');
            fs.writeFileSync(caminhoCompleto, novoConteudo);
            console.log(`Bloco removido de ${arquivo}`);
        })
        .on('error', (error) => {
            console.error(`Erro ao processar ${arquivo}: ${error.message}`);
        });
});
