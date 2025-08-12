<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('tareas', function (Blueprint $table) {
            $table->id(); // identificador único [cite: 6]
            $table->foreignId('id_produccion')->nullable()->constrained('produccion'); // relación con la tabla 'produccion' [cite: 6]
            $table->dateTime('fecha_hora_inicio'); // fecha y hora de inicio de la tarea [cite: 6]
            $table->dateTime('fecha_hora_termino'); // fecha y hora de término de la tarea [cite: 6]
            $table->decimal('tiempo_empleado', 4, 2); // tiempo transcurrido entre inicio y término (en horas) [cite: 6]
            $table->decimal('tiempo_produccion', 4, 2); // tiempo_empleado * coeficiente [cite: 6]
            $table->enum('estado', ['PENDIENTE', 'COMPLETADA']); // valores: 'PENDIENTE', 'COMPLETADA' [cite: 6]
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tareas');
    }
};
