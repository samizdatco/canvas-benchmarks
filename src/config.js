import {fileURLToPath, pathToFileURL} from "url";
import {readFileSync, mkdirSync as fsMkdir, existsSync} from 'fs'
import child_process from 'child_process'
import {promisify} from 'util'
import path from 'path'
import {homedir} from 'os'

const exec = promisify(child_process.exec);

// Benchmark mode, selected by the MODE env var:
//   release     (default) cross-library comparison; skia-canvas is the npm release
//   local       the same cross-library comparison, but skia-canvas is the local build
//   prerelease  skia-canvas only: the npm release vs. the local (prerelease) build
export const mode = process.env.MODE || 'release'
if (!['release', 'local', 'prerelease'].includes(mode)){
  throw new Error(`Unknown MODE '${mode}' (expected: release, local, or prerelease)`)
}

// find the local build for runs in local/prerelease mode
export const LOCAL_DIR = process.env.SKIA_DIR || path.join(homedir(), 'projects/skia-canvas')
export const LOCAL_MODULE = pathToFileURL(path.join(LOCAL_DIR, 'lib/index.mjs')).href
export const LOCAL_BINARY = path.join(LOCAL_DIR, 'lib/skia.node')

import drawBeziers from '../tests/beziers.js'
import drawSVG from '../tests/from-svg.js'
import drawGradients from '../tests/gradients.js'
import drawHouse from '../tests/house.js'
import drawImageScale from '../tests/image-blit.js'
import drawImageRW from '../tests/image-rw.js'
import drawPaths from '../tests/path2d.js'
import drawText from '../tests/text.js'
import drawToSVG from '../tests/to-svg.js'
import drawToPDF from '../tests/to-pdf.js'
import drawFromPDF from '../tests/from-pdf.js'
import drawFromPDFNative from '../tests/from-pdf-native.js'

// label the release rows with whichever version npm actually installed
const RELEASE = (() => {
  try{ return 'v' + JSON.parse(readFileSync(new URL('../node_modules/skia-canvas/package.json', import.meta.url))).version }
  catch(e){ return 'release' }
})()

export const libs = mode === 'prerelease' ? {
  "release-sync":  {name:`skia-canvas · ${RELEASE} (serial)`, color:"blue",  skia:true, module:'skia-canvas', async:false},
  "release-async": {name:`skia-canvas · ${RELEASE} (async)`,  color:"cyan",  skia:true, module:'skia-canvas', async:true},
  "local-sync":    {name:'skia-canvas · local (serial)',   color:"green", skia:true, module:LOCAL_MODULE, async:false},
  "local-async":   {name:'skia-canvas · local (async)',    color:"red",   skia:true, module:LOCAL_MODULE, async:true},
} : {
  "wasm": {name:'canvaskit-wasm', color:"green"},
  "canvas": {name:'canvas', color:"red"},
  "napi": {name:'@napi-rs/canvas', color:"yellow"},
  "skia-sync": mode === 'local'
    ? {name:'skia-canvas · local (serial)', color:"blue", skia:true, module:LOCAL_MODULE}
    : {name:'skia-canvas (serial)', color:"blue"},
  "skia-async": mode === 'local'
    ? {name:'skia-canvas · local (async)', color:"cyan", skia:true, module:LOCAL_MODULE}
    : {name:'skia-canvas (async)', color:"cyan"},
}

// from-pdf-native uses skia-canvas's own PDF decoding, so it runs on the skia rows only.
const nonSkia = Object.keys(libs).filter(key => !(libs[key].skia || key.startsWith('skia-')))

export const tests = {
  "cold-start": {label:"Startup latency", test:null, rounds:100},
  "house": {label:"Simple house", test:drawHouse, rounds:200},
  "path2d": {label:"Complex shapes", test:drawPaths, rounds:200,
    note:"`canvaskit-wasm` renders the shapes, but positions them incorrectly"
  },
  "beziers": {label:"Bezier curves", test:drawBeziers, rounds:20},
  "from-svg": {label:"SVG to PNG", test:drawSVG, rounds:100, omit:["wasm"]},
  "to-svg": {label:"SVG to SVG", test:drawToSVG, rounds:200, omit:["wasm"],
    note: "`canvas` & `napi-rs` convert the input SVG to a bitmap rather than exporting it as a vector"
  },
  "to-pdf": {label:"SVG to PDF", test:drawToPDF, rounds:200, omit:["wasm"],
    note: "`canvas` & `napi-rs` convert the input SVG to a bitmap rather than exporting it as a vector"
  },
  "from-pdf": {label:"PDF to PNG: pdf.js", test:drawFromPDF, rounds:20, omit:["wasm"] },
  "from-pdf-native": {label:"PDF to PNG: native", test:drawFromPDFNative, rounds:20, omit:nonSkia },
  "image-blit": {label:"Scale/rotate images", test:drawImageScale, rounds:50},
  "image-rw": {label:"Get/put ImageData", test:drawImageRW, rounds:100, omit:["wasm"]},
  "gradients": {label:"Gradients", test:drawGradients, rounds:150},
  "text": {label:"Basic text", test:drawText, rounds:200},
}

export async function initialize(libName){
    if (libName=='canvas'){
        let mod = await import('canvas'),
            {createCanvas, loadImage} = mod,
            createSvgCanvas = (w, h) => createCanvas(w, h, 'svg'),
            createPdfCanvas = (w, h) => createCanvas(w, h, 'pdf'),
            getBitmap = canvas => new Promise((res, rej) =>
              canvas.toBuffer((err, buf) => err ? rej(err) : res(buf), "image/png")
            ),
            getSvg = canvas => canvas.toBuffer(),
            getPdf = canvas => canvas.toBuffer(),
            pdfGlobals = {DOMMatrix:mod.DOMMatrix, ImageData:mod.ImageData},
            pdfContext = mod.CanvasRenderingContext2D,
            pdfPath2DPolyfill = true // node-canvas doesn't have its own Path2D
        return {lib:libName, createCanvas, createSvgCanvas, createPdfCanvas, loadImage, getBitmap, getSvg, getPdf, pdfGlobals, pdfContext, pdfPath2DPolyfill}
    }else if (libName=='napi'){
        let mod = await import('@napi-rs/canvas'),
            {createCanvas, loadImage, PDFDocument} = mod,
            createSvgCanvas = (w, h) => createCanvas(w, h, 1), // 1: outline fonts
            createPdfCanvas = (w, h) => {
              let doc = new PDFDocument()
              return {_pdfDoc: doc, ctx: doc.beginPage(w, h), getContext(){ return this.ctx }}
            },
            getBitmap = canvas => canvas.encode("png"),
            getSvg = canvas => canvas.getContent(),
            getPdf = canvas => { canvas._pdfDoc.endPage(); return canvas._pdfDoc.close() },
            pdfGlobals = {Path2D:mod.Path2D, DOMMatrix:mod.DOMMatrix, ImageData:mod.ImageData}
        return {lib:libName, createCanvas, createSvgCanvas, createPdfCanvas, loadImage, getBitmap, getSvg, getPdf, pdfGlobals}
    }else if (libName=='wasm'){
      let {default:init} = await import('canvaskit-wasm'),
          CanvasKit = await init({
              locateFile: (file) => `${import.meta.dirname}/../node_modules/canvaskit-wasm/bin/${file}`,
          }),
          createCanvas = (w, h) => CanvasKit.MakeCanvas(w, h),
          loadImage = (path, canvas) => {
              let img = readFileSync(path)
              return canvas.decodeImage(img)
          },
          getBitmap = canvas => canvas.toDataURL("image/png")
      return {lib:libName, createCanvas, loadImage, getBitmap}
    }else if (libName.startsWith('skia-') || libs[libName]?.skia){
        let {module='skia-canvas', async} = libs[libName] ?? {},
            mod = await import(module),
            {Canvas, loadImage} = mod,
            isAsync = async ?? libName.endsWith('-async'),
            createCanvas = (w, h) => new Canvas(w, h),
            createSvgCanvas = createCanvas,
            createPdfCanvas = createCanvas,
            getBitmap = canvas => canvas.toBuffer("png"),
            getSvg = canvas => canvas.toBuffer("svg", {outline:true}),
            getPdf = canvas => canvas.toBuffer("pdf"),
            pdfGlobals = {Path2D:mod.Path2D, DOMMatrix:mod.DOMMatrix, ImageData:mod.ImageData}
        return {lib:libName, createCanvas, createSvgCanvas, createPdfCanvas, loadImage, getBitmap, getSvg, getPdf, pdfGlobals, isAsync, isSkia:true}
    }
}

function formatBytes(b){
  if (b < 1024){ return `${b} B` }else{ b /= 1024}
  if (b < 1024){ return `${b} KiB` }else{ b /= 1024}
  if (b < 1024){ return `${b.toFixed(2)} MiB` }else{ b /= 1024}
  if (b < 1024){ return `${b.toFixed(2)} GiB` }else{ b /= 1024}
  return `${b.toFixed(2)} TiB`
}

// describe the local build with its jj log entry
function localVersion(){
  let tmpl = `change_id.short(8) ++ if(description, " — " ++ '"' ++ description.first_line() ++ '"')`
  try{
    return child_process.execFileSync('jj', ['--no-pager', 'log', '-r', '@', '--no-graph', '-T', tmpl],
                                      {cwd:LOCAL_DIR, encoding:'utf8', stdio:['ignore', 'pipe', 'ignore']}).trim()
  }catch(e){
    return 'unknown'
  }
}

export async function sysInfo(){
  let included = ['canvas', '@napi-rs/canvas', 'canvaskit-wasm', 'skia-canvas']

  let deps = JSON.parse((await exec('npm ls --json')).stdout).dependencies,
      si = await import('systeminformation'),
      sys = await si.system(),
      cpu = await si.cpu(),
      mem = await si.mem(),
      os = await si.osInfo(),
      gfx = await si.graphics(),
      versions = await si.versions()

  if (sys.model=='Mac16,9' && sys.version=='Unknown') sys.version = 'Mac Studio (2025)'

  let info = {
    sys:`${sys.version} / ${sys.manufacturer} ${sys.model}`,
    cpu:`${cpu.manufacturer} ${cpu.brand} (${cpu.speed} GHz, ${cpu.cores} cores)`,
    gpu: gfx.controllers.map(({bus, model, vendor, cores})=>`${model} / ${vendor} (${bus}, ${cores} cores)`),
    mem:`${formatBytes(mem.total)} total (${formatBytes(mem.free)} free)`,
    os:`${os.distro} ${os.release} ${os.codename ? `(${os.codename})`: ''}`,
    node: versions.node,
    libs: mode === 'prerelease'
      ? {'skia-canvas (npm release)': deps['skia-canvas'].version, 'skia-canvas (local build)': localVersion()}
      : Object.fromEntries(included.map(lib =>
          [lib, (mode === 'local' && lib=='skia-canvas') ? localVersion() : deps[lib].version]
        )),
  }

  return info
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  sysInfo().then(console.log)
}
