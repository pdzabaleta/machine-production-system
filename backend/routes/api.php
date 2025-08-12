<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MaquinaController; 

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Esta línea crea automáticamente las siguientes rutas:
// GET /api/maquinas (para listar todas)
// POST /api/maquinas (para crear una nueva)
// GET /api/maquinas/{id} (para mostrar una)
// PUT /api/maquinas/{id} (para actualizar una)
// DELETE /api/maquinas/{id} (para borrar una)
Route::apiResource('maquinas', MaquinaController::class);