export default function drawGradient({lib, createCanvas, getBitmap}) {
  const canvas = createCanvas(900, 900),
        ctx = canvas.getContext('2d')

  const lg = ctx.createLinearGradient(20, 0, 900, 300)
  lg.addColorStop(0, 'rebeccapurple')
  lg.addColorStop(0.5, 'cyan')
  lg.addColorStop(1, 'white')
  ctx.fillStyle = lg
  ctx.fillRect(0, 0, 900, 300)

  const rg = ctx.createRadialGradient(450, 450, 20, 450, 450, 550)
  rg.addColorStop(0, 'red')
  rg.addColorStop(0.5, 'yellow')
  rg.addColorStop(1, 'green')
  ctx.fillStyle = rg
  ctx.fillRect(0, 600, 900, 300)

  let i=0;
  let block = 21
  for (let y=0; y<300; y+=block){
    for (let x=0; x<900; x+=block){
      ctx.fillStyle = (++i%2) ? lg : rg
      ctx.fillRect(x, 300+y, block, block)
    }
  }

  //// NOT SUPPORTED BY NODE-CANVAS/CANVASKIT-WASM:
  // if (ctx.createConicGradient){
  //   const cg = ctx.createConicGradient(0, 450, 750)
  //   cg.addColorStop(0, 'red')
  //   cg.addColorStop(0.5, 'black')
  //   cg.addColorStop(1, 'white')
  //   ctx.fillStyle = cg
  // }
  // ctx.fillRect(0, 300, 900, 300)

  return getBitmap(canvas)
}
