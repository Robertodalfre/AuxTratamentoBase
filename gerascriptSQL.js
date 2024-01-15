const fs = require('fs');
const path = require('path');

const pastaLeitura = 'C:\\Users\\gesta\\Documents\\inss_outros\\pronto_02\\exclusao_setembro\\';
const caminhoSQL = 'C:\\Users\\wander.junior\\Documents\\aaa\\exclusao_setembro\\';
const caminhoSaida = path.join(process.env.USERPROFILE, 'Desktop', 'output_exclusao_setembro.sql');


const stream = fs.createWriteStream(caminhoSaida, { flags: 'a' });


fs.readdir(pastaLeitura, (err, files) => {
  if (err) {
    console.error('Erro ao ler a pasta:', err);
    return;
  }


  files.forEach(file => {

    const filePath = path.join(pastaLeitura, file);

   
    const sqlPath = path.join(caminhoSQL, file);

   
    const sqlScript = `
BULK INSERT dbo.agosto_setembro_outubro
FROM '${sqlPath.replace(/\\/g, '\\\\')}'
WITH (
    FIELDTERMINATOR = ';',
    ROWTERMINATOR = '0x0a',
    FIRSTROW = 1
);
GO
`;

   
    stream.write(sqlScript);
  });

 
  stream.end();
});

console.log(`Scripts SQL gerados e salvos em: ${caminhoSaida}`);
