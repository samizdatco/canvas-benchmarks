## Canvas Benchmarks · 26 Sept 2025
#### Configuration
- **System**: MacBook Air (13-inch, M3, 2024) / Apple Inc. Mac15,12
- **CPU**: Apple M3 (2.4 GHz, 8 cores)
- **GPU**: Apple M3 / Apple (Built-In, 10 cores)
- **Memory**: 24.00 GiB total (347.58 MiB free)
- **OS**: macOS 15.6 (Sequoia)
- **Node**: 24.6.0

#### Libraries Tested
- [`canvas`](https://www.npmjs.com/package/canvas): v3.2.0
- [`@napi-rs/canvas`](https://www.npmjs.com/package/@napi-rs/canvas): v0.1.80
- [`canvaskit-wasm`](https://www.npmjs.com/package/canvaskit-wasm): v0.40.0
- [`skia-canvas`](https://www.npmjs.com/package/skia-canvas): v3.0.8
> Note: Skia Canvas is tested running in two modes: `serial` and `async`. When running serially, each rendering operation is `await`ed before continuing to the next test iteration. When running asynchronously, all the test iterations are begun at once and are executed in parallel within a `Promise.all` block, making use of the library’s multi-threading.

### [Startup latency](/tests/cold-start.js)
| Library              | Per Run   | Total Time (100 iterations)                   |
| -------------------- | --------- | --------------------------------------------- |
| *canvaskit-wasm*     | `  25 ms` | ` 2.47 s` ![ ](bars.svg#cold-start_wasm)      |
| *canvas*             | `  88 ms` | ` 8.77 s` ![ ](bars.svg#cold-start_canvas)    |
| *@napi-rs/canvas*    | `  69 ms` | ` 6.87 s` ![ ](bars.svg#cold-start_napi)      |
| *skia-canvas*        | `  <1 ms` | `  33 ms` ![ ](bars.svg#cold-start_skia-sync) |

### [Simple house](/tests/house.js)
| Library                                                     | Per Run   | Total Time (200 iterations)               |
| ----------------------------------------------------------- | --------- | ----------------------------------------- |
| *canvaskit-wasm* [👁️](snapshots/house_wasm.png)            | `  22 ms` | ` 4.48 s` ![ ](bars.svg#house_wasm)       |
| *canvas* [👁️](snapshots/house_canvas.png)                  | `  16 ms` | ` 3.28 s` ![ ](bars.svg#house_canvas)     |
| *@napi-rs/canvas* [👁️](snapshots/house_napi.png)           | `  14 ms` | ` 2.86 s` ![ ](bars.svg#house_napi)       |
| *skia-canvas (serial)* [👁️](snapshots/house_skia-sync.png) | `  16 ms` | ` 3.23 s` ![ ](bars.svg#house_skia-sync)  |
| *skia-canvas (async)* [👁️](snapshots/house_skia-async.png) | `   3 ms` | ` 629 ms` ![ ](bars.svg#house_skia-async) |

### [Complex shapes](/tests/path2d.js)
> Note: `canvaskit-wasm` renders the shapes, but positions them incorrectly

| Library                                                      | Per Run   | Total Time (200 iterations)                |
| ------------------------------------------------------------ | --------- | ------------------------------------------ |
| *canvaskit-wasm* [👁️](snapshots/path2d_wasm.png)            | `  39 ms` | ` 7.73 s` ![ ](bars.svg#path2d_wasm)       |
| *canvas* [👁️](snapshots/path2d_canvas.png)                  | `  75 ms` | `15.04 s` ![ ](bars.svg#path2d_canvas)     |
| *@napi-rs/canvas* [👁️](snapshots/path2d_napi.png)           | `  49 ms` | ` 9.72 s` ![ ](bars.svg#path2d_napi)       |
| *skia-canvas (serial)* [👁️](snapshots/path2d_skia-sync.png) | `  38 ms` | ` 7.57 s` ![ ](bars.svg#path2d_skia-sync)  |
| *skia-canvas (async)* [👁️](snapshots/path2d_skia-async.png) | `   7 ms` | ` 1.40 s` ![ ](bars.svg#path2d_skia-async) |

### [Bezier curves](/tests/beziers.js)
| Library                                                       | Per Run   | Total Time (20 iterations)                  |
| ------------------------------------------------------------- | --------- | ------------------------------------------- |
| *canvaskit-wasm* [👁️](snapshots/beziers_wasm.png)            | ` 790 ms` | `15.81 s` ![ ](bars.svg#beziers_wasm)       |
| *canvas* [👁️](snapshots/beziers_canvas.png)                  | ` 486 ms` | ` 9.72 s` ![ ](bars.svg#beziers_canvas)     |
| *@napi-rs/canvas* [👁️](snapshots/beziers_napi.png)           | ` 230 ms` | ` 4.60 s` ![ ](bars.svg#beziers_napi)       |
| *skia-canvas (serial)* [👁️](snapshots/beziers_skia-sync.png) | ` 137 ms` | ` 2.74 s` ![ ](bars.svg#beziers_skia-sync)  |
| *skia-canvas (async)* [👁️](snapshots/beziers_skia-async.png) | `  28 ms` | ` 558 ms` ![ ](bars.svg#beziers_skia-async) |

### [SVG to PNG](/tests/from-svg.js)
| Library                                                        | Per Run   | Total Time (100 iterations)                  |
| -------------------------------------------------------------- | --------- | -------------------------------------------- |
| canvaskit-wasm                                                 | ` ————— ` | ` ————— `   *not supported*                  |
| *canvas* [👁️](snapshots/from-svg_canvas.png)                  | ` 122 ms` | `12.16 s` ![ ](bars.svg#from-svg_canvas)     |
| *@napi-rs/canvas* [👁️](snapshots/from-svg_napi.png)           | `  84 ms` | ` 8.42 s` ![ ](bars.svg#from-svg_napi)       |
| *skia-canvas (serial)* [👁️](snapshots/from-svg_skia-sync.png) | `  58 ms` | ` 5.83 s` ![ ](bars.svg#from-svg_skia-sync)  |
| *skia-canvas (async)* [👁️](snapshots/from-svg_skia-async.png) | `  11 ms` | ` 1.08 s` ![ ](bars.svg#from-svg_skia-async) |

### [SVG to SVG](/tests/to-svg.js)
> Note: `canvas` & `napi-rs` convert the input SVG to a bitmap rather than exporting it as a vector

| Library                                                      | Per Run   | Total Time (200 iterations)                |
| ------------------------------------------------------------ | --------- | ------------------------------------------ |
| canvaskit-wasm                                               | ` ————— ` | ` ————— `   *not supported*                |
| *canvas* [👁️](snapshots/to-svg_canvas.svg)                  | `  33 ms` | ` 6.55 s` ![ ](bars.svg#to-svg_canvas)     |
| *@napi-rs/canvas* [👁️](snapshots/to-svg_napi.svg)           | `  35 ms` | ` 6.97 s` ![ ](bars.svg#to-svg_napi)       |
| *skia-canvas (serial)* [👁️](snapshots/to-svg_skia-sync.svg) | `   4 ms` | ` 711 ms` ![ ](bars.svg#to-svg_skia-sync)  |
| *skia-canvas (async)* [👁️](snapshots/to-svg_skia-async.svg) | `   3 ms` | ` 634 ms` ![ ](bars.svg#to-svg_skia-async) |

### [SVG to PDF](/tests/to-pdf.js)
> Note: `canvas` converts the input SVG to a bitmap rather than exporting it as a vector

| Library                                                      | Per Run   | Total Time (200 iterations)                |
| ------------------------------------------------------------ | --------- | ------------------------------------------ |
| canvaskit-wasm                                               | ` ————— ` | ` ————— `   *not supported*                |
| *canvas* [👁️](snapshots/to-pdf_canvas.pdf)                  | `  27 ms` | ` 5.31 s` ![ ](bars.svg#to-pdf_canvas)     |
| @napi-rs/canvas                                              | ` ————— ` | ` ————— `   *not supported*                |
| *skia-canvas (serial)* [👁️](snapshots/to-pdf_skia-sync.pdf) | `   5 ms` | ` 950 ms` ![ ](bars.svg#to-pdf_skia-sync)  |
| *skia-canvas (async)* [👁️](snapshots/to-pdf_skia-async.pdf) | `   2 ms` | ` 333 ms` ![ ](bars.svg#to-pdf_skia-async) |

### [Scale/rotate images](/tests/image-blit.js)
| Library                                                          | Per Run   | Total Time (50 iterations)                     |
| ---------------------------------------------------------------- | --------- | ---------------------------------------------- |
| *canvaskit-wasm* [👁️](snapshots/image-blit_wasm.png)            | ` 274 ms` | `13.72 s` ![ ](bars.svg#image-blit_wasm)       |
| *canvas* [👁️](snapshots/image-blit_canvas.png)                  | ` 283 ms` | `14.13 s` ![ ](bars.svg#image-blit_canvas)     |
| *@napi-rs/canvas* [👁️](snapshots/image-blit_napi.png)           | ` 112 ms` | ` 5.60 s` ![ ](bars.svg#image-blit_napi)       |
| *skia-canvas (serial)* [👁️](snapshots/image-blit_skia-sync.png) | ` 100 ms` | ` 5.00 s` ![ ](bars.svg#image-blit_skia-sync)  |
| *skia-canvas (async)* [👁️](snapshots/image-blit_skia-async.png) | `  19 ms` | ` 935 ms` ![ ](bars.svg#image-blit_skia-async) |

### [Get/put ImageData](/tests/image-rw.js)
| Library                                                        | Per Run   | Total Time (150 iterations)                  |
| -------------------------------------------------------------- | --------- | -------------------------------------------- |
| canvaskit-wasm                                                 | ` ————— ` | ` ————— `   *not supported*                  |
| *canvas* [👁️](snapshots/image-rw_canvas.png)                  | `  67 ms` | `10.02 s` ![ ](bars.svg#image-rw_canvas)     |
| *@napi-rs/canvas* [👁️](snapshots/image-rw_napi.png)           | `  41 ms` | ` 6.14 s` ![ ](bars.svg#image-rw_napi)       |
| *skia-canvas (serial)* [👁️](snapshots/image-rw_skia-sync.png) | `  67 ms` | `10.05 s` ![ ](bars.svg#image-rw_skia-sync)  |
| *skia-canvas (async)* [👁️](snapshots/image-rw_skia-async.png) | `  57 ms` | ` 8.60 s` ![ ](bars.svg#image-rw_skia-async) |

### [Gradients](/tests/gradients.js)
| Library                                                         | Per Run   | Total Time (150 iterations)                   |
| --------------------------------------------------------------- | --------- | --------------------------------------------- |
| *canvaskit-wasm* [👁️](snapshots/gradients_wasm.png)            | `  97 ms` | `14.53 s` ![ ](bars.svg#gradients_wasm)       |
| *canvas* [👁️](snapshots/gradients_canvas.png)                  | `  52 ms` | ` 7.76 s` ![ ](bars.svg#gradients_canvas)     |
| *@napi-rs/canvas* [👁️](snapshots/gradients_napi.png)           | `  46 ms` | ` 6.95 s` ![ ](bars.svg#gradients_napi)       |
| *skia-canvas (serial)* [👁️](snapshots/gradients_skia-sync.png) | `  50 ms` | ` 7.51 s` ![ ](bars.svg#gradients_skia-sync)  |
| *skia-canvas (async)* [👁️](snapshots/gradients_skia-async.png) | `   9 ms` | ` 1.33 s` ![ ](bars.svg#gradients_skia-async) |

### [Basic text](/tests/text.js)
| Library                                                    | Per Run   | Total Time (200 iterations)              |
| ---------------------------------------------------------- | --------- | ---------------------------------------- |
| *canvaskit-wasm* [👁️](snapshots/text_wasm.png)            | `  24 ms` | ` 4.75 s` ![ ](bars.svg#text_wasm)       |
| *canvas* [👁️](snapshots/text_canvas.png)                  | `  24 ms` | ` 4.88 s` ![ ](bars.svg#text_canvas)     |
| *@napi-rs/canvas* [👁️](snapshots/text_napi.png)           | `  19 ms` | ` 3.83 s` ![ ](bars.svg#text_napi)       |
| *skia-canvas (serial)* [👁️](snapshots/text_skia-sync.png) | `  21 ms` | ` 4.26 s` ![ ](bars.svg#text_skia-sync)  |
| *skia-canvas (async)* [👁️](snapshots/text_skia-async.png) | `   4 ms` | ` 819 ms` ![ ](bars.svg#text_skia-async) |