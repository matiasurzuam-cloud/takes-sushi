import confetti from 'canvas-confetti'

// Ráfaga de celebración con los colores de marca — usada en momentos de
// conversión clave (ej. al confirmar un pedido). `zIndex` va por encima del
// z-[100] de los modales del sitio para que se vea aunque el modal siga
// cerrándose en el mismo instante.
export function celebrate() {
  confetti({
    particleCount: 90,
    spread: 75,
    startVelocity: 45,
    origin: { y: 0.7 },
    colors: ['#30c8cf', '#f26f27', '#ffffff'],
    zIndex: 200,
  })
}
