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
            $table->id(); // identificador único 
            $table->foreignId('maquina_id')->constrained('maquinas'); // esta llave conecta con la tabla 'maquinas'
            $table->foreignId('id_produccion')->nullable()->constrained('produccion'); // relación con la tabla 'produccion' 
            $table->dateTime('fecha_hora_inicio'); // fecha y hora de inicio de la tarea 
            $table->dateTime('fecha_hora_termino'); // fecha y hora de término de la tarea 
            $table->decimal('tiempo_empleado', 5, 2); // tiempo transcurrido entre inicio y término (en horas) nota: se modifico a 5,2 porque se solicito 4.2 y eso hace que el tiempo llegue a 99.99 y se solicita el tiempo de produccion entre 5 y 120 hrs
            $table->decimal('tiempo_produccion', 5, 2); // tiempo_empleado * coeficiente 
            $table->enum('estado', ['PENDIENTE', 'COMPLETADA']); // valores: 'PENDIENTE', 'COMPLETADA' 
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
