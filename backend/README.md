# Backend - Sistema de Fidelización

API REST desarrollada con Laravel para la gestión del sistema de fidelización de comercios PyME.

## Tabla de Contenidos

-   [Estructura del Proyecto](#estructura-del-proyecto)
-   [Instalación y Configuración](#instalación-y-configuración)
    -   [Opción 1: Docker con Laravel Sail](#opción-1-docker-con-laravel-sail)
    -   [Opción 2: XAMPP](#opción-2-xampp)
-   [Configuración del Correo Electrónico](#configuración-del-correo-electrónico)
-   [Migraciones de Base de Datos](#migraciones-de-base-de-datos)
-   [Tecnologías](#tecnologías)

## Estructura del Proyecto

```
backend/
├── app/
│   ├── Enums/              # Enumeraciones (PaymentMethod, Role, etc.)
│   ├── Exceptions/         # Manejo de excepciones personalizadas
│   ├── Helpers/            # Funciones auxiliares
│   ├── Http/
│   │   ├── Controllers/    # Controladores de la API
│   │   ├── Requests/       # Validación de requests
│   │   └── Resources/      # Transformación de respuestas
│   ├── Mail/               # Templates de correos
│   ├── Models/             # Modelos Eloquent
│   │   ├── Business.php
│   │   ├── Customer.php
│   │   ├── Purchase.php
│   │   ├── Reward.php
│   │   └── ...
│   ├── Policies/           # Políticas de autorización
│   └── Providers/          # Service Providers
├── config/                 # Archivos de configuración
├── database/
│   └── migrations/         # Migraciones de base de datos
├── routes/
│   └── api.php            # Rutas de la API
└── compose.yaml           # Configuración Docker
```

## Instalación y Configuración

### Opción 1: Docker con Laravel Sail

**Requisitos:**

-   **Windows:** WSL 2 (Windows Subsystem for Linux) instalado
-   Docker Desktop instalado (con integración WSL 2 habilitada en Windows)
-   Docker Compose

**Pasos:**

1. Clonar el repositorio y navegar a la carpeta backend:

```bash
cd backend
```

2. Copiar el archivo de configuración:

```bash

cp .env.example .env
```

3. Configurar las credenciales de la base de datos en el archivo `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=gds-fidelization-system
DB_USERNAME=fidelization-system-app
DB_PASSWORD=password
```

**Nota:** Sail utiliza contenedores Docker, por lo que `DB_HOST` debe ser `mysql` (nombre del servicio en Docker) y no `127.0.0.1`.

4. Instalar dependencias

```bash
composer install
```

5. Desde una terminal WSL, navegar a la carpeta backend y levantar los contenedores con Sail:

```bash
cd backend
./vendor/bin/sail up
```

6. Generar la clave de la aplicación:

```bash
./vendor/bin/sail artisan key:generate
```

7. Ejecutar las migraciones (ver sección [Migraciones](#migraciones-de-base-de-datos))

La API estará disponible en `http://localhost`

**Comandos útiles con Sail:**

```bash
./vendor/bin/sail down          # Detener contenedores
./vendor/bin/sail artisan ...   # Ejecutar comandos Artisan
./vendor/bin/sail composer ...  # Ejecutar Composer
```

### Opción 2: XAMPP

**Requisitos:**

-   XAMPP instalado (con PHP 8.x y MySQL)
-   Composer instalado globalmente

**Pasos:**

1. Clonar el repositorio y navegar a la carpeta backend:

```bash
cd backend
```

2. Copiar el archivo de configuración:

```bash
cp .env.example .env
```

3. Configurar el archivo `.env` con los datos de tu base de datos MySQL de XAMPP:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=fidelization_system
DB_USERNAME=root
DB_PASSWORD=
```

4. Instalar las dependencias:

```bash
composer install
```

5. Generar la clave de la aplicación:

```bash
php artisan key:generate
```

6. Ejecutar las migraciones (ver sección [Migraciones](#migraciones-de-base-de-datos))

7. Levantar el servidor de desarrollo:

```bash
php artisan serve
```

La API estará disponible en `http://localhost:8000`

## Configuración del Correo Electrónico

El sistema utiliza **Resend** como servicio de envío de correos electrónicos para funcionalidades como invitaciones de usuarios y notificaciones.

**Pasos para configurar Resend:**

1. Crear una cuenta en [Resend](https://resend.com)

2. Obtener una API Key desde el dashboard de Resend

3. Configurar las variables de entorno en el archivo `.env`:

```env
MAIL_MAILER=resend
RESEND_KEY=tu_api_key_aqui
MAIL_FROM_ADDRESS="info@notifications.tudominio.com"
MAIL_FROM_NAME="${APP_NAME}"
```

**Documentación oficial:**

-   [Resend - Getting Started](https://resend.com/docs/send-with-laravel)
-   [Resend - API Keys](https://resend.com/docs/dashboard/api-keys/introduction)

**Nota:** Es necesario configurar Resend para que el sistema pueda enviar correos de invitación y notificaciones. Sin esta configuración, las funcionalidades relacionadas con email no funcionarán.

## Migraciones de Base de Datos

Después de levantar la API y la base de datos con cualquiera de las dos opciones, es necesario ejecutar las migraciones para crear las tablas:

**Con Laravel Sail:**

```bash
./vendor/bin/sail artisan migrate
```

**Con XAMPP:**

```bash
php artisan migrate
```

## Tecnologías

-   **PHP 8.x** - Lenguaje de programación
-   **Laravel** - Framework web
-   **MySQL** - Base de datos
-   **Laravel Sanctum** - Autenticación API
-   **Docker** - Contenedorización
-   **Composer** - Gestor de dependencias
