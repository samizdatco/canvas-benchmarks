export default async function drawSVG({createCanvas, loadImage, getBitmap}){
  const width = 1024,
        height = 1024 * 1.4,
        canvas = createCanvas(width, height),
        ctx = canvas.getContext('2d'),
        img = await loadImage(`${import.meta.dirname}/assets/grapes.svg`, canvas)

  ctx.drawImage(img, 0, 0, width, height)

  return getBitmap(canvas)
}
