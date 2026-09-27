import seed from 'random-seed'

export default function drawGradients({createCanvas, getJpeg}){
  const size = 900,
        canvas = createCanvas(size, size),
        ctx = canvas.getContext('2d'),
        rng = seed(process.env.SEED || 123),
        count = 300,
        stops = 5,
        colors = ['#e15759', '#f28e2b', '#edc949', '#59a14f', '#4e79a7', '#76b7b2',
                  '#b07aa1', '#ff9da7', '#9c755f', '#bab0ac', 'white', 'black']

  for (let i=0; i<count; i++){
    let cx = rng.intBetween(0, size),
        cy = rng.intBetween(0, size),
        len = rng.floatBetween(size*0.15, size*0.45),
        wid = len/4,
        angle = (rng.random() < 0.5 ? 1 : -1) * Math.PI/4

    let g = ctx.createLinearGradient(-len/2, 0, len/2, 0)
    for (let s=0; s<stops; s++) g.addColorStop(s/(stops-1), colors[rng.intBetween(0, colors.length-1)])

    ctx.globalAlpha = rng.floatBetween(0.4, 0.8)
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(angle)
    ctx.fillStyle = g
    ctx.fillRect(-len/2, -wid/2, len, wid)
    ctx.restore()
  }

  return getJpeg(canvas)
}
