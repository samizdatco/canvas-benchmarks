// Note that this test has been inlined into run.js as `testLibraryInit` so it can have each iteration
// run as a newly launched Node process (since otherwise the import will be cached)
import {initialize} from '../config.js'

export default async function importAndCreateCanvas(libID){
  // test time-to-usable-canvas latency
  let lib = await initialize(libID),
      canvas = lib.createCanvas(512, 512),
      ctx = canvas.getContext("2d")
  return lib
}
