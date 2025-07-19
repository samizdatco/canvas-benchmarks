import chalk from 'chalk'
import {markdownTable} from 'markdown-table'
import {readFileSync, existsSync} from 'fs'
import {fileURLToPath} from 'url'
import {libs, tests} from "./config.js"
import {Canvas} from 'skia-canvas'

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
async function toTTY(results){
  for (let [id, {rounds}] of Object.entries(tests)){
    printHeader(id)
    let runs = results.benchmarks.filter(r => r.test==id)
    for (const run of runs){
      let {name, color} = libs[run.lib]
      printResults(name, rounds, run, color)
    }
  }
}

function svgBar(n, lib, test){
  let width = 250,
      height = 16,
      max = 15,
      pad = 10,
      path = `img/bars/${test}_${lib}.svg`

  let canvas = new Canvas(width+pad, height),
      ctx = canvas.getContext("2d")

  ctx.beginPath()
  for (let mark=0; mark<n; mark++){
    let x = pad + Math.floor(mark * width/max)
    let w = pad + Math.floor((mark+1) * width/max) - x - .5
    ctx.rect(x, 0, w, height)
  }
  ctx.clip()
  ctx.fillStyle = palette[libs[lib].color]
  ctx.fillRect(pad, 4, n/max * width, height)

  canvas.saveAsSync(path)
  return `<img src="${path}" width="${width}" height="${height}">`
}

const mdCode = s => `\`${s}\``
const mdItalic = s => `*${s}*`
const mdBold = s => `**${s}**`

export function mdFrontmatter(info, timestamp){
  return [
    `## Canvas Benchmarks (${new Date(timestamp).toDateString()})`,
    `\n<details><summary>\n`,
    `### System Details`,
    `\n</summary>\n`,
    `#### Hardware & Software`,
    `- **System**: ${info.sys}`,
    `- **CPU**: ${info.cpu}`,
    `- **Memory**: ${info.mem}`,
    `- **OS**: ${info.os}`,
    `- **Node**: ${info.node}`,
    ``,
    `#### Library Versions`
  ].concat(
    Object.entries(info.libs).map(([lib, v]) => `- ${mdCode(lib)}: v${v}`)
  ).concat([
    `\n</details>`
  ])
}

export function mdHeader(id, note){
  let {label, rounds} = tests[id],
      nb = (note) ? `\n> Note: ${note}\n` : ''
  return `\n### [${label}](/tests/${id}.js) (${rounds} iterations)${nb}`
}

export function toMarkdown({timestamp, info, benchmarks}){
  let output = mdFrontmatter(info, timestamp)

  for (let [id, {rounds, note}] of Object.entries(tests)){

    let rows = [
      ["Library", "Per Run", "Total Time"]
    ]
    let runs = benchmarks.filter(r => r.test==id)
    for (const run of runs){
      let {name} = libs[run.lib],
          {test, ms, unsupported} = run,
          ext = (id=='to-svg') ? 'svg' : (id=='to-pdf') ? 'pdf' : 'png',
          path = `img/snapshots/${id}_${run.lib}.${ext}`,
          link = existsSync(path) ? `[👁️](/${path})` : '\u2003\u2003',
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
                `${mdCode(elapsed(ms))} ${svgBar(ms/1000, run.lib, id)}`
              ]
      rows.push(row)
    }

    output.push(mdHeader(id, note))
    output.push(markdownTable(rows))
  }
  return output.join('\n')
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  let results = JSON.parse(readFileSync('results.json'))
  // toTTY(results)
  console.log(toMarkdown(results))
}