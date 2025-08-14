
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

He preparado unos scripts para que la instalación sea súper sencilla y rápida.

**1. Clonar el Repositorio**

```
git clone https://github.com/pdzabaleta/machine-production-system.git
cd machine-production-system

```

**2. Instalar Todas las Dependencias**

```
pnpm run install:all

```

**3. Configuración Inicial del Entorno (¡Ejecutar solo una vez!)** Este es el paso más importante y se realiza en dos partes.

-   **Parte A: Ejecución del Script de Setup** Este comando creará el archivo de configuración `.env` en la carpeta `backend/` por ti y generará la clave de seguridad de la aplicación.
    
    ```
    pnpm run setup
    
    ```
    
-   **Parte B: Configuración Manual de Credenciales**
    
    1.  Primero, **crea una base de datos vacía** en tu gestor de MySQL.
        
    2.  Luego, abre el archivo `backend/.env` que se acaba de crear y edita las siguientes líneas con los datos de tu base de datos local.
        
    
    ```
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306              # <-- ¡Importante! Revisa si este es tu puerto (MAMP suele usar 8889)
    DB_DATABASE=maquinas_produccion  # <-- El nombre de la base de datos que creaste
    DB_USERNAME=root                 # <-- Tu usuario de MySQL
    DB_PASSWORD=                     # <-- Tu contraseña de MySQL (puede ir vacía)
    
    ```
    

**4. Crear y Llenar la Base de Datos** Este comando ejecutará las migraciones y llenará las tablas con datos de prueba.

```
pnpm run db:reset

```

**5. ¡Levantar la Aplicación!**

```
pnpm run dev

```

Ahora podrás ver la aplicación funcionando en `http://localhost:5173`.

## Flujo de Trabajo y Pruebas

Una vez que la aplicación está corriendo, este es el flujo de trabajo recomendado:

**1. Probar el CRUD**

-   Navega a la pestaña **"Gestión de Máquinas"**.
    
-   Prueba a crear, editar y eliminar máquinas.
    

**2. Ejecutar la Rutina de Cálculo**

-   Para probar la funcionalidad principal del proyecto, abre una **nueva terminal** (sin cerrar la que corre `pnpm run dev`).
    
-   Navega a la carpeta del backend y ejecuta el comando:
    
    ```
    cd backend
    php artisan app:calculate-production
    
    ```
    
-   Verás en la terminal el cálculo detallado del ciclo de producción.
    

**3. Verificar el Historial**

-   Vuelve a la aplicación en tu navegador.
    
-   Ve a la pestaña **"Historial de Producción"** para ver los resultados del cálculo en una tabla detallada.
    

_Para_ reiniciar la base de datos y generar un nuevo ciclo de _prueba, simplemente ejecuta `pnpm run db:reset`._

## Uso de Asistentes de IA

Para el desarrollo de este proyecto, conté con la ayuda de un asistente de IA para resolver dudas, analizar los requisitos y acelerar algunas tareas de desarrollo.

-   **Asistente Utilizado:** Gemini Pro (de Google).
    

A continuación, presento una selección de los prompts que utilicé, los cuales reflejan el proceso de desarrollo y la resolución de problemas durante el proyecto.

#### **Análisis de Requisitos y Planificación**

-   "Basado en este PDF, dame ideas para estructurar las tarjetas de un tablero Trello y así cumplir con todos los entregables del proyecto."
    
-   "El PDF parece tener una contradicción: la columna `tiempo_empleado` se define como `Decimal(4,2)`, pero las reglas de negocio indican que el valor puede ser de hasta 120 horas. ¿Cómo debo interpretar esto?"
    
-   "Detecté una posible omisión en el PDF: la tabla `tareas` no tiene una `foreign key` para conectarse con `maquinas`. ¿Es un error y debería añadirla para que la lógica funcione?"
    

#### **Backend y Base de Datos (Laravel)**

-   "¿Cómo soluciono un error de `foreign key constraint` al intentar vaciar tablas con un seeder en Laravel?"
    
-   "Necesito que la API de Laravel devuelva los errores de validación en formato JSON en lugar de HTML cuando la pruebo con Postman."
    
-   "Genera el código para una `Factory` de `Maquina` que asigne un nombre y un coeficiente aleatorio entre 1 y 3."
    

#### **Frontend y Diseño (React)**

-   "Dame el código CSS para crear un layout de dos columnas con una barra lateral fija y un área de contenido con scroll, usando un tema oscuro."
    
-   "Mi tabla hecha con `divs` y CSS Grid no es responsiva. ¿Cómo puedo hacer que se transforme en una lista de tarjetas en pantallas pequeñas?"
    
-   "Al hacer clic en un botón dentro de una tabla en React, toda la página parpadea y el estado se reinicia. ¿Cuál podría ser la causa y cómo lo soluciono?"
    

¡Gracias por revisar mi proyecto!