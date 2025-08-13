<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class TareaFactory extends Factory
{
    public function definition(): array
    {
        // Genera una fecha de inicio aleatoria en los últimos 30 días
        $inicio = Carbon::now()->subDays(rand(1, 30))->subHours(rand(1, 24));

        // Genera un tiempo empleado aleatorio entre 5 y 120 horas
        $tiempoEmpleado = $this->faker->numberBetween(5, 120);

        // Calcula la fecha de término sumando el tiempo empleado a la fecha de inicio
        $termino = $inicio->copy()->addHours($tiempoEmpleado);

        return [
            // maquina_id se asignará desde el seeder
            'fecha_hora_inicio' => $inicio,
            'fecha_hora_termino' => $termino,
            'tiempo_empleado' => $tiempoEmpleado,
            'tiempo_produccion' => 0, // Lo calcularemos después, por ahora es 0
            'estado' => 'PENDIENTE',
            'id_produccion' => null, // Aún no pertenece a un ciclo de producción
        ];
    }
}