# Farmavida

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

# Librerías Base
### PrimeNG: npm install primeng @primeng/themes
### TailwindCss: npm install tailwindcss @tailwindcss/postcss postcss --force
### Firebase: npm install -g firebase-tools (Instalar en ambiente de desarrollo)
```
firebase login
firebase logout
```
# Desplegar en firebase hosting
## Configuración
Crear archivo firebase.json en ruta principal
```
{
  "hosting": {
    "public": "dist/farmavida/browser",
    ...
  }
}
```

```
firebase init (Primera vez) > Hosting: Configure files for Firebase Hosting and (optionally) set up Github Action deploys
npm run build
firebase deploy
```