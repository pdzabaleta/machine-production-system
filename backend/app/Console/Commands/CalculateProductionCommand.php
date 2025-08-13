<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Maquina;
use App\Models\Tarea;
use App\Models\Produccion;
use Carbon\Carbon;

class CalculateProductionCommand extends Command
{
    protected $signature = 'app:calculate-production';
    protected $description = 'Calcula los ciclos de producción para máquinas con 5 tareas pendientes.';

    public function handle()
    {
        $this->info('Iniciando cálculo de producción...');
        $maquinasParaProcesar = Maquina::whereHas('tareas', function ($query) {
            $query->where('estado', 'PENDIENTE');
        }, '>=', 5)->get();

        foreach ($maquinasParaProcesar as $maquina) {
            $this->info("Procesando máquina ID: {$maquina->id} - {$maquina->nombre}");
            $tareas = $maquina->tareas()->where('estado', 'PENDIENTE')->take(5)->get();
            
            $tiempoProduccionTotal = 0;
            $ultimaFechaTermino = null;

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
            
            $diaActual = $ultimaFechaTermino->copy()->addDay();
            $horasInactividadAcumuladas = 0;
            $tiempoRestante = $tiempoProduccionTotal;
            $fechaInicioFinal = null;
            $fechaTerminoFinal = null;

            while ($tiempoRestante > 0) {
                if ($diaActual->isSaturday() || $diaActual->isSunday()) {
                    $diaActual->addDay();
                    continue;
                }
                
                $this->line("--- Calculando día: " . $diaActual->toDateString() . " (" . $diaActual->dayName . ") ---");

                $inicioJornada = null;
                $finJornada = $diaActual->copy()->setTime(16, 0);

                if ($fechaInicioFinal === null) {
                    $horaInicio = rand(9, 14);
                    $minutoInicio = rand(0, 59);
                    $inicioJornada = $diaActual->copy()->setTime($horaInicio, $minutoInicio);
                    $fechaInicioFinal = $inicioJornada->copy();
                } else {
                    $inicioJornada = $diaActual->copy()->setTime(9, 0);
                }
                
                $horasDelDia = abs($finJornada->diffInSeconds($inicioJornada)) / 3600;
                $horasEfectivas = $horasDelDia;
                $penalizacionDelDia = 0;

                // --- APLICACIÓN DE PENALIZACIONES ---
                if ($diaActual->isWednesday()) {
                    $penalizacionDelDia = 2.5;
                    $horasEfectivas -= $penalizacionDelDia;
                    $this->line("    - Penalización Miércoles: -2.5 hrs");
                } 
                // --- LÓGICA NUEVA: Penalización por día parcial ---
                elseif ($horasDelDia < 5) {
                    $penalizacionDelDia = 1.5;
                    $horasEfectivas -= $penalizacionDelDia;
                    $this->line("    - Penalización día parcial (< 5 hrs): -1.5 hrs");
                }
                
                $horasEfectivas = max(0, $horasEfectivas);

                if ($tiempoRestante <= $penalizacionDelDia) {
                    $this->line("    - Tiempo restante ({$tiempoRestante}) es menor o igual a la penalización ({$penalizacionDelDia}). Finalizando ciclo.");
                    $fechaTerminoFinal = $fechaTerminoFinal ?? $fechaInicioFinal;
                    break;
                }
                
                if ($tiempoRestante >= $horasEfectivas) {
                    $horasInactividadAcumuladas += $horasEfectivas;
                    $tiempoRestante -= $horasEfectivas;
                    $fechaTerminoFinal = $finJornada->copy();
                } else {
                    $horasInactividadAcumuladas += $tiempoRestante;
                    $fechaTerminoFinal = $inicioJornada->copy()->addSeconds($tiempoRestante * 3600);
                    $tiempoRestante = 0;
                }

                $this->line("    - Horas disponibles: " . number_format($horasDelDia, 2) . " | Horas efectivas: " . number_format($horasEfectivas, 2));
                $this->line("    - Acumulado: " . number_format($horasInactividadAcumuladas, 2) . " | Restante: " . number_format($tiempoRestante, 2));

                $diaActual->addDay();
            }

            $produccion = new Produccion();
            $produccion->tiempo_produccion = $tiempoProduccionTotal;
            $produccion->tiempo_inactividad = $horasInactividadAcumuladas;
            $produccion->fecha_hora_inicio_inactividad = $fechaInicioFinal;
            $produccion->fecha_hora_termino_inactividad = $fechaTerminoFinal;
            $produccion->save();

            foreach ($tareas as $tarea) {
                $tarea->id_produccion = $produccion->id;
                $tarea->save();
            }

            $this->info("  - Ciclo de producción ID: {$produccion->id} creado.");
        }

        $this->info('Cálculo de producción finalizado.');
    }
}