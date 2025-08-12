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
}