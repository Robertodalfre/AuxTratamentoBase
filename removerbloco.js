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
          
            const novoConteudo = linhas.map(linha => Object.values(linha).join(';')).join('\n');
                      
            const cabecalho = Object.keys(linhas[0]).join(';');
            const conteudoFinal = cabecalho + '\n' + novoConteudo;
        
         
            if (!fs.existsSync(caminhoCompleto) || fs.readFileSync(caminhoCompleto, 'utf-8').trim() === '') {
                fs.writeFileSync(caminhoCompleto, conteudoFinal);
            } else {
                fs.appendFileSync(caminhoCompleto, '\n' + novoConteudo);
            }
        
            console.log(`Bloco removido de ${arquivo}`);
        })
});
