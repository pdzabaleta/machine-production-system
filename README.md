
# Sistema de Gestión de Producción de Máquinas

Howdy! 🤠 Este es el proyecto desarrollado para la evaluación técnica de programador. Es una aplicación web completa que permite gestionar máquinas industriales y calcular sus ciclos de producción e inactividad, siguiendo un conjunto de reglas de negocio específicas.

La aplicación está construida con una arquitectura moderna, separando el backend del frontend:

-   **Backend:** Una API REST hecha con Laravel (PHP).
    
-   **Frontend:** Una interfaz de usuario interactiva, con tema oscuro y responsiva, hecha con React (JavaScript).
    

**Enlaces de Interés:**

-   **Repositorio en GitHub:**  [https://github.com/pdzabaleta/machine-production-system](https://github.com/pdzabaleta/machine-production-system "null")
    
-   **Tablero de Avance (GitHub Projects):**  [Ver el tablero del proyecto](https://github.com/users/pdzabaleta/projects/3/views/1 "null")
    

## Requisitos del Sistema

Para poder correr este proyecto en tu máquina, necesitarás tener instaladas las siguientes herramientas estándar de desarrollo:

-   PHP (versión 8.1 o superior)
    
-   Composer
    
-   Node.js y pnpm
    
-   Una base de datos MySQL
    

## Instalación (Paso a Paso)

He preparado unos scripts para que la instalación sea súper sencilla y rápida. Solo tienes que seguir estos 4 pasos en tu terminal:

**1. Clonar el Repositorio** Primero, clona el proyecto en tu computador.

```
git clone https://github.com/pdzabaleta/machine-production-system.git
cd machine-production-system

```

**2. Instalar Todas las Dependencias** Este comando instalará todo lo necesario para el backend (con Composer) y el frontend (con pnpm) de una sola vez.

```
pnpm run install:all

```

**3. Configurar el Entorno del Backend (¡Paso Importante!)** Este paso conecta la aplicación con tu base de datos local. Es un proceso de dos partes:

-   **Parte A: Configuración Manual de Credenciales**
    
    1.  Primero, **crea** una **base de datos vacía** en tu gestor de MySQL (como phpMyAdmin, MySQL Workbench, etc.). Puedes llamarla `maquinas_produccion` o como prefieras.
        
    2.  Luego, en la carpeta `backend/`, haz una copia del archivo `.env.example` y renómbrala a `.env`.
        
    3.  Abre ese nuevo archivo `.env` y edita las siguientes líneas con los datos de tu base de datos. Cada desarrollador tiene una configuración diferente, por eso este paso es manual.
        
    
    ```
    # ... (otras variables)
    
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306              # <-- ¡Importante! Revisa si este es tu puerto (MAMP suele usar 8889)
    DB_DATABASE=maquinas_produccion  # <-- El nombre de la base de datos que creaste
    DB_USERNAME=root                 # <-- Tu usuario de MySQL
    DB_PASSWORD=                     # <-- Tu contraseña de MySQL (puede ir vacía)
    
    # ... (otras variables)
    
    ```
    
-   **Parte** B: Ejecución del Script de Setup Una vez que hayas guardado tu `.env` con tus credenciales, ejecuta el siguiente comando. Se encargará de generar la clave de seguridad, ejecutar las migraciones y llenar la base de datos con datos de prueba.
    
    ```
    pnpm run setup:backend
    
    ```
    

**4. ¡Levantar la Aplicación!** Este último comando iniciará el servidor de Laravel y el de React al mismo tiempo.

```
pnpm run dev

```

Una vez que termine, podrás ver la aplicación funcionando en `http://localhost:5173` (o la URL que te indique la terminal).

## ¿Cómo Ejecutar la Rutina de Cálculo?

La lógica principal del proyecto se encuentra en un comando de Artisan. Para ejecutarlo, abre una **nueva terminal**, navega a la carpeta del backend y ejecuta:

```
cd backend
php artisan app:calculate-production

```

Verás en la terminal el cálculo detallado del ciclo de producción. Después de ejecutarlo, podrás ver los resultados en la pestaña "Historial de Producción" de la aplicación web.


## Uso de Asistentes de IA

Para el desarrollo de este proyecto, conté con la ayuda de un asistente de IA para resolver dudas, analizar los requisitos y acelerar algunas tareas de desarrollo.

-   **Asistente Utilizado:** Gemini Pro (de Google).
    

A continuación, presento una selección de los prompts que utilicé, los cuales reflejan el proceso de desarrollo y la resolución de problemas durante el proyecto.

#### **Análisis de Requisitos y Planificación**

-   "Basado en este PDF, dame ideas para estructurar las tarjetas de un tablero Trello y así cumplir con todos los entregables del proyecto."
    
-   "El PDF parece tener una contradicción: la columna `tiempo_empleado` se define como `Decimal(4,2)`, pero las reglas de negocio indican que el valor puede ser de hasta 120 horas. ¿Cómo debo interpretar esto?"
    
-   "Detecté una posible omisión en el PDF: la tabla `tareas` no tiene una `foreign key` para conectarse con `maquinas`. ¿Es un error y debería añadirla para que la lógica funcione?"
    
-   "El documento no especifica si todas las máquinas deben trabajar simultáneamente. ¿Cómo debo interpretar el alcance de la simulación?"
    

#### **Backend y Base de Datos (Laravel)**

-   "¿Cómo soluciono un error de `foreign key constraint` al intentar vaciar tablas con un seeder en Laravel?"
    
-   "Necesito que la API de Laravel devuelva los errores de validación en formato JSON en lugar de HTML cuando la pruebo con Postman."
    
-   "Dame el comando de Artisan para crear una `Factory` y un `Controller` de tipo API."
    
-   "Genera el código para una `Factory` de `Maquina` que asigne un nombre y un coeficiente aleatorio entre 1 y 3."
    

#### **Frontend y Diseño (React)**

-   "Dame el código CSS para crear un layout de dos columnas con una barra lateral fija y un área de contenido con scroll, usando un tema oscuro."
    
-   "Mi tabla, construida con `divs` y CSS Grid, no es responsiva. ¿Cómo puedo hacer que se transforme en una lista de tarjetas en pantallas pequeñas?"
    
-   "Al hacer clic en un botón dentro de una tabla en React, toda la página parpadea y el estado se reinicia. ¿Cuál podría ser la causa y cómo lo soluciono?"
    
-   "Necesito reemplazar el `window.confirm()` por defecto con un componente de modal personalizado en React para confirmar la eliminación de un ítem."
        

¡Gracias por revisar mi proyecto!