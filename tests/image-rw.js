import seed from 'random-seed'

export default async function imageReadWrite({lib, createCanvas, loadImage, getBitmap}) {
  const size = 512,
        rounds = 1000,
        canvas = createCanvas(size, size),
        ctx = canvas.getContext('2d'),
        img = await loadImage(`${import.meta.dirname}/assets/blend-bg.png`, canvas),
        pat = ctx.createPattern(img, "repeat"),
        rng = seed(process.env.SEED || 123),
        coord = (max=size) => rng.intBetween(1, max-1)

  if (lib.startsWith('skia')){
    canvas.gpu = false // equivalent to `willReadFrequently` getContext() option
  }

  ctx.fillStyle = pat
  ctx.fillRect(0, 0, size, size)
  for (let i=0; i<rounds; i++){
    let [x,y] = [coord(size), coord(size)]
    let [w,h] = [coord(size-x), coord(size-y)]
    let img = ctx.getImageData(x, y, w, h)
    ctx.putImageData(img, coord(), coord())
  }


  return getBitmap(canvas)
}