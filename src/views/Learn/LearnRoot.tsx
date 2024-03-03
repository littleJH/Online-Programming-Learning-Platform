import React, { useEffect, useRef } from 'react'

const LearnRoot: React.FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvas.current) {
      const ctx = canvas.current.getContext('2d')
      if (ctx) {
        const path = new Path2D()
        path.moveTo(100, 100)
        path.lineTo(200, 100)
        path.lineTo(100, 200)
        path.lineTo(100, 100)
        // ctx.fillStyle = 'red'
        // ctx.fillRect(0, 0, 150, 100)
        ctx.strokeStyle = 'red'
        // ctx.strokeRect(100, 100, 100, 100)

        // ctx.beginPath()
        // ctx.moveTo(25, 25)
        // ctx.lineTo(105, 25)
        // ctx.lineTo(25, 105)
        // ctx.closePath()
        // ctx.stroke()

        // ctx.beginPath()
        // ctx.arc(100, 100, 50, 0, Math.PI, true)
        // ctx.stroke()

        // ctx.beginPath()
        ctx.stroke(path)
      }
    }
  }, [])

  return (
    <div>
      <canvas ref={canvas} id="myCanvas" width={500} height={500}></canvas>
    </div>
  )
}

export default LearnRoot
