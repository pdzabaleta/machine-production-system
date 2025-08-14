<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Maquina;
use App\Models\Tarea;
use App\Models\Produccion;
use Carbon\Carbon;

class CalculateProductionCommand extends Command
{
    /**
     * El nombre que usaremos en la terminal para llamar a este comando.
     */
    protected $signature = 'app:calculate-production';

    /**
     * Una pequeña descripción de lo que hace el comando.
     */
    protected $description = 'Calcula los ciclos de producción para máquinas con 5 tareas pendientes.';

    /**
     * Aquí es donde ocurre toda la magia cuando ejecutamos el comando.
     */
    public function handle()
    {
        $this->info('Iniciando cálculo de producción...');
        
        // Primero, buscamos en la base de datos todas las máquinas que tengan pega pendiente.
        // O sea, que tengan 5 o más tareas con el estado 'PENDIENTE'.
        $maquinasParaProcesar = Maquina::whereHas('tareas', function ($query) {
            $query->where('estado', 'PENDIENTE');
        }, '>=', 5)->get();

        // Ahora, vamos máquina por máquina de las que encontramos.
        foreach ($maquinasParaProcesar as $maquina) {
            $this->info("Procesando máquina ID: {$maquina->id} - {$maquina->nombre}");
            
            // Tomamos solo las primeras 5 tareas pendientes para procesar este ciclo.
            $tareas = $maquina->tareas()->where('estado', 'PENDIENTE')->take(5)->get();
            
            $tiempoProduccionTotal = 0;
            $ultimaFechaTermino = null;

            // Revisamos cada una de las 5 tareas para calcular su tiempo de producción
            // y de paso, encontrar cuál fue la última en terminar.
            foreach ($tareas as $tarea) {
                $tiempoProduccionTarea = $tarea->tiempo_empleado * $maquina->coeficiente;
                $tiempoProduccionTotal += $tiempoProduccionTarea;
                $tarea->tiempo_produccion = $tiempoProduccionTarea;
                $tarea->estado = 'COMPLETADA';
                if ($ultimaFechaTermino === null || $tarea->fecha_hora_termino > $ultimaFechaTermino) {
                    $ultimaFechaTermino = new Carbon($tarea->fecha_hora_termino);
                }
            }
            
            $this->info("  - Tiempo total de producción a consumir: " . number_format($tiempoProduccionTotal, 2) . " horas.");
            
            // Aquí preparamos todo para empezar a calcular el descanso.
            $diaActual = $ultimaFechaTermino->copy()->addDay();
            $horasInactividadAcumuladas = 0;
            $tiempoRestante = $tiempoProduccionTotal;
            $fechaInicioFinal = null;
            $fechaTerminoFinal = null;
            $calculoLog = []; // Este array guardará el "recibo" del cálculo para el frontend.

            // Este es el corazón del algoritmo. Damos vueltas día por día
            // hasta que se consuma todo el tiempo de descanso que la máquina se ganó.
            while ($tiempoRestante > 0) {
                // Si es fin de semana, lo saltamos y pasamos al día siguiente.
                if ($diaActual->isSaturday() || $diaActual->isSunday()) {
                    $diaActual->addDay();
                    continue;
                }
                
                $this->line("--- Calculando día: " . $diaActual->toDateString() . " (" . $diaActual->dayName . ") ---");
                
                $inicioJornada = null;
                $finJornada = $diaActual->copy()->setTime(16, 0);

                // Si es el primer día de descanso, la hora de inicio es aleatoria.
                if ($fechaInicioFinal === null) {
                    $horaInicio = rand(9, 14);
                    $minutoInicio = rand(0, 59);
                    $inicioJornada = $diaActual->copy()->setTime($horaInicio, $minutoInicio);
                    $fechaInicioFinal = $inicioJornada->copy();
                } else { // Para los demás días, siempre empieza a las 9:00.
                    $inicioJornada = $diaActual->copy()->setTime(9, 0);
                }
                
                $horasDelDia = abs($finJornada->diffInSeconds($inicioJornada)) / 3600;
                $horasEfectivas = $horasDelDia;
                $penalizacionDelDia = 0;
                $detalleCalculo = "Día completo: {$inicioJornada->format('H:i')} - {$finJornada->format('H:i')} -> " . number_format($horasDelDia, 2) . " hrs";

                // Ahora vienen los 'castigos' según las reglas del PDF.
                if ($diaActual->isWednesday()) {
                    $penalizacionDelDia = 2.5;
                    $horasEfectivas -= $penalizacionDelDia;
                    $detalleCalculo .= " | Penalización Miércoles: -" . number_format($penalizacionDelDia, 2) . " hrs";
                } 
                elseif ($horasDelDia < 5) {
                    $penalizacionDelDia = 1.5;
                    $horasEfectivas -= $penalizacionDelDia;
                    $detalleCalculo .= " | Penalización día parcial: -" . number_format($penalizacionDelDia, 2) . " hrs";
                }
                
                $horasEfectivas = max(0, $horasEfectivas); // Nos aseguramos de que no sea negativo.

                // Una regla importante: si lo que queda por descansar es menos que el castigo del día,
                // el ciclo termina para no quedar en negativo.
                if ($tiempoRestante <= $penalizacionDelDia) {
                    $detalleCalculo = "Ciclo finalizado: Tiempo restante ({$tiempoRestante}) es menor o igual a la penalización ({$penalizacionDelDia}).";
                    $fechaTerminoFinal = $fechaTerminoFinal ?? $fechaInicioFinal;
                    
                    $calculoLog[] = ['dia' => $diaActual->toDateString(), 'detalle' => $detalleCalculo, 'horas_inactividad' => 0, 'acumulado' => $horasInactividadAcumuladas, 'penalizacion' => 0, 'restante' => $tiempoRestante];
                    $this->line("    - {$detalleCalculo}");
                    break; // Salimos del bucle.
                }
                
                // Aquí vemos cuántas horas de descanso se consumen en el día.
                $horasConsumidasHoy = 0;
                if ($tiempoRestante >= $horasEfectivas) {
                    $horasInactividadAcumuladas += $horasEfectivas;
                    $tiempoRestante -= $horasEfectivas;
                    $fechaTerminoFinal = $finJornada->copy();
                    $horasConsumidasHoy = $horasEfectivas;
                } else { // Si es el último día y sobran pocas horas.
                    $horasInactividadAcumuladas += $tiempoRestante;
                    $horasConsumidasHoy = $tiempoRestante;
                    $fechaTerminoFinal = $inicioJornada->copy()->addSeconds($tiempoRestante * 3600);
                    $tiempoRestante = 0;
                }

                // Guardamos el detalle de este día en nuestro "recibo" para el frontend.
                $calculoLog[] = ['dia' => $diaActual->toDateString(), 'detalle' => $detalleCalculo, 'horas_inactividad' => round($horasConsumidasHoy, 2), 'acumulado' => round($horasInactividadAcumuladas, 2), 'penalizacion' => $penalizacionDelDia, 'restante' => round($tiempoRestante, 2)];
                
                $this->line("    - Horas disponibles: " . number_format($horasDelDia, 2) . " | Horas efectivas: " . number_format($horasEfectivas, 2));
                $this->line("    - Acumulado: " . number_format($horasInactividadAcumuladas, 2) . " | Restante: " . number_format($tiempoRestante, 2));

                $diaActual->addDay();
            }

            // Finalmente, creamos el registro de producción en la base de datos con todos los datos calculados.
            $produccion = new Produccion();
            $produccion->tiempo_produccion = $tiempoProduccionTotal;
            $produccion->tiempo_inactividad = $horasInactividadAcumuladas;
            $produccion->calculo_log = json_encode($calculoLog);
            $produccion->fecha_hora_inicio_inactividad = $fechaInicioFinal;
            $produccion->fecha_hora_termino_inactividad = $fechaTerminoFinal;
            $produccion->save();

            // Y asociamos las 5 tareas a este nuevo ciclo de producción.
            foreach ($tareas as $tarea) {
                $tarea->id_produccion = $produccion->id;
                $tarea->save();
            }
            $this->info("  - Ciclo de producción ID: {$produccion->id} creado.");
        }
        $this->info('Cálculo de producción finalizado.');
    }
}
