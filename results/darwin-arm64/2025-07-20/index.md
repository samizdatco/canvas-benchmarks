## Canvas Benchmarks · 20 Jul 2025
#### Configuration
- **System**: Mac Studio (2025) / Apple Inc. Mac16,9
- **CPU**: Apple M4 Max (2.4 GHz, 16 cores)
- **GPU**: Apple M4 Max / Apple (Built-In, 40 cores)
- **Memory**: 64.00 GiB total (12.86 GiB free)
- **OS**: macOS 15.4.1 (Sequoia)
- **Node**: 20.18.0

#### Libraries Tested
- [`canvas`](https://www.npmjs.com/package/canvas): v3.1.2
- [`@napi-rs/canvas`](https://www.npmjs.com/package/@napi-rs/canvas): v0.1.74
- [`canvaskit-wasm`](https://www.npmjs.com/package/canvaskit-wasm): v0.40.0
- [`skia-canvas`](https://www.npmjs.com/package/skia-canvas): v2.0.3-rc12
> Note: Skia Canvas is tested running in two modes: `serial` and `async`. When running serially, each rendering operation is `await`ed before continuing to the next test iteration. When running asynchronously, all the test iterations are begun at once and are executed in parallel within a `Promise.all` block, making use of the library’s multi-threading.

### [Startup latency](/tests/cold-start.js) (50 iterations)
| Library              | Per Run   | Total Time                                                                  |
| -------------------- | --------- | --------------------------------------------------------------------------- |
| *canvaskit-wasm*     | `  19 ms` | ` 950 ms` <img src="bars.svg#cold-start_wasm" width="260" height="16">      |
| *canvas*             | ` 182 ms` | ` 9.09 s` <img src="bars.svg#cold-start_canvas" width="260" height="16">    |
| *@napi-rs/canvas*    | `  76 ms` | ` 3.79 s` <img src="bars.svg#cold-start_napi" width="260" height="16">      |
| *skia-canvas*        | `   0 ms` | `  20 ms` <img src="bars.svg#cold-start_skia-sync" width="260" height="16"> |

### [Simple house](/tests/house.js) (200 iterations)
| Library                                                     | Per Run   | Total Time                                                              |
| ----------------------------------------------------------- | --------- | ----------------------------------------------------------------------- |
| *canvaskit-wasm* [👁️](snapshots/house_wasm.png)            | `  19 ms` | ` 3.85 s` <img src="bars.svg#house_wasm" width="260" height="16">       |
| *canvas* [👁️](snapshots/house_canvas.png)                  | `  14 ms` | ` 2.78 s` <img src="bars.svg#house_canvas" width="260" height="16">     |
| *@napi-rs/canvas* [👁️](snapshots/house_napi.png)           | `  12 ms` | ` 2.40 s` <img src="bars.svg#house_napi" width="260" height="16">       |
| *skia-canvas (serial)* [👁️](snapshots/house_skia-sync.png) | `  14 ms` | ` 2.75 s` <img src="bars.svg#house_skia-sync" width="260" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/house_skia-async.png) | `   1 ms` | ` 234 ms` <img src="bars.svg#house_skia-async" width="260" height="16"> |

### [Complex shapes](/tests/path2d.js) (200 iterations)
| Library                                                      | Per Run   | Total Time                                                               |
| ------------------------------------------------------------ | --------- | ------------------------------------------------------------------------ |
| canvaskit-wasm                                               | ` ————— ` | ` ————— `   *not supported*                                              |
| *canvas* [👁️](snapshots/path2d_canvas.png)                  | `  64 ms` | `12.86 s` <img src="bars.svg#path2d_canvas" width="260" height="16">     |
| *@napi-rs/canvas* [👁️](snapshots/path2d_napi.png)           | `  41 ms` | ` 8.18 s` <img src="bars.svg#path2d_napi" width="260" height="16">       |
| *skia-canvas (serial)* [👁️](snapshots/path2d_skia-sync.png) | `  33 ms` | ` 6.51 s` <img src="bars.svg#path2d_skia-sync" width="260" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/path2d_skia-async.png) | `   3 ms` | ` 580 ms` <img src="bars.svg#path2d_skia-async" width="260" height="16"> |

### [Bezier curves](/tests/beziers.js) (20 iterations)
| Library                                                       | Per Run   | Total Time                                                                |
| ------------------------------------------------------------- | --------- | ------------------------------------------------------------------------- |
| *canvaskit-wasm* [👁️](snapshots/beziers_wasm.png)            | ` 745 ms` | `14.89 s` <img src="bars.svg#beziers_wasm" width="260" height="16">       |
| *canvas* [👁️](snapshots/beziers_canvas.png)                  | ` 395 ms` | ` 7.90 s` <img src="bars.svg#beziers_canvas" width="260" height="16">     |
| *@napi-rs/canvas* [👁️](snapshots/beziers_napi.png)           | ` 189 ms` | ` 3.77 s` <img src="bars.svg#beziers_napi" width="260" height="16">       |
| *skia-canvas (serial)* [👁️](snapshots/beziers_skia-sync.png) | ` 109 ms` | ` 2.19 s` <img src="bars.svg#beziers_skia-sync" width="260" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/beziers_skia-async.png) | `  15 ms` | ` 299 ms` <img src="bars.svg#beziers_skia-async" width="260" height="16"> |

### [SVG to PNG](/tests/from-svg.js) (100 iterations)
| Library                                                        | Per Run   | Total Time                                                                 |
| -------------------------------------------------------------- | --------- | -------------------------------------------------------------------------- |
| canvaskit-wasm                                                 | ` ————— ` | ` ————— `   *not supported*                                                |
| *canvas* [👁️](snapshots/from-svg_canvas.png)                  | ` 109 ms` | `10.95 s` <img src="bars.svg#from-svg_canvas" width="260" height="16">     |
| *@napi-rs/canvas* [👁️](snapshots/from-svg_napi.png)           | `  82 ms` | ` 8.21 s` <img src="bars.svg#from-svg_napi" width="260" height="16">       |
| *skia-canvas (serial)* [👁️](snapshots/from-svg_skia-sync.png) | `  48 ms` | ` 4.80 s` <img src="bars.svg#from-svg_skia-sync" width="260" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/from-svg_skia-async.png) | `   5 ms` | ` 463 ms` <img src="bars.svg#from-svg_skia-async" width="260" height="16"> |

### [SVG to SVG](/tests/to-svg.js) (200 iterations)
> Note: `canvas` & `napi-rs` convert the input SVG to a bitmap rather than exporting it as a vector

| Library                                                      | Per Run   | Total Time                                                               |
| ------------------------------------------------------------ | --------- | ------------------------------------------------------------------------ |
| canvaskit-wasm                                               | ` ————— ` | ` ————— `   *not supported*                                              |
| *canvas* [👁️](snapshots/to-svg_canvas.svg)                  | `  28 ms` | ` 5.53 s` <img src="bars.svg#to-svg_canvas" width="260" height="16">     |
| *@napi-rs/canvas* [👁️](snapshots/to-svg_napi.svg)           | `  29 ms` | ` 5.87 s` <img src="bars.svg#to-svg_napi" width="260" height="16">       |
| *skia-canvas (serial)* [👁️](snapshots/to-svg_skia-sync.svg) | `   3 ms` | ` 616 ms` <img src="bars.svg#to-svg_skia-sync" width="260" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/to-svg_skia-async.svg) | `   3 ms` | ` 532 ms` <img src="bars.svg#to-svg_skia-async" width="260" height="16"> |

### [SVG to PDF](/tests/to-pdf.js) (200 iterations)
> Note: `canvas` converts the input SVG to a bitmap rather than exporting it as a vector

| Library                                                      | Per Run   | Total Time                                                               |
| ------------------------------------------------------------ | --------- | ------------------------------------------------------------------------ |
| canvaskit-wasm                                               | ` ————— ` | ` ————— `   *not supported*                                              |
| *canvas* [👁️](snapshots/to-pdf_canvas.pdf)                  | `  22 ms` | ` 4.48 s` <img src="bars.svg#to-pdf_canvas" width="260" height="16">     |
| @napi-rs/canvas                                              | ` ————— ` | ` ————— `   *not supported*                                              |
| *skia-canvas (serial)* [👁️](snapshots/to-pdf_skia-sync.pdf) | `   4 ms` | ` 865 ms` <img src="bars.svg#to-pdf_skia-sync" width="260" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/to-pdf_skia-async.pdf) | `   1 ms` | ` 210 ms` <img src="bars.svg#to-pdf_skia-async" width="260" height="16"> |

### [Scale/rotate images](/tests/image-blit.js) (50 iterations)
| Library                                                          | Per Run   | Total Time                                                                   |
| ---------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------- |
| *canvaskit-wasm* [👁️](snapshots/image-blit_wasm.png)            | ` 251 ms` | `12.56 s` <img src="bars.svg#image-blit_wasm" width="260" height="16">       |
| *canvas* [👁️](snapshots/image-blit_canvas.png)                  | ` 245 ms` | `12.27 s` <img src="bars.svg#image-blit_canvas" width="260" height="16">     |
| *@napi-rs/canvas* [👁️](snapshots/image-blit_napi.png)           | `  98 ms` | ` 4.88 s` <img src="bars.svg#image-blit_napi" width="260" height="16">       |
| *skia-canvas (serial)* [👁️](snapshots/image-blit_skia-sync.png) | `  86 ms` | ` 4.31 s` <img src="bars.svg#image-blit_skia-sync" width="260" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/image-blit_skia-async.png) | `   9 ms` | ` 435 ms` <img src="bars.svg#image-blit_skia-async" width="260" height="16"> |

### [Get/put ImageData](/tests/image-rw.js) (150 iterations)
| Library                                                        | Per Run   | Total Time                                                                 |
| -------------------------------------------------------------- | --------- | -------------------------------------------------------------------------- |
| canvaskit-wasm                                                 | ` ————— ` | ` ————— `   *not supported*                                                |
| *canvas* [👁️](snapshots/image-rw_canvas.png)                  | `  59 ms` | ` 8.79 s` <img src="bars.svg#image-rw_canvas" width="260" height="16">     |
| *@napi-rs/canvas* [👁️](snapshots/image-rw_napi.png)           | `  35 ms` | ` 5.32 s` <img src="bars.svg#image-rw_napi" width="260" height="16">       |
| *skia-canvas (serial)* [👁️](snapshots/image-rw_skia-sync.png) | `  57 ms` | ` 8.50 s` <img src="bars.svg#image-rw_skia-sync" width="260" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/image-rw_skia-async.png) | `  39 ms` | ` 5.91 s` <img src="bars.svg#image-rw_skia-async" width="260" height="16"> |

### [Gradients](/tests/gradients.js) (150 iterations)
| Library                                                         | Per Run   | Total Time                                                                  |
| --------------------------------------------------------------- | --------- | --------------------------------------------------------------------------- |
| *canvaskit-wasm* [👁️](snapshots/gradients_wasm.png)            | `  83 ms` | `12.44 s` <img src="bars.svg#gradients_wasm" width="260" height="16">       |
| *canvas* [👁️](snapshots/gradients_canvas.png)                  | `  43 ms` | ` 6.44 s` <img src="bars.svg#gradients_canvas" width="260" height="16">     |
| *@napi-rs/canvas* [👁️](snapshots/gradients_napi.png)           | `  38 ms` | ` 5.74 s` <img src="bars.svg#gradients_napi" width="260" height="16">       |
| *skia-canvas (serial)* [👁️](snapshots/gradients_skia-sync.png) | `  42 ms` | ` 6.34 s` <img src="bars.svg#gradients_skia-sync" width="260" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/gradients_skia-async.png) | `   4 ms` | ` 619 ms` <img src="bars.svg#gradients_skia-async" width="260" height="16"> |

### [Basic text](/tests/text.js) (200 iterations)
| Library                                                    | Per Run   | Total Time                                                             |
| ---------------------------------------------------------- | --------- | ---------------------------------------------------------------------- |
| *canvaskit-wasm* [👁️](snapshots/text_wasm.png)            | `  20 ms` | ` 4.02 s` <img src="bars.svg#text_wasm" width="260" height="16">       |
| *canvas* [👁️](snapshots/text_canvas.png)                  | `  20 ms` | ` 4.10 s` <img src="bars.svg#text_canvas" width="260" height="16">     |
| *@napi-rs/canvas* [👁️](snapshots/text_napi.png)           | `  16 ms` | ` 3.23 s` <img src="bars.svg#text_napi" width="260" height="16">       |
| *skia-canvas (serial)* [👁️](snapshots/text_skia-sync.png) | `  18 ms` | ` 3.64 s` <img src="bars.svg#text_skia-sync" width="260" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/text_skia-async.png) | `   2 ms` | ` 356 ms` <img src="bars.svg#text_skia-async" width="260" height="16"> |