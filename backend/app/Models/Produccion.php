<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produccion extends Model
{
    use HasFactory;

    // --- Aqui se arregla la plurizacion por defecto de laravel ---
    protected $table = 'produccion';

    /**
     * Define la relación "uno a muchos": una Produccion tiene muchas Tareas.
     */
    public function tareas()
    {
        return $this->hasMany(Tarea::class, 'id_produccion');
    }
}