import chalk from 'chalk'
import path from 'path'
import {markdownTable} from 'markdown-table'
import {readFileSync, writeFileSync, existsSync} from 'fs'
import {fileURLToPath} from 'url'
import {libs, tests} from "./config.js"
import {Canvas} from 'skia-canvas'

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
    Object.entries(info.libs).map(([lib, v]) => `- [${mdCode(lib)}](https://www.npmjs.com/package/${lib}): v${v}`)
  ).concat([
    '> Note: Skia Canvas is tested running in two modes: `serial` and `async`. When running serially, each rendering operation is `await`ed before continuing to the next test iteration. When running asynchronously, all the test iterations are begun at once and are executed in parallel within a `Promise.all` block, making use of the library’s multi-threading.',
  ])
}

export function formatResults({date, info, benchmarks}, outputDir){
  let output = mdFrontmatter(info, date)
  let maxTime = benchmarks.reduce((acc, {ms}) => Math.max(ms || 0, acc), 0)
  let bars = new SvgBars(maxTime)

  for (let [id, {label, rounds, note}] of Object.entries(tests)){
    let runs = benchmarks.filter(r => r.test==id)

    let table = [
      ["Library", "Per Run", "Total Time"]
    ].concat(runs.map(({lib, test, ms, unsupported}) => {
      let {name} = libs[lib],
          ext = (id=='to-svg') ? 'svg' : (id=='to-pdf') ? 'pdf' : 'png',
          image = `${id}_${lib}.${ext}`,
          link = existsSync(`${outputDir}/snapshots/${image}`) ? `[👁️](snapshots/${image})` : '\u2003\u2003',
          na = mdCode('\u00a0—————\u00a0'),
          spacer = '\u00a0\u00a0\u00a0'

      // don't list (sync) and (async) redundantly
      if (test=='cold-start') name = name.replace(/ \(.*$/,'')

      return unsupported ? [
        name,
        na,
        na + spacer + mdItalic("not supported")
      ] : [
        `${mdItalic(name)} ${link}`,
        `${mdCode(elapsed(ms/rounds))}`,
        `${mdCode(elapsed(ms))} ${bars.addBar(ms/1000, lib, id)}`
      ]
    }))

    if (runs.length){
      output.push(`\n### [${label}](/tests/${id}.js) (${rounds} iterations)`)
      if (note) output.push(`> Note: ${note}\n`)
      output.push(markdownTable(table))
    }
  }

  return [output.join('\n'), bars.toString()]
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

export function printResult(name, rounds, {ms, unsupported}, color){
  if (unsupported){
    console.log(' ', name.padEnd(20), ' —————— (unsupported)')
  }else{
    console.log(' ',
      name.padEnd(20),
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