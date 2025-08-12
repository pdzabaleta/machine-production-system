<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tarea extends Model
{
    use HasFactory;

    /**
     * Define la relación inversa "pertenece a": una Tarea pertenece a una Produccion.
     */
    public function produccion()
    {
        return $this->belongsTo(Produccion::class, 'id_produccion');
    }
}