<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Maquina extends Model
{
    // Habilita la habilidad de usar hasfactory
    use HasFactory;

    // $fillable ayuda que se pueda asignar masivamente los CRUD, protected es por seguridad
    protected $fillable = ['nombre', 'coeficiente'];

    
    public function tareas() //Se define la relación: una Máquina tiene muchas Tareas.
    {
        return $this->hasMany(Tarea::class, 'maquina_id');
    }

}