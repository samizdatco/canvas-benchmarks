export default async function drawToSVG({lib, createPdfCanvas, getPdf, loadImage}) {
  const canvas = createPdfCanvas(1024, 768),
        ctx = canvas.getContext('2d'),
        svg = await loadImage(`${import.meta.dirname}/assets/ghostscript-tiger.svg`),
        png = await loadImage(`${import.meta.dirname}/assets/format.png`)

  ctx.font = 'bold italic 64px Times'
  ctx.fillText("ABCabc12345!$&@", 20, 100)
  ctx.drawImage(svg, 0, 150, 512, 512)
  ctx.drawImage(png, 0, 620)

  // NOTE: node-canvas exports the svg image as an embedded PNG
  return getPdf(canvas)
}
