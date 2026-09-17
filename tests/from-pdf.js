import {readFileSync} from 'fs'

const COLS = 6, THUMB_W = 480, GUTTER = 8, MARGIN = 12
function contactSheetGrid(count, aspect){
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

// pdf.js expects Path2D/DOMMatrix/ImageData globals to be there, so populate them before
// importing the library
let prepared = false
async function preparePdfjs({pdfGlobals={}, pdfContext, pdfPath2DPolyfill}){
  if (prepared) return
  prepared = true
  for (let [name, value] of Object.entries(pdfGlobals)) if (value) globalThis[name] = value

  // node-canvas needs a polyfill for Path2D support
  if (pdfPath2DPolyfill){
    let {Path2D, applyPath2DToCanvasRenderingContext} = await import('path2d')
    globalThis.Path2D = Path2D
    applyPath2DToCanvasRenderingContext(pdfContext)
  }
}

async function renderPages(buffer, createCanvas){
  const {getDocument} = await import('pdfjs-dist/legacy/build/pdf.mjs'),
        standardFontDataUrl = new URL('../node_modules/pdfjs-dist/standard_fonts/', import.meta.url).href,
        CanvasFactory = class {
          create(w, h){ let c = createCanvas(Math.ceil(w), Math.ceil(h)); return {canvas:c, context:c.getContext('2d')} }
          reset(cc, w, h){ cc.canvas.width = Math.ceil(w); cc.canvas.height = Math.ceil(h) }
          destroy(cc){ if (cc.canvas){ cc.canvas.width = 0; cc.canvas.height = 0 } cc.canvas = cc.context = null }
        },
        doc = await getDocument({data:new Uint8Array(buffer), CanvasFactory, standardFontDataUrl, isEvalSupported:false, verbosity:0}).promise,
        {width:pageW, height:pageH} = (await doc.getPage(1)).getViewport({scale:1}),
        scale = THUMB_W / pageW,
        drawables = []

  for (let p=1; p<=doc.numPages; p++){
    let page = await doc.getPage(p),
        viewport = page.getViewport({scale}),
        thumb = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height))
    await page.render({canvasContext:thumb.getContext('2d'), viewport, canvasFactory:new CanvasFactory()}).promise
    drawables.push(thumb)
  }
  return {drawables, aspect: pageH / pageW}
}

export default async function drawFromPDF(lib){
  await preparePdfjs(lib)

  const {getBitmap, isSkia} = lib,
        createCanvas = isSkia // disable GPU to make antialiasing comparable
          ? (w, h) => { let c = lib.createCanvas(w, h); c.gpu = false; return c }
          : lib.createCanvas,
        buffer = readFileSync(`${import.meta.dirname}/assets/tracemonkey.pdf`),
        {drawables, aspect} = await renderPages(buffer, createCanvas),
        {width, height, cell} = contactSheetGrid(drawables.length, aspect),
        canvas = createCanvas(width, height),
        ctx = canvas.getContext('2d')

  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, width, height)
  drawables.forEach((d, i) => { let c = cell(i); ctx.drawImage(d, c.x, c.y, c.w, c.h) })

  return getBitmap(canvas)
}
