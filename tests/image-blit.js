import seed from 'random-seed'

export default async function imageScaleRot({lib, createCanvas, loadImage, getBitmap}) {
  const size = 1024,
        canvas = createCanvas(size, size),
        ctx = canvas.getContext('2d'),
        img = await loadImage(`${import.meta.dirname}/assets/format.png`, canvas),
        rng = seed(process.env.SEED || 123),
        coord = (max=size) => rng.intBetween(1, max-1)

  ctx.globalAlpha = 0.25
  for (let i=0; i<50; i++){
    ctx.save()
    ctx.rotate(rng.floatBetween(-Math.PI/2, Math.PI/2))
    let [x,y] = [coord(size), coord(size)]
    let [w,h] = [coord(size), coord(size)]
    ctx.drawImage(img, x, y, w, h)
    ctx.restore()
  }

  return getBitmap(canvas)
}