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
        Schema::create('produccion', function (Blueprint $table) {
            $table->id(); // identificador único [cite: 6]
            $table->decimal('tiempo_produccion', 5, 2); // suma total del tiempo_produccion de 5 tareas [cite: 6]
            $table->decimal('tiempo_inactividad', 5, 2); // tiempo de inactividad [cite: 6]
            $table->dateTime('fecha_hora_inicio_inactividad'); // fecha y hora de inicio del periodo de inactividad [cite: 6]
            $table->dateTime('fecha_hora_termino_inactividad'); // fecha y hora de término del periodo de inactividad [cite: 6]
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produccion');
    }
};
