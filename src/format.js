import chalk from 'chalk'
import path from 'path'
import {markdownTable} from 'markdown-table'
import {readFileSync, writeFileSync, existsSync, statSync} from 'fs'
import {fileURLToPath} from 'url'
import {createRequire} from 'module'
import {libs, tests} from "./config.js"

const mdCode = s => `\`${s}\``
const mdItalic = s => `*${s}*`
const mdBold = s => `**${s}**`

const palette = {
  green:"#59a14f",
  red:"#e15759",
  yellow:"#edc949",
  blue:"#4e79a7",
  cyan:"#76b7b2"
}

function elapsed(t, pad=7){
  let s = t < 1 ? '<1 ms'
        : t < 1000 ? `${Math.round(t)} ms`
        : t < 601000 ? `${(t/1000).toFixed(2)} s`
        : `${Math.floor(t / 60000)}m ${((t % 60000) / 1000).toFixed(2)}s`
  return s.padStart(pad, '\u00a0')
}

function fileSize(bytes, pad=7){
  let s = bytes < 1024 ? `${bytes} B`
        : bytes < 1048576 ? `${Math.round(bytes/1024)} KB`
        : `${(bytes/1048576).toFixed(1)} MB`
  return s.padStart(pad, '\u00a0')
}

export function mdFrontmatter(info, date){
  let gpuInfo = info.gpu.length > 1 ? '\n  - ' + info.gpu.join('\n  - ') : info.gpu[0]
  let gpuLabel = mdBold(info.gpu.length > 1 ? 'GPUs' : 'GPU')

  return [
    `## Canvas Benchmarks · ${new Date(date.replace('-','/')).toLocaleDateString("en-GB", {day:"numeric", month:"short", year:"numeric"})}`,
    `#### Configuration`,
    `- **System**: ${info.sys}`,
    `- **CPU**: ${info.cpu}`,
    `- ${gpuLabel}: ${gpuInfo}`,
    `- **Memory**: ${info.mem}`,
    `- **OS**: ${info.os}`,
    `- **Node**: ${info.node}`,
    ``,
    `#### Libraries Tested`
  ].concat(
    Object.entries(info.libs).map(([lib, v]) => {
      let pkg = lib.replace(/\s*\(.+\)$/, '')
      return /^\d+\.\d+\./.test(v) ? `- [${mdCode(lib)}](https://www.npmjs.com/package/${pkg}): v${v}`
                                    : `- ${mdCode(lib)}: ${v}`
    })
  ).concat([
    '> Note: Skia Canvas is tested running in two modes: `serial` and `async`. When running serially, each rendering operation is `await`ed before continuing to the next test iteration. When running asynchronously, all the test iterations are begun at once and are executed in parallel within a `Promise.all` block, making use of the library’s multi-threading.',
  ])
}

export function formatResults({date, info, benchmarks}, outputDir){
  let output = mdFrontmatter(info, date)

  // the baseLib is marked as `baseline` in config.js and its time sets the 1x for Relative Speed values
  let baseLib = Object.keys(libs).find(lib => libs[lib].baseline),
      rowsFor = id => Object.keys(libs)
                            .map(lib => benchmarks.find(r => r.test==id && r.lib==lib))
                            .filter(Boolean),
      bars = new SvgBars()

  for (let [id, {label, rounds, note, timing, under}] of Object.entries(tests)){
    let runs = rowsFor(id),
        baseline = (under ? rowsFor(under) : runs).find(r => r.lib==baseLib && !r.unsupported)
    if (under) runs = runs.filter(r => !r.unsupported) // a continuation lists only what it supports
    if (!runs.length || (!timing && !baseline)) continue

    let table = [ timing ? ["Library", "Elapsed Time"]
                : under ? ["", "", "", ""] // continues another table so skip header
                : ["Library", "Per Run", `Relative Speed (${rounds} iterations)`, "Output"]
    ].concat(runs.map(({lib, test, ms, unsupported}) => {
      let {name} = libs[lib],
          ext = (id=='to-svg') ? 'svg' : (id=='to-pdf') ? 'pdf' : 'png',
          image = `${id}_${lib}.${ext}`,
          snapshot = `${outputDir}/snapshots/${image}`,
          output = existsSync(snapshot) ? `[${mdCode(fileSize(statSync(snapshot).size))}](snapshots/${image})` : '  ',
          na = mdCode(' ————— '),   // as wide as an `elapsed()` time
          naSpeed = mdCode(' ——— '), // as wide as a relative-speed multiplier
          spacer = '   '

      // don't list (sync) and (async) redundantly
      if (test=='cold-start') name = name.replace(/ \(.*$/,'')

      // a `timing` result has two columns with a dot plot sharing the elapsed-time cell
      if (timing) return unsupported
        ? [name, na + spacer + mdItalic("not supported")]
        : [mdItalic(name), `${mdCode(elapsed(ms/rounds))} ${bars.addDot(ms/rounds, lib, id)}`]

      // keep relative speed multipliers at a fixed-width of 5 chars
      let rate = baseline.ms / ms,
          speedup = `${rate.toFixed(rate < 100 ? 1 : 0)}×`.padStart(5, '\u00a0')
      return unsupported
        ? [name, na, naSpeed + spacer + mdItalic("not supported"), '  ']
        : [mdItalic(name),
           mdCode(elapsed(ms/rounds)),
           `${mdCode(speedup)} ${bars.addBar(rate, lib, id)}`,
           output]
    }))

    if (!under) output.push(`\n### [${label}](/tests/${id}.js)`)
    if (note) output.push(`${under ? '\n' : ''}> *${note.replace(/\(:test:\)/g, `(/tests/${id}.js)`)}*\n`)
    output.push(markdownTable(table))
  }

  return [output.join('\n'), bars.toString()]
}

class SvgBars{
  width = 250
  height = 16
  pad = 10
  max = 11     // relative-speed axis max
  msSpan = 250 // dot-plot max
  bars = []

  constructor(){
    // import skia-canvas as needed so it doesn't interfere with the cold-start test's accuracy
    this.Canvas = createRequire(import.meta.url)('skia-canvas').Canvas
  }

  addBar(rate, lib, test){
    let {pad, width, height, max, Canvas} = this,
        canvas = new Canvas(width+pad, height),
        ctx = canvas.getContext("2d"),
        span = Math.min(rate, max)

    ctx.beginPath()
    for (let mark=0; mark<span; mark++){
      let x = pad + (mark * width/max)
      ctx.rect(x, 0, pad + ((mark+1) * width/max) - x - .5, height)
    }
    ctx.clip()
    ctx.fillStyle = palette[libs[lib].color]

    let top = 4, right = pad + span/max * width
    if (rate <= max){
      ctx.fillRect(pad, top, right - pad, height - top)
    }else{
      // draw a jagged edge for any bars that would overflow the axis `max`
      let steps = 3, notch = 3, gap = 3.33, // three segments: 1.5 cycles of the zigzag
          line = pad + (max - 1) * width/max,
          zig = []
      for (let i=0; i<=steps; i++){
        zig.push([(i%2 ? -notch : notch)/2, top + (height - top)*i/steps])
      }

      // the main part of the bar
      ctx.beginPath()
      ctx.moveTo(pad, top)
      for (let [dx, y] of zig) ctx.lineTo(line - gap/2 + dx, y)
      ctx.lineTo(pad, height)
      ctx.closePath()

      // the tail of the bar after the break
      ctx.moveTo(right, top)
      ctx.lineTo(right, height)
      for (let i=zig.length-1; i>=0; i--) ctx.lineTo(line + gap/2 + zig[i][0], zig[i][1])
      ctx.closePath()
      ctx.fill()
    }

    return this.emit(canvas, `${test}_${lib}`)
  }

  addDot(ms, lib, test){
    let {pad, width, height, msSpan, Canvas} = this,
        canvas = new Canvas(width+pad, height),
        ctx = canvas.getContext("2d"),
        mid = height/2

    ctx.strokeStyle = 'hsla(0, 0%, 50%, .75)'
    ctx.beginPath()
    ctx.moveTo(pad, mid)
    ctx.lineTo(pad + width, mid)
    for (let t=0; t<=msSpan; t+=50){
      // draw a tick every 50ms alternating to full height at the hundreds
      let x = Math.min(pad + width - .5, Math.max(pad + .5, pad + t/msSpan * width)),
          reach = (t % 100 ? .4 : 1) * height/2
      ctx.moveTo(x, mid - reach)
      ctx.lineTo(x, mid + reach)
    }
    ctx.stroke()

    ctx.fillStyle = palette[libs[lib].color]
    ctx.beginPath()
    ctx.arc(pad + Math.min(ms, msSpan)/msSpan * width, mid, 5, 0, 2*Math.PI)
    ctx.fill()

    return this.emit(canvas, `${test}_${lib}`)
  }

  emit(canvas, anchor){
    let svg = canvas.toBufferSync("svg").toString(),
        inner = svg.match(/<svg.*?>(.*?)<\/svg>/s)[1].trim()
    this.bars.push(`<g class="bar" id="${anchor}">\n    ${inner}\n</g>`)
    return `![ ](bars.svg#${anchor})`
  }

  toString(){
    let {pad, width, height} = this
    return `<?xml version="1.0" encoding="utf-8" ?>
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width+pad}" height="${height}">
        <defs>
          <style>
            <![CDATA[
              .bar { display: none; }
              .bar:target { display: inline; }
            ]]>
          </style>
        </defs>
        ${this.bars.join('\n')}
      </svg>`
  }
}

function sparkline(n, pad=0){
  let steps = ' ▏▎▍▌▋▊▉█'
  let bar = ''
  while (n > 1){
    bar += steps[8]
    n -= 1
  }
  bar += steps[Math.floor(n*8)]
  return bar.padEnd(pad, '\u00a0')
}

export function printHeader(id){
  let {label, rounds} = tests[id]
  console.log(`\n${label} (${rounds} iterations)`)
}

const nameWidth = Math.max(...Object.values(libs).map(l => l.name.length))

export function printResult(name, rounds, {ms, unsupported}, color){
  if (unsupported){
    console.log(' ', name.padEnd(nameWidth), ' —————— (unsupported)')
  }else{
    console.log(' ',
      name.padEnd(nameWidth),
      elapsed(ms),
      `(avg. ${elapsed(ms/rounds,6)})`,
      chalk[color](sparkline(ms/1000))
    )
  }
}

function toTTY(results){
  for (let [id, {rounds}] of Object.entries(tests)){
    let runs = results.benchmarks.filter(r => r.test==id)
    if (runs.length==0) continue

    printHeader(id)
    for (const run of runs){
      let {name, color} = libs[run.lib]
      printResult(name, rounds, run, color)
    }
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv.length < 3){
    console.log('USAGE: node src/format.js results/<benchmark-dir>/data.json')
    process.exit(1)
  }

  // read a data.json file and update its index.md + bars.svg
  let dataPath = process.argv[2],
      dataDir = path.dirname(dataPath),
      data = JSON.parse(readFileSync(dataPath))

  toTTY(data) // log the summary to console

  let [md, bars] = formatResults(data, dataDir)
  writeFileSync(`${dataDir}/index.md`, md)
  writeFileSync(`${dataDir}/bars.svg`, bars)
  console.log('\nFormatted results in:', chalk.bold(dataDir))
}
