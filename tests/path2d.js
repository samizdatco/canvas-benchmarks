import seed from 'random-seed'

export default function drawSnowflakes({createCanvas, getBitmap}){
    let canvas = createCanvas(1024, 768),
        ctx = canvas.getContext('2d'),
        TAU = Math.PI * 2,
        count = 100,
        rng = seed(process.env.SEED || 123)


  function flake(ctx){
      let scale = 256,
          r = scale * .45,
          points = 7
      ctx.beginPath()
      ctx.arc(0, 0, r/8, 0, TAU)
      ctx.moveTo(r, 0)
      for (let i=0; i<points; i++){
          let theta = 3.0 * i * TAU / points;
          ctx.lineTo(r * Math.cos(theta), r * Math.sin(theta));
      }
      ctx.closePath()
      ctx.fill("evenodd")
  }

  for (let i=0; i<count; i++){
      let x = rng.intBetween(0, canvas.width),
          y = rng.intBetween(0, canvas.height),
          rot = rng.floatBetween(0, TAU)
      ctx.fillStyle = rng.random() < 0.5 ? 'white' : 'black'
      ctx.globalAlpha = rng.random()

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rot)
      flake(ctx)
      ctx.restore()
  }

    return getBitmap(canvas)
}
