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
        Schema::create('maquinas', function (Blueprint $table) {
            $table->id(); // autoincremental, identificador único [cite: 6]
            $table->string('nombre'); // nombre de la máquina [cite: 6]
            $table->decimal('coeficiente', 4, 2); // coeficiente de productividad [cite: 6]
            $table->timestamps(); // agrega created_at y updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maquinas');
    }
};
