import {readFileSync} from 'fs'

// skia-only counterpart to from-pdf (using loadImage's PDF support)

function contactSheetGrid(count, aspect){
  const COLS = 6, THUMB_W = 480, GUTTER = 8, MARGIN = 12
  const rows = Math.ceil(count / COLS),
        thumbH = Math.round(THUMB_W * aspect),
        width = MARGIN*2 + COLS*THUMB_W + (COLS-1)*GUTTER,
        height = MARGIN*2 + rows*thumbH + (rows-1)*GUTTER,
        cell = i => ({
          x: MARGIN + (i % COLS) * (THUMB_W + GUTTER),
          y: MARGIN + Math.floor(i / COLS) * (thumbH + GUTTER),
          w: THUMB_W, h: thumbH,
        })
  return {width, height, cell}
}

export default async function drawFromPDFNative({createCanvas, loadImage, getBitmap}){
  const buffer = readFileSync(`${import.meta.dirname}/assets/tracemonkey.pdf`)

  let first
  try {
    first = await loadImage(buffer, {page: 1})
  } catch(e) {
    let err = new Error('loadImage cannot decode PDF input')
    err.unsupported = true
    throw err
  }

  const pages = [first]
  for (let p = 2; ; p++){
    let page
    try { page = await loadImage(buffer, {page: p}) }
    catch(e){ break } // past the last page
    if (!page?.width) break
    pages.push(page)
  }

  const {width, height, cell} = contactSheetGrid(pages.length, first.height / first.width),
        canvas = createCanvas(width, height)
  canvas.gpu = false // match the CPU rasterization the pdf.js benchmark
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, width, height)
  pages.forEach((page, i) => { let c = cell(i); ctx.drawImage(page, c.x, c.y, c.w, c.h) })

  return getBitmap(canvas)
}
