import chalk from 'chalk'
import path from 'path'
import {markdownTable} from 'markdown-table'
import {readFileSync, writeFileSync, existsSync} from 'fs'
import {fileURLToPath} from 'url'
import {libs, tests, mkdir, OUTPUT_DIR} from "./config.js"
import {Canvas} from 'skia-canvas'

let BARS_FILE = OUTPUT_DIR + '/bars.svg'
let SNAPSHOTS_DIR = OUTPUT_DIR + '/snapshots'

const palette = {
  green:"#59a14f",
  red:"#e15759",
  yellow:"#edc949",
  blue:"#4e79a7",
  cyan:"#76b7b2"
}

function elapsed(t, pad=7){
  let s = t < 1000 ? `${Math.round(t)} ms`
        : t < 601000 ? `${(t/1000).toFixed(2)} s`
        : `${Math.floor(t / 60000)}m ${((t % 60000) / 1000).toFixed(2)}s`
  return s.padStart(pad, '\u00a0')
}

function ttyBar(n, pad=0){
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

export function printResults(name, rounds, {ms, unsupported}, color){
  if (unsupported){
    console.log(' ', name.padEnd(20), ' —————— (unsupported)')
  }else{
    console.log(' ',
      name.padEnd(20),
      elapsed(ms),
      `(avg. ${elapsed(ms/rounds,6)})`,
      chalk[color](ttyBar(ms/1000))
    )
  }
}

function toTTY(results){
  for (let [id, {rounds}] of Object.entries(tests)){
    printHeader(id)
    let runs = results.benchmarks.filter(r => r.test==id)
    for (const run of runs){
      let {name, color} = libs[run.lib]
      printResults(name, rounds, run, color)
    }
  }
}

class SvgBars{
  width = 250
  height = 16
  pad = 10
  bars = []

  constructor(maxTime){
    this.max = Math.ceil(maxTime/1000)
  }

  addBar(ms, lib, test){
    let {pad, width, height, max} = this,
        canvas = new Canvas(width+pad, height),
        ctx = canvas.getContext("2d"),
        anchor = `${test}_${lib}`

    ctx.beginPath()
    for (let mark=0; mark<ms; mark++){
      let x = pad + (mark * width/max)
      let w = pad + ((mark+1) * width/max) - x - .5
      ctx.rect(x, 0, w, height)
    }
    ctx.clip()
    ctx.fillStyle = palette[libs[lib].color]
    ctx.fillRect(pad, 4, ms/max * width, height)

    let svg = canvas.toBufferSync("svg").toString(),
        inner = svg.match(/<svg.*?>(.*?)<\/svg>/s)[1].trim()
    this.bars.push(`<g class="bar" id="${anchor}">\n    ${inner}\n</g>`)
    return `<img src="bars.svg#${anchor}" width="${width+pad}" height="${height}">`
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

  saveAs(filePath){
    mkdir(path.dirname(filePath))
    writeFileSync(filePath, this.toString())
  }
}

const mdCode = s => `\`${s}\``
const mdItalic = s => `*${s}*`
const mdBold = s => `**${s}**`

export function mdFrontmatter(info, timestamp){
  let gpuInfo = info.gpu.length > 1 ? '\n  - ' + info.gpu.join('\n  - ') : info.gpu[0]
  let gpuLabel = mdBold(info.gpu.length > 1 ? 'GPUs' : 'GPU')

  return [
    `## Canvas Benchmarks · ${new Date(timestamp).toLocaleDateString("en-GB", {day:"numeric", month:"short", year:"numeric"})}`,
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
    Object.entries(info.libs).map(([lib, v]) => `- [${mdCode(lib)}](https://www.npmjs.com/package/${lib}): v${v}`)
  ).concat([
    '> Note: Skia Canvas is tested running in two modes: `serial` and `async`. When running serially, each rendering operation is `await`ed before continuing to the next test iteration. When running asynchronously, all the test iterations are begun at once and are executed in parallel within a `Promise.all` block, making use of the library’s multi-threading.',
  ])
}

export function mdHeader(id, note){
  let {label, rounds} = tests[id],
      nb = (note) ? `\n> Note: ${note}\n` : ''
  return `\n### [${label}](/tests/${id}.js) (${rounds} iterations)${nb}`
}

export function toMarkdown({timestamp, info, benchmarks}){
  let output = mdFrontmatter(info, timestamp)
  let maxTime = benchmarks.reduce((acc, {ms}) => Math.max(ms || 0, acc), 0)
  let bars = new SvgBars(maxTime)

  for (let [id, {rounds, note}] of Object.entries(tests)){
    let rows = [
      ["Library", "Per Run", "Total Time"]
    ]
    let runs = benchmarks.filter(r => r.test==id)
    for (const run of runs){
      let {name} = libs[run.lib],
          {test, ms, unsupported} = run,
          ext = (id=='to-svg') ? 'svg' : (id=='to-pdf') ? 'pdf' : 'png',
          image = `${id}_${run.lib}.${ext}`,
          link = existsSync(`${SNAPSHOTS_DIR}/${image}`) ? `[👁️](snapshots/${image})` : '\u2003\u2003',
          na = mdCode('\u00a0—————\u00a0'),
          spacer = '\u00a0\u00a0\u00a0'

      if (test=='cold-start') name = name.replace(/ \(.*$/,'') // don't list (sync) and (async) redundantly

      let row = unsupported ? [
                name,
                na,
                na + spacer + mdItalic("not supported")
              ] : [
                `${mdItalic(name)} ${link}`,
                `${mdCode(elapsed(ms/rounds))}`,
                `${mdCode(elapsed(ms))} ${bars.addBar(ms/1000, run.lib, id)}`
              ]
      rows.push(row)
    }

    bars.saveAs(BARS_FILE)
    output.push(mdHeader(id, note))
    output.push(markdownTable(rows))
  }
  return output.join('\n')
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv.length < 3){
    console.log('USAGE: node src/format.js results/<benchmark-dir>/data.json')
    process.exit(1)
  }

  // read a data.json file and update its index.md + bars/*.svg
  let dataPath = process.argv[2],
      data = JSON.parse(readFileSync(dataPath)),
      mdPath = path.dirname(dataPath) + '/index.md'
  BARS_FILE = path.dirname(dataPath) + '/bars.svg'
  SNAPSHOTS_DIR = path.dirname(dataPath) + '/snapshots'

  toTTY(data) // log the summary to console

  let md = toMarkdown(data)
  writeFileSync(mdPath, md)
  console.log('\nFormatted results in:', chalk.bold(mdPath))
}