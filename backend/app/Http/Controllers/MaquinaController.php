<?php

namespace App\Http\Controllers;

use App\Models\Maquina; //Importa el modelo de maquina
use Illuminate\Http\Request;

class MaquinaController extends Controller
{
    /**
     * Muestra una lista de todas las máquinas.
     */
    public function index()
    {
        return Maquina::all();
    }

    /**
     * Guarda una nueva máquina en la base de datos.
     */
    public function store(Request $request)
    {
        // Esta es la validacion que se encargan de validar que los datos enviados a la API sean correctos antes de intentar guardarlos en la db
        $validatedData = $request->validate([
            'nombre' => 'required|string|max:255',
            'coeficiente' => 'required|numeric|min:1|max:3',
        ]);

        // Crea la máquina y la devuelve con un código de estado 201 (Creado)
        $maquina = Maquina::create($validatedData);
        return response()->json($maquina, 201);
    }

    /**
     * Muestra una máquina específica.
     */
    public function show(Maquina $maquina)
    {
        // Laravel encuentra la máquina por su ID automáticamente (Route Model Binding)
        return $maquina;
    }

    /**
     * Actualiza una máquina existente.
     */
    public function update(Request $request, Maquina $maquina)
    {
        $validatedData = $request->validate([
            'nombre' => 'sometimes|required|string|max:255',
            'coeficiente' => 'sometimes|required|numeric|min:1|max:3',
        ]);

        $maquina->update($validatedData);
        return response()->json($maquina);
    }

    /**
     * Elimina una máquina.
     */
    public function destroy(Maquina $maquina)
    {
        $maquina->delete();

        // Devuelve una respuesta vacía con código 204 (Sin Contenido)
        return response()->json(null, 204);
    }
}