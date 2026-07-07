import { useEffect, useRef } from 'react'

function HandwritingCanvas({ resetKey }) {
  const canvasRef = useRef(null)
  const isDrawingRef = useRef(false)

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)
  }

  const prepareCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ratio = window.devicePixelRatio || 1
    canvas.width = rect.width * ratio
    canvas.height = rect.height * ratio

    const context = canvas.getContext('2d')
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    context.lineWidth = 4
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.strokeStyle = '#263238'
  }

  useEffect(() => {
    prepareCanvas()
    window.addEventListener('resize', prepareCanvas)

    return () => {
      window.removeEventListener('resize', prepareCanvas)
    }
  }, [])

  useEffect(() => {
    clearCanvas()
  }, [resetKey])

  const getPoint = (event) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

  const startDrawing = (event) => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const point = getPoint(event)

    isDrawingRef.current = true
    canvas.setPointerCapture(event.pointerId)
    context.beginPath()
    context.moveTo(point.x, point.y)
  }

  const draw = (event) => {
    if (!isDrawingRef.current) return

    const context = canvasRef.current.getContext('2d')
    const point = getPoint(event)
    context.lineTo(point.x, point.y)
    context.stroke()
  }

  const stopDrawing = () => {
    isDrawingRef.current = false
  }

  return (
    <div className="handwriting-panel">
      <canvas
        ref={canvasRef}
        className="handwriting-canvas"
        aria-label="手写区"
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerCancel={stopDrawing}
        onPointerLeave={stopDrawing}
      />
      <button className="secondary-button" type="button" onClick={clearCanvas}>
        清除重写
      </button>
    </div>
  )
}

export default HandwritingCanvas
