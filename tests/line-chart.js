import seed from 'random-seed'

export default function drawLineChart({createCanvas, getBitmap}){
  const W = 1000, H = 620,
        margin = {top:12, right:12, bottom:40, left:48},
        plotL = margin.left, plotR = W - margin.right,
        plotT = margin.top,  plotB = H - margin.bottom,
        plotW = plotR - plotL, plotH = plotB - plotT,
        series = 20,
        points = plotW * 5,
        rng = seed(process.env.SEED || 123),
        canvas = createCanvas(W, H),
        ctx = canvas.getContext('2d')

  // Tableau 20, one distinct color per series
  const colors = [
    '#4E79A7', '#A0CBE8', '#F28E2B', '#FFBE7D', '#59A14F',
    '#8CD17D', '#B6992D', '#F1CE63', '#499894', '#86BCB6',
    '#E15759', '#FF9D9A', '#79706E', '#BAB0AC', '#D37295',
    '#FABFD2', '#B07AA1', '#D4A6C8', '#9D7660', '#D7B5A6',
  ]

  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, W, H)

  // draw lines
  const mid = plotT + plotH/2
  ctx.lineWidth = 1
  for (let s = 0; s < series; s++){
    let trend = rng.floatBetween(-0.02, 0.02),
        volatility = rng.floatBetween(1.8, 3.2),
        y = mid
    ctx.strokeStyle = colors[s % colors.length]
    ctx.beginPath()
    ctx.moveTo(plotL, mid)
    for (let i = 1; i < points; i++){
      y += trend + rng.floatBetween(-1, 1) * volatility
      if (y < plotT) y = plotT; else if (y > plotB) y = plotB
      ctx.lineTo(plotL + (i / (points - 1)) * plotW, y)
    }
    ctx.stroke()
  }

  // draw axes
  ctx.strokeStyle = '#333'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB)
  ctx.moveTo(plotL, mid);   ctx.lineTo(plotR, mid)
  ctx.stroke()

  ctx.lineWidth = 1
  ctx.beginPath()
  for (let i = 0; i <= 10; i++){ let x = plotL + i/10 * plotW; ctx.moveTo(x, mid); ctx.lineTo(x, mid + 5) }
  for (let i = 0; i <= 8;  i++){ let y = plotB - i/8 * plotH; ctx.moveTo(plotL - 5, y); ctx.lineTo(plotL, y) }
  ctx.stroke()

  return getBitmap(canvas)
}
