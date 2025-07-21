import {fileURLToPath} from "url";
import {readFileSync, mkdirSync as fsMkdir} from 'fs'
import child_process from 'child_process'
import {promisify} from 'util'

const exec = promisify(child_process.exec);

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

export const OUTPUT_DIR = `results/${process.platform}-${process.arch}/${new Date().toLocaleDateString('en-CA')}`

const SKIA_CANVAS = 'skia-canvas'
// const SKIA_CANVAS = '../../../skia-canvas/lib/index.mjs'

export const libs = {
  "wasm": {name:'canvaskit-wasm', color:"green"},
  "canvas": {name:'canvas', color:"red"},
  "napi": {name:'@napi-rs/canvas', color:"yellow"},
  "skia-sync": {name:'skia-canvas (serial)', color:"blue"},
  "skia-async": {name:'skia-canvas (async)', color:"cyan"},
}

export const tests = {
  "cold-start": {label:"Startup latency", test:null, rounds:50},
  "house": {label:"Simple house", test:drawHouse, rounds:200},
  "path2d": {label:"Complex shapes", test:drawPaths, rounds:200, omit:["wasm"]},
  "beziers": {label:"Bezier curves", test:drawBeziers, rounds:20},
  "from-svg": {label:"SVG to PNG", test:drawSVG, rounds:100, omit:["wasm"]},
  "to-svg": {label:"SVG to SVG", test:drawToSVG, rounds:200, omit:["wasm"],
    note: "`canvas` & `napi-rs` convert the input SVG to a bitmap rather than exporting it as a vector"
  },
  "to-pdf": {label:"SVG to PDF", test:drawToPDF, rounds:200, omit:["wasm", "napi"],
    note: "`canvas` converts the input SVG to a bitmap rather than exporting it as a vector"
  },
  "image-blit": {label:"Scale/rotate images", test:drawImageScale, rounds:50},
  "image-rw": {label:"Get/put ImageData", test:drawImageRW, rounds:150, omit:["wasm"]},
  "gradients": {label:"Gradients", test:drawGradients, rounds:150},
  "text": {label:"Basic text", test:drawText, rounds:200},
}

export async function initialize(libName){
    if (libName=='canvas'){
        let mod = await import('canvas'),
            {createCanvas, loadImage} = mod,
            createSvgCanvas = (w, h) => createCanvas(w, h, 'svg'),
            createPdfCanvas = (w, h) => createCanvas(w, h, 'pdf'),
            getBitmap = canvas => canvas.toBuffer("image/png"),
            getSvg = canvas => canvas.toBuffer(),
            getPdf = canvas => canvas.toBuffer()
        return {lib:libName, createCanvas, createSvgCanvas, createPdfCanvas, loadImage, getBitmap, getSvg, getPdf}
    }else if (libName=='napi'){
        let mod = await import('@napi-rs/canvas'),
            {createCanvas, loadImage} = mod,
            createSvgCanvas = (w, h) => createCanvas(w, h, 1), // 1: outline fonts
            getBitmap = canvas => canvas.toBuffer("image/png"),
            getSvg = canvas => canvas.getContent()
        return {lib:libName, createCanvas, createSvgCanvas, loadImage, getBitmap, getSvg}
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
    }else if (['skia-sync', 'skia-async'].includes(libName)){
        let mod = await import (SKIA_CANVAS),
            {Canvas, loadImage} = mod,
            isAsync = libName.endsWith('-async'),
            createCanvas = (w, h) => new Canvas(w, h),
            createSvgCanvas = createCanvas,
            createPdfCanvas = createCanvas,
            getBitmap = canvas => canvas.toBuffer("png"),
            getSvg = canvas => canvas.toBuffer("svg", {outline:true}),
            getPdf = canvas => canvas.toBuffer("pdf")
        return {lib:libName, createCanvas, createSvgCanvas, createPdfCanvas, loadImage, getBitmap, getSvg, getPdf, isAsync}
    }
}

function formatBytes(b){
  if (b < 1024){ return `${b} B` }else{ b /= 1024}
  if (b < 1024){ return `${b} KiB` }else{ b /= 1024}
  if (b < 1024){ return `${b.toFixed(2)} MiB` }else{ b /= 1024}
  if (b < 1024){ return `${b.toFixed(2)} GiB` }else{ b /= 1024}
  return `${b.toFixed(2)} TiB`
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
    libs: Object.fromEntries(included.map(lib => [lib, deps[lib].version])),
  }

  return info
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  sysInfo().then(console.log)
}
