## Canvas Benchmarks · 21 Jul 2025
#### Configuration
- **System**: MacBook Air (13-inch, M3, 2024) / Apple Inc. Mac15,12
- **CPU**: Apple M3 (2.4 GHz, 8 cores)
- **GPU**: Apple M3 / Apple (Built-In, 10 cores)
- **Memory**: 24.00 GiB total (724.55 MiB free)
- **OS**: macOS 15.5 (Sequoia)
- **Node**: 24.3.0

#### Libraries Tested
- [`canvas`](https://www.npmjs.com/package/canvas): v3.1.2
- [`@napi-rs/canvas`](https://www.npmjs.com/package/@napi-rs/canvas): v0.1.74
- [`canvaskit-wasm`](https://www.npmjs.com/package/canvaskit-wasm): v0.40.0
- [`skia-canvas`](https://www.npmjs.com/package/skia-canvas): v2.0.3-rc12
> Note: Skia Canvas is tested running in two modes: `serial` and `async`. When running serially, each rendering operation is `await`ed before continuing to the next test iteration. When running asynchronously, all the test iterations are begun at once and are executed in parallel within a `Promise.all` block, making use of the library’s multi-threading.

### [Startup latency](/tests/cold-start.js) (50 iterations)
| Library              | Per Run   | Total Time                                                                  |
| -------------------- | --------- | --------------------------------------------------------------------------- |
| *canvaskit-wasm*     | `  24 ms` | ` 1.21 s` <img src="bars.svg#cold-start_wasm" width="260" height="16">      |
| *canvas*             | `  98 ms` | ` 4.88 s` <img src="bars.svg#cold-start_canvas" width="260" height="16">    |
| *@napi-rs/canvas*    | `  73 ms` | ` 3.63 s` <img src="bars.svg#cold-start_napi" width="260" height="16">      |
| *skia-canvas*        | `  <1 ms` | `  16 ms` <img src="bars.svg#cold-start_skia-sync" width="260" height="16"> |

### [Simple house](/tests/house.js) (200 iterations)
| Library                                                     | Per Run   | Total Time                                                              |
| ----------------------------------------------------------- | --------- | ----------------------------------------------------------------------- |
| *canvaskit-wasm* [👁️](snapshots/house_wasm.png)            | `  22 ms` | ` 4.45 s` <img src="bars.svg#house_wasm" width="260" height="16">       |
| *canvas* [👁️](snapshots/house_canvas.png)                  | `  16 ms` | ` 3.24 s` <img src="bars.svg#house_canvas" width="260" height="16">     |
| *@napi-rs/canvas* [👁️](snapshots/house_napi.png)           | `  14 ms` | ` 2.83 s` <img src="bars.svg#house_napi" width="260" height="16">       |
| *skia-canvas (serial)* [👁️](snapshots/house_skia-sync.png) | `  16 ms` | ` 3.17 s` <img src="bars.svg#house_skia-sync" width="260" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/house_skia-async.png) | `   3 ms` | ` 613 ms` <img src="bars.svg#house_skia-async" width="260" height="16"> |

### [Complex shapes](/tests/path2d.js) (200 iterations)
> Note: `canvaskit-wasm` renders the shapes, but positions them incorrectly

| Library                                                      | Per Run   | Total Time                                                               |
| ------------------------------------------------------------ | --------- | ------------------------------------------------------------------------ |
| *canvaskit-wasm* [👁️](snapshots/path2d_wasm.png)            | `  38 ms` | ` 7.65 s` <img src="bars.svg#path2d_wasm" width="260" height="16">       |
| *canvas* [👁️](snapshots/path2d_canvas.png)                  | `  74 ms` | `14.82 s` <img src="bars.svg#path2d_canvas" width="260" height="16">     |
| *@napi-rs/canvas* [👁️](snapshots/path2d_napi.png)           | `  48 ms` | ` 9.66 s` <img src="bars.svg#path2d_napi" width="260" height="16">       |
| *skia-canvas (serial)* [👁️](snapshots/path2d_skia-sync.png) | `  38 ms` | ` 7.54 s` <img src="bars.svg#path2d_skia-sync" width="260" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/path2d_skia-async.png) | `   7 ms` | ` 1.38 s` <img src="bars.svg#path2d_skia-async" width="260" height="16"> |

### [Bezier curves](/tests/beziers.js) (20 iterations)
| Library                                                       | Per Run   | Total Time                                                                |
| ------------------------------------------------------------- | --------- | ------------------------------------------------------------------------- |
| *canvaskit-wasm* [👁️](snapshots/beziers_wasm.png)            | ` 790 ms` | `15.80 s` <img src="bars.svg#beziers_wasm" width="260" height="16">       |
| *canvas* [👁️](snapshots/beziers_canvas.png)                  | ` 464 ms` | ` 9.29 s` <img src="bars.svg#beziers_canvas" width="260" height="16">     |
| *@napi-rs/canvas* [👁️](snapshots/beziers_napi.png)           | ` 224 ms` | ` 4.48 s` <img src="bars.svg#beziers_napi" width="260" height="16">       |
| *skia-canvas (serial)* [👁️](snapshots/beziers_skia-sync.png) | ` 131 ms` | ` 2.63 s` <img src="bars.svg#beziers_skia-sync" width="260" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/beziers_skia-async.png) | `  27 ms` | ` 536 ms` <img src="bars.svg#beziers_skia-async" width="260" height="16"> |

### [SVG to PNG](/tests/from-svg.js) (100 iterations)
| Library                                                        | Per Run   | Total Time                                                                 |
| -------------------------------------------------------------- | --------- | -------------------------------------------------------------------------- |
| canvaskit-wasm                                                 | ` ————— ` | ` ————— `   *not supported*                                                |
| *canvas* [👁️](snapshots/from-svg_canvas.png)                  | ` 121 ms` | `12.12 s` <img src="bars.svg#from-svg_canvas" width="260" height="16">     |
| *@napi-rs/canvas* [👁️](snapshots/from-svg_napi.png)           | `  97 ms` | ` 9.70 s` <img src="bars.svg#from-svg_napi" width="260" height="16">       |
| *skia-canvas (serial)* [👁️](snapshots/from-svg_skia-sync.png) | `  59 ms` | ` 5.88 s` <img src="bars.svg#from-svg_skia-sync" width="260" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/from-svg_skia-async.png) | `  11 ms` | ` 1.07 s` <img src="bars.svg#from-svg_skia-async" width="260" height="16"> |

### [SVG to SVG](/tests/to-svg.js) (200 iterations)
> Note: `canvas` & `napi-rs` convert the input SVG to a bitmap rather than exporting it as a vector

| Library                                                      | Per Run   | Total Time                                                               |
| ------------------------------------------------------------ | --------- | ------------------------------------------------------------------------ |
| canvaskit-wasm                                               | ` ————— ` | ` ————— `   *not supported*                                              |
| *canvas* [👁️](snapshots/to-svg_canvas.svg)                  | `  33 ms` | ` 6.60 s` <img src="bars.svg#to-svg_canvas" width="260" height="16">     |
| *@napi-rs/canvas* [👁️](snapshots/to-svg_napi.svg)           | `  35 ms` | ` 6.96 s` <img src="bars.svg#to-svg_napi" width="260" height="16">       |
| *skia-canvas (serial)* [👁️](snapshots/to-svg_skia-sync.svg) | `   4 ms` | ` 718 ms` <img src="bars.svg#to-svg_skia-sync" width="260" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/to-svg_skia-async.svg) | `   3 ms` | ` 629 ms` <img src="bars.svg#to-svg_skia-async" width="260" height="16"> |

### [SVG to PDF](/tests/to-pdf.js) (200 iterations)
> Note: `canvas` converts the input SVG to a bitmap rather than exporting it as a vector

| Library                                                      | Per Run   | Total Time                                                               |
| ------------------------------------------------------------ | --------- | ------------------------------------------------------------------------ |
| canvaskit-wasm                                               | ` ————— ` | ` ————— `   *not supported*                                              |
| *canvas* [👁️](snapshots/to-pdf_canvas.pdf)                  | `  27 ms` | ` 5.37 s` <img src="bars.svg#to-pdf_canvas" width="260" height="16">     |
| @napi-rs/canvas                                              | ` ————— ` | ` ————— `   *not supported*                                              |
| *skia-canvas (serial)* [👁️](snapshots/to-pdf_skia-sync.pdf) | `   5 ms` | ` 961 ms` <img src="bars.svg#to-pdf_skia-sync" width="260" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/to-pdf_skia-async.pdf) | `   2 ms` | ` 313 ms` <img src="bars.svg#to-pdf_skia-async" width="260" height="16"> |

### [Scale/rotate images](/tests/image-blit.js) (50 iterations)
| Library                                                          | Per Run   | Total Time                                                                   |
| ---------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------- |
| *canvaskit-wasm* [👁️](snapshots/image-blit_wasm.png)            | ` 288 ms` | `14.41 s` <img src="bars.svg#image-blit_wasm" width="260" height="16">       |
| *canvas* [👁️](snapshots/image-blit_canvas.png)                  | ` 282 ms` | `14.12 s` <img src="bars.svg#image-blit_canvas" width="260" height="16">     |
| *@napi-rs/canvas* [👁️](snapshots/image-blit_napi.png)           | ` 115 ms` | ` 5.74 s` <img src="bars.svg#image-blit_napi" width="260" height="16">       |
| *skia-canvas (serial)* [👁️](snapshots/image-blit_skia-sync.png) | `  99 ms` | ` 4.97 s` <img src="bars.svg#image-blit_skia-sync" width="260" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/image-blit_skia-async.png) | `  19 ms` | ` 952 ms` <img src="bars.svg#image-blit_skia-async" width="260" height="16"> |

### [Get/put ImageData](/tests/image-rw.js) (150 iterations)
| Library                                                        | Per Run   | Total Time                                                                 |
| -------------------------------------------------------------- | --------- | -------------------------------------------------------------------------- |
| canvaskit-wasm                                                 | ` ————— ` | ` ————— `   *not supported*                                                |
| *canvas* [👁️](snapshots/image-rw_canvas.png)                  | `  67 ms` | `10.11 s` <img src="bars.svg#image-rw_canvas" width="260" height="16">     |
| *@napi-rs/canvas* [👁️](snapshots/image-rw_napi.png)           | `  42 ms` | ` 6.28 s` <img src="bars.svg#image-rw_napi" width="260" height="16">       |
| *skia-canvas (serial)* [👁️](snapshots/image-rw_skia-sync.png) | `  66 ms` | ` 9.92 s` <img src="bars.svg#image-rw_skia-sync" width="260" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/image-rw_skia-async.png) | `  57 ms` | ` 8.52 s` <img src="bars.svg#image-rw_skia-async" width="260" height="16"> |

### [Gradients](/tests/gradients.js) (150 iterations)
| Library                                                         | Per Run   | Total Time                                                                  |
| --------------------------------------------------------------- | --------- | --------------------------------------------------------------------------- |
| *canvaskit-wasm* [👁️](snapshots/gradients_wasm.png)            | `  98 ms` | `14.69 s` <img src="bars.svg#gradients_wasm" width="260" height="16">       |
| *canvas* [👁️](snapshots/gradients_canvas.png)                  | `  52 ms` | ` 7.78 s` <img src="bars.svg#gradients_canvas" width="260" height="16">     |
| *@napi-rs/canvas* [👁️](snapshots/gradients_napi.png)           | `  46 ms` | ` 6.91 s` <img src="bars.svg#gradients_napi" width="260" height="16">       |
| *skia-canvas (serial)* [👁️](snapshots/gradients_skia-sync.png) | `  50 ms` | ` 7.53 s` <img src="bars.svg#gradients_skia-sync" width="260" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/gradients_skia-async.png) | `   9 ms` | ` 1.34 s` <img src="bars.svg#gradients_skia-async" width="260" height="16"> |

### [Basic text](/tests/text.js) (200 iterations)
| Library                                                    | Per Run   | Total Time                                                             |
| ---------------------------------------------------------- | --------- | ---------------------------------------------------------------------- |
| *canvaskit-wasm* [👁️](snapshots/text_wasm.png)            | `  24 ms` | ` 4.74 s` <img src="bars.svg#text_wasm" width="260" height="16">       |
| *canvas* [👁️](snapshots/text_canvas.png)                  | `  24 ms` | ` 4.86 s` <img src="bars.svg#text_canvas" width="260" height="16">     |
| *@napi-rs/canvas* [👁️](snapshots/text_napi.png)           | `  19 ms` | ` 3.83 s` <img src="bars.svg#text_napi" width="260" height="16">       |
| *skia-canvas (serial)* [👁️](snapshots/text_skia-sync.png) | `  21 ms` | ` 4.24 s` <img src="bars.svg#text_skia-sync" width="260" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/text_skia-async.png) | `   4 ms` | ` 795 ms` <img src="bars.svg#text_skia-async" width="260" height="16"> |