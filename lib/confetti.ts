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

// Dos cañones cruzados desde las esquinas inferiores — más festivo que
// `celebrate()` (que es una sola ráfaga central), pensado para un momento
// de "llegada" en vez de una confirmación puntual (ej. entrar a la página
// del Club Takes).
export function celebrateWelcome() {
  const base = {
    colors: ['#30c8cf', '#f26f27', '#ffffff'],
    zIndex: 200,
    startVelocity: 42,
    spread: 65,
  }
  confetti({ ...base, particleCount: 60, origin: { x: 0.15, y: 0.75 }, angle: 60 })
  confetti({ ...base, particleCount: 60, origin: { x: 0.85, y: 0.75 }, angle: 120 })
}
