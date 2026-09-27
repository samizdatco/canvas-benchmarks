import seed from 'random-seed'

export default function drawSnowflakes({createCanvas, getBitmap}){
    let width = 1024,
        height = 768,
        canvas = createCanvas(width, height),
        ctx = canvas.getContext('2d'),
        TAU = Math.PI * 2,
        count = 600,
        rng = seed(process.env.SEED || 123)


  function flake(ctx){
      let scale = 256,
          r = scale * .45,
          points = 7,
          radius = r * 0.5, // arcTo corner radius: rounds the star's edges into curves
          mid = (a, b) => [(a[0]+b[0])/2, (a[1]+b[1])/2],
          verts = []
      for (let i=0; i<points; i++){
          let theta = 3.0 * i * TAU / points
          verts.push([r * Math.cos(theta), r * Math.sin(theta)])
      }

      let start = mid(verts[points-1], verts[0])
      ctx.beginPath()
      ctx.arc(0, 0, r/8, 0, TAU)
      ctx.moveTo(start[0], start[1])
      for (let i=0; i<points; i++){
          let cur = verts[i], m = mid(cur, verts[(i+1)%points])
          ctx.arcTo(cur[0], cur[1], m[0], m[1], radius)
      }
      ctx.closePath()
      ctx.fill("evenodd")
  }

  for (let i=0; i<count; i++){
      let x = rng.intBetween(0, width),
          y = rng.intBetween(0, height),
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
