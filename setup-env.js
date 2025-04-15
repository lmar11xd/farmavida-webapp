const fs = require('fs');
const path = require('path');

const filesToCopy = [
  { from: 'src/environments/environment.example.ts', to: 'src/environments/environment.ts' },
  { from: 'src/environments/environment.development.example.ts', to: 'src/environments/environment.development.ts' }
];

filesToCopy.forEach(({ from, to }) => {
  if (!fs.existsSync(to)) {
    fs.copyFileSync(from, to);
    console.log(`Archivo creado: ${to}`);
  } else {
    console.log(`Ya existe: ${to}`);
  }
});
