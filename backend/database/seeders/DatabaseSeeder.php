<?php

namespace Database\Seeders;

// se importan los modelos que vamos a usar en este caso maquina y tarea; se crean 5 maquinas falsas y se crean 5 tareas que se la asigna el mismo id 1=1
use App\Models\Maquina;
use App\Models\Tarea;
use Illuminate\Database\Seeder;
// --- Se importa la herramienta para manejar el esquema de la base de datos ---
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        // 1.1 Desactivamos las reglas de clave foránea para eliminar el contenido viejo
        Schema::disableForeignKeyConstraints();

        // Borra los datos viejos para empezar de cero cada vez que se ejecute el seeder.
        // Esto es útil para las pruebas.
        Tarea::truncate();
        Maquina::truncate();
        
        // 1.2 Reactivamos las reglas
        Schema::enableForeignKeyConstraints();
       
        // Crea 5 máquinas falsas
        $maquinas = Maquina::factory(5)->create();

        // --- AQUÍ ESTÁ LA LÓGICA NUEVA ---
        // 2. De la colección de máquinas que acabamos de crear, elegimos una al azar.
        $maquinaAleatoria = $maquinas->random();

        $this->command->info("Asignando 5 tareas de prueba a la máquina aleatoria con ID: {$maquinaAleatoria->id}");

        // 3. Creamos las 5 tareas y se las asignamos a la máquina que elegimos al azar.
        Tarea::factory(5)->create([
            'maquina_id' => $maquinaAleatoria->id,
        ]);
    }
}