## Prueba Tecnica - Dashboard Factura Electronica

### Next.js Dashboard

Este proyecto es un panel de control construido con Next.js, diseñado para gestionar clientes e invoices. A continuación se detallan las tecnologías y herramientas utilizadas en el desarrollo de este sitio web:

### Tecnologías Utilizadas

- **Next.js**
- **React**
- **TypeScript**
- **Zod**
- **PostgreSQL**
- **Neon**
- **NextAuth.js**
- **Heroicons**
- **Tailwind CSS**

### Funcionalidades

- **Gestión de Clientes**: Permite crear, actualizar y eliminar clientes.
- **Gestión de Invoices**: Permite crear, actualizar y eliminar invoices.
- **Autenticación**: Implementada con NextAuth.js para gestionar el acceso de usuarios.
- **Validación de Formularios**: Utiliza Zod para la validación de datos en los formularios.

### Instalación y Ejecución

- Clona el repositorio.
- Instala las dependencias con pnpm install.
- Puedes usar tu propia BD postgres, en el archivo route de la carpeta seed estas los scripts de creación de tablas y tambien la data, puedes ejecutar este script desde el navegador.
- Configura las variables de entorno en un archivo .env.
- Ejecuta la aplicación en modo desarrollo con npm run dev.
- Usuario: user@nextmail.com, contraseña: 123456
