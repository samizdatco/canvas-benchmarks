import chalk from 'chalk'
import {writeFileSync, mkdirSync} from 'fs'
import {fileURLToPath} from "url";
import {performance} from 'perf_hooks'
import {promisify} from 'util'
import child_process from 'child_process'

import {printHeader, printResult, formatResults} from './format.js'
import {tests, libs, initialize, sysInfo} from './config.js'

const exec = promisify(child_process.exec);
const WARMUP = 20 // number of times to run a test before starting the timer
const SETTLE = 4 // number of seconds to wait in between libraries

const sleep = (sec) => new Promise(res => setTimeout(res, 1000*sec))
const toJSON = obj => JSON.stringify(obj, null, "  ")

export function mkdir(pth){
  try{ mkdirSync(pth, {recursive:true}) }
  catch(e){}
}

async function testLibrary(libID, testID, outputDir=''){
  if (testID=="cold-start"){
    // include import process when testing time-to-usable-canvas latency
    let initStart = performance.now(),
        lib = await initialize(libID),
        canvas = lib.createCanvas(512, 512),
        ctx = canvas.getContext("2d"),
        style = ctx.fillStyle

    let ms = performance.now() - initStart
    console.log(toJSON({ lib:lib.name, ms }))
  }else{
    // otherwise, import the lib before starting timer
    let lib = await initialize(libID),
        {test, rounds} = tests[testID] || {}

    // run the test a few times without timing first
    for (let i=0; i<WARMUP; i++) await test(lib)

    // run either serially or in a Promise.all pool
    let execStart = performance.now()
    if (lib.isAsync){
      let tasks = []
      for (let i=0; i<rounds; i++) tasks.push( test(lib) )
      await Promise.all(tasks)
    }else{
      for (let i=0; i<rounds; i++){ await test(lib) }
    }
    let ms = performance.now() - execStart

    if (outputDir){
      // save an image with the test's output
      let ext = (testID=='to-svg') ? 'svg' : (testID=='to-pdf') ? 'pdf' : 'png',
          snapshotsDir = `${outputDir}/snapshots`,
          filename = `/${testID}_${libID}.${ext}`,
          dataPrefix = 'data:image/png;base64,',
          snapshot = await test(lib)

      if (typeof snapshot=='string' && snapshot.startsWith(dataPrefix)){
        snapshot = Buffer.from(snapshot.slice(dataPrefix.length), "base64")
      }
      if (snapshot instanceof Buffer){
        mkdir(snapshotsDir)
        writeFileSync(`${snapshotsDir}/${filename}`, snapshot)
      }
    }

    console.log(toJSON({ test:testID, lib:lib.name, rounds, ms }))
  }
}

async function runTests(testIDs, outputDir=''){
  const results = []
  for (let test of testIDs){
    let {rounds, omit=[]} = tests[test]

    printHeader(test)
    for (let [lib, {name, color}] of Object.entries(libs)){
      if (omit.includes(lib)){
        // skip flagged tests
        printResult(name, 0, {unsupported:true})
        results.push({lib, test, unsupported:true})
      }else if (test=='cold-start'){
        // cold-start happens across multiple process invocations so handle it separately
        let startUp = async lib => exec(`node ${import.meta.filename} ${test} ${lib}`)
        if (lib=='skia-sync') name = 'skia-canvas'
        else if (lib=='skia-async') continue

        // run a few times without timing first
        for (let i=0; i<WARMUP; i++) await startUp(lib)

        let ms = 0
        for (let i=0; i<rounds; i++){
          let result = JSON.parse((await startUp(lib)).stdout)
          ms += result.ms
        }
        printResult(name, rounds, {ms}, color)
        results.push({lib, test:'cold-start', rounds, ms})
      }else{
        // wait a moment after previous test
        await sleep(SETTLE)

        // run test iterations in a new node process
        let result = JSON.parse((await exec(`node ${import.meta.filename} ${test} ${lib} ${outputDir}`)).stdout)
        printResult(name, rounds, result, color)
        results.push({lib, ...result})
      }
    }
  }

  return results
}

async function runTestsAndReport(){
  let info = await sysInfo(),
      date = new Date().toLocaleDateString('en-CA'),
      outputDir = `results/${process.platform}-${process.arch}/${date}`

  let benchmarks = await runTests(Object.keys(tests), outputDir),
      results = {date, info, benchmarks},
      [md, svg] = formatResults(results, outputDir)

  mkdir(outputDir)
  writeFileSync(`${outputDir}/data.json`, toJSON(results))
  writeFileSync(`${outputDir}/index.md`, md)
  writeFileSync(`${outputDir}/bars.svg`, svg)
  console.log('\nWrote results to:', chalk.bold(outputDir))
}

async function main(){
  let [_node, _script, testID, libID, outputDir] = process.argv,
      test = tests[testID],
      lib = libs[libID]

  if ((testID && !test) || (libID && !lib) ){
    console.log("Usage: run.js <test-name> <library-name>")
    console.log(`\nAvailable tests:\n${Object.keys(tests).map(name => `  - ${name}`).join("\n")}`)
    console.log(`\nAvailable libraries:\n${Object.keys(libs).map(lib => `  - ${lib}`).join("\n")}`)
    process.exit(1)
  }

  if (lib) await testLibrary(libID, testID, outputDir) // log json with single lib+test result
  else if (test) await runTests([testID]) // run single test vs all libs (without updating snapshots)
  else await runTestsAndReport() // run all tests vs all libs and save output in ./results
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}
