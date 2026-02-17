export const blockZoomIphone = () => {
  if (typeof window === 'undefined') return

  let lastTouchEnd = 0

  window.addEventListener(
    'touchend',
    (event) => {
      const now = Date.now()
      if (now - lastTouchEnd <= 300) {
        event.preventDefault()
      }
      lastTouchEnd = now
    },
    { passive: false },
  )
}

