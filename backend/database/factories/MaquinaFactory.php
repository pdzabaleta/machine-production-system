<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Maquina>
 */
class MaquinaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // Genera un nombre de máquina falso, por ejemplo: "Máquina Tornillo 4821"
            'nombre' => 'Máquina ' . $this->faker->word() . ' ' . $this->faker->randomNumber(4, true),

            // Genera un número decimal aleatorio entre 1.00 y 3.00
            'coeficiente' => $this->faker->randomFloat(2, 1, 3),
        ];
    }
}
