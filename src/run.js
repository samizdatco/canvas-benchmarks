import chalk from 'chalk'
import {writeFileSync} from 'fs'
import {fileURLToPath} from "url";
import {performance} from 'perf_hooks'
import {promisify} from 'util'
import child_process from 'child_process'

import {printHeader, printResults, toMarkdown} from './format.js'
import {tests, libs, initialize, sysInfo, mkdir, OUTPUT_DIR} from './config.js'

const exec = promisify(child_process.exec);
const WARMUP = 20 // number of times to run a test before starting the timer
const SETTLE = 4 // number of seconds to wait in between libraries

const sleep = (sec) => new Promise(res => setTimeout(res, 1000*sec))
const toJSON = obj => JSON.stringify(obj, null, "  ")

async function testLibraryInit(libID){
  // test time-to-usable-canvas latency
  let initStart = performance.now(),
      lib = await initialize(libID),
      canvas = lib.createCanvas(512, 512),
      ctx = canvas.getContext("2d")

  let ms = performance.now() - initStart
  console.log(toJSON({ lib:lib.name, ms }))
}

async function testLibrary(libID, testID){
  let lib = await initialize(libID),
      {test, rounds} = tests[testID] || {}

  if (!test || !lib){
    console.log("Usage: run.js test <library-name> <test-name>")
    console.log(`\nAvailable tests:\n${Object.keys(tests).map(name => `  - ${name}`).join("\n")}`)
    console.log(`\nAvailable libraries:\n${Object.keys(libs).map(lib => `  - ${lib}`).join("\n")}`)
    process.exit(1)
  }

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

  // save an image with the test's output
  let snapshot = await test(lib),
      ext = (testID=='to-svg') ? 'svg' : (testID=='to-pdf') ? 'pdf' : 'png',
      dataPrefix = 'data:image/png;base64,'
  if (typeof snapshot=='string' && snapshot.startsWith(dataPrefix)){
    snapshot = Buffer.from(snapshot.slice(dataPrefix.length), "base64")
  }
  if (snapshot instanceof Buffer){
    mkdir(OUTPUT_DIR+'/snapshots')
    writeFileSync(`${OUTPUT_DIR}/snapshots/${testID}_${libID}.${ext}`, snapshot)
  }

  console.log(toJSON({ test:testID, lib:lib.name, rounds, ms }))
}

async function runTests(testIDs){
  const results = []
  for (let test of testIDs){
    let {rounds, omit=[]} = tests[test]

    printHeader(test)
    for (let [lib, {name, color}] of Object.entries(libs)){
      if (omit.includes(lib)){
        // skip flagged tests
        printResults(name, 0, {unsupported:true})
        results.push({lib, test, unsupported:true})
      }else if (test=='cold-start'){
        // cold-start happens across multiple process invocations so handle it separately
        let startUp = async lib => exec(`node ${import.meta.filename} test ${lib} ${test}`)
        if (lib=='skia-sync') name = 'skia-canvas'
        else if (lib=='skia-async') continue

        // run a few times without timing first
        for (let i=0; i<WARMUP; i++) await startUp(lib)

        let ms = 0
        for (let i=0; i<rounds; i++){
          let result = JSON.parse((await startUp(lib)).stdout)
          ms += result.ms
        }
        printResults(name, rounds, {ms}, color)
        results.push({lib, test:'cold-start', rounds, ms})
      }else{
        // wait a moment after previous test
        await sleep(SETTLE)

        // run test iterations in a new node process
        let result = JSON.parse((await exec(`node ${import.meta.filename} test ${lib} ${test}`)).stdout)
        printResults(name, rounds, result, color)
        results.push({lib, ...result})
      }
    }
  }

  return results
}

async function main(){
  let [_node, _script, cmd, libID, testID] = process.argv
  if (cmd=="test" && testID=="cold-start") testLibraryInit(libID)
  else if (cmd=="test") testLibrary(libID, testID)
  else if (cmd in tests) await runTests([cmd])
  else{
    let benchmarks = await runTests(Object.keys(tests)),
        info = await sysInfo(),
        timestamp = new Date().toISOString(),
        results = {timestamp, info, benchmarks}

    mkdir(OUTPUT_DIR)
    writeFileSync(`${OUTPUT_DIR}/data.json`, toJSON(results))
    writeFileSync(`${OUTPUT_DIR}/index.md`, toMarkdown(results))
    console.log('\nWrote results to:', chalk.bold(OUTPUT_DIR))
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}
