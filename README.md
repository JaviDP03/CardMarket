# CardMarket

Repositorio del frontend del proyecto final de 2º DAW

## 🚀 Tecnologías principales
[![Angular](https://img.shields.io/badge/Angular-19-DD0031?logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.7-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![pnpm](https://img.shields.io/badge/pnpm-10.11.0-222222?logo=pnpm&logoColor=yellow)](https://pnpm.io/)
[![Node.js](https://img.shields.io/badge/Node.js-22.15.0-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

## 📦 Dependencias principales
- Vite (empaquetador y servidor de desarrollo)
- TypeScript
- Tailwind CSS

## ⚙️ Configuración y despliegue

### 0. Instala Node.js y pnpm

Descarga e instala Node.js desde [nodejs.org](https://nodejs.org/).

Luego instala pnpm globalmente con el siguiente comando:

```bash
corepack enable pnpm
```

### 1. Clona el repositorio

```bash
git clone https://github.com/JaviDP03/CardMarket.git
cd CardMarket
```

### 2. Instala las dependencias

Se recomienda usar pnpm:

```bash
pnpm install
```

O con npm:

```bash
npm install
```

### 3. Compila el proyecto

Para compilar el proyecto en modo producción:

```bash
pnpm build
```

Los archivos generados estarán en la carpeta `dist/`.

## 🚀 Despliegue

### Despliegue en servidor de desarrollo (recomendado para desarrollo)

Para iniciar el servidor de desarrollo y ver los cambios en tiempo real:

```bash
pnpm start
```

Abre [http://localhost:4200](http://localhost:4200) en tu navegador.

### Despliegue en producción

Puedes desplegar el contenido de la carpeta `dist/` en cualquier servidor web estático (Nginx, Apache, etc) o en la nube (Vercel, Netlify, Firebase Hosting, etc).

#### Ejemplo de despliegue local con http-server:

```bash
pnpm install -g http-server
http-server dist/card-market
```

Abre tu navegador en [http://localhost:8080](http://localhost:8080).

## 📖 Documentación

- [Documentación Angular CLI](https://angular.dev/tools/cli)
- [Documentación Tailwind CSS](https://tailwindcss.com/docs/installation)
---