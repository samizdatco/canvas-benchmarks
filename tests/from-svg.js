export default async function drawSVG({createCanvas, loadImage, getBitmap}){
  const canvas = createCanvas(1024, 1024),
        ctx = canvas.getContext('2d'),
        img = await loadImage(`${import.meta.dirname}/assets/grapes.svg`, canvas)

  ctx.drawImage(img, 0, 0, 1024, 1024)

  return getBitmap(canvas)
}
