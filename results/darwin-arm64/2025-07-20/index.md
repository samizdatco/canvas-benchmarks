## Canvas Benchmarks (20 Jul 2025)
#### System Details
- **System**: Mac Studio (2025) / Apple Inc. Mac16,9
- **CPU**: Apple M4 Max (2.4 GHz, 16 cores)
- **Memory**: 64.00 GiB total (11.52 GiB free)
- **OS**: macOS 15.4.1 (Sequoia)
- **Node**: 20.18.0

#### Libraries Tested
- [`canvas`](https://www.npmjs.com/package/canvas): v3.1.2
- [`@napi-rs/canvas`](https://www.npmjs.com/package/@napi-rs/canvas): v0.1.73
- [`canvaskit-wasm`](https://www.npmjs.com/package/canvaskit-wasm): v0.40.0
- [`skia-canvas`](https://www.npmjs.com/package/skia-canvas): v2.0.2
> Note: Skia Canvas is tested running in two modes: `serial` and `async`. When running serially, each rendering operation is `await`ed before continuing to the next test iteration. When running asynchronously, all the test iterations are begun at once and are executed in parallel within a `Promise.all` block, making use of the library’s multi-threading.

### [Startup latency](/tests/cold-start.js) (50 iterations)
| Library              | Per Run   | Total Time                                                                  |
| -------------------- | --------- | --------------------------------------------------------------------------- |
| *canvaskit-wasm*     | `  19 ms` | ` 961 ms` <img src="bars/cold-start_wasm.svg" width="250" height="16">      |
| *canvas*             | ` 180 ms` | ` 9.01 s` <img src="bars/cold-start_canvas.svg" width="250" height="16">    |
| *@napi-rs/canvas*    | `  77 ms` | ` 3.85 s` <img src="bars/cold-start_napi.svg" width="250" height="16">      |
| *skia-canvas*        | `  11 ms` | ` 550 ms` <img src="bars/cold-start_skia-sync.svg" width="250" height="16"> |

### [Simple house](/tests/house.js) (200 iterations)
| Library                                                     | Per Run   | Total Time                                                              |
| ----------------------------------------------------------- | --------- | ----------------------------------------------------------------------- |
| *canvaskit-wasm* [👁️](snapshots/house_wasm.png)            | `  20 ms` | ` 3.94 s` <img src="bars/house_wasm.svg" width="250" height="16">       |
| *canvas* [👁️](snapshots/house_canvas.png)                  | `  14 ms` | ` 2.81 s` <img src="bars/house_canvas.svg" width="250" height="16">     |
| *@napi-rs/canvas* [👁️](snapshots/house_napi.png)           | `  12 ms` | ` 2.46 s` <img src="bars/house_napi.svg" width="250" height="16">       |
| *skia-canvas (serial)* [👁️](snapshots/house_skia-sync.png) | `  14 ms` | ` 2.81 s` <img src="bars/house_skia-sync.svg" width="250" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/house_skia-async.png) | `   1 ms` | ` 234 ms` <img src="bars/house_skia-async.svg" width="250" height="16"> |

### [Complex shapes](/tests/path2d.js) (200 iterations)
| Library                                                      | Per Run   | Total Time                                                               |
| ------------------------------------------------------------ | --------- | ------------------------------------------------------------------------ |
| canvaskit-wasm                                               | ` ————— ` | ` ————— `   *not supported*                                              |
| *canvas* [👁️](snapshots/path2d_canvas.png)                  | `  65 ms` | `12.94 s` <img src="bars/path2d_canvas.svg" width="250" height="16">     |
| *@napi-rs/canvas* [👁️](snapshots/path2d_napi.png)           | `  42 ms` | ` 8.32 s` <img src="bars/path2d_napi.svg" width="250" height="16">       |
| *skia-canvas (serial)* [👁️](snapshots/path2d_skia-sync.png) | `  33 ms` | ` 6.54 s` <img src="bars/path2d_skia-sync.svg" width="250" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/path2d_skia-async.png) | `   3 ms` | ` 566 ms` <img src="bars/path2d_skia-async.svg" width="250" height="16"> |

### [Bezier curves](/tests/beziers.js) (20 iterations)
| Library                                                       | Per Run   | Total Time                                                                |
| ------------------------------------------------------------- | --------- | ------------------------------------------------------------------------- |
| *canvaskit-wasm* [👁️](snapshots/beziers_wasm.png)            | ` 740 ms` | `14.80 s` <img src="bars/beziers_wasm.svg" width="250" height="16">       |
| *canvas* [👁️](snapshots/beziers_canvas.png)                  | ` 399 ms` | ` 7.99 s` <img src="bars/beziers_canvas.svg" width="250" height="16">     |
| *@napi-rs/canvas* [👁️](snapshots/beziers_napi.png)           | ` 191 ms` | ` 3.82 s` <img src="bars/beziers_napi.svg" width="250" height="16">       |
| *skia-canvas (serial)* [👁️](snapshots/beziers_skia-sync.png) | ` 111 ms` | ` 2.21 s` <img src="bars/beziers_skia-sync.svg" width="250" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/beziers_skia-async.png) | `  15 ms` | ` 296 ms` <img src="bars/beziers_skia-async.svg" width="250" height="16"> |

### [SVG to PNG](/tests/from-svg.js) (100 iterations)
| Library                                                        | Per Run   | Total Time                                                                 |
| -------------------------------------------------------------- | --------- | -------------------------------------------------------------------------- |
| canvaskit-wasm                                                 | ` ————— ` | ` ————— `   *not supported*                                                |
| *canvas* [👁️](snapshots/from-svg_canvas.png)                  | ` 110 ms` | `10.98 s` <img src="bars/from-svg_canvas.svg" width="250" height="16">     |
| *@napi-rs/canvas* [👁️](snapshots/from-svg_napi.png)           | `  83 ms` | ` 8.27 s` <img src="bars/from-svg_napi.svg" width="250" height="16">       |
| *skia-canvas (serial)* [👁️](snapshots/from-svg_skia-sync.png) | `  48 ms` | ` 4.78 s` <img src="bars/from-svg_skia-sync.svg" width="250" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/from-svg_skia-async.png) | `   5 ms` | ` 488 ms` <img src="bars/from-svg_skia-async.svg" width="250" height="16"> |

### [SVG to SVG](/tests/to-svg.js) (200 iterations)
> Note: `canvas` & `napi-rs` convert the input SVG to a bitmap rather than exporting it as a vector

| Library                                                      | Per Run   | Total Time                                                               |
| ------------------------------------------------------------ | --------- | ------------------------------------------------------------------------ |
| canvaskit-wasm                                               | ` ————— ` | ` ————— `   *not supported*                                              |
| *canvas* [👁️](snapshots/to-svg_canvas.svg)                  | `  28 ms` | ` 5.59 s` <img src="bars/to-svg_canvas.svg" width="250" height="16">     |
| *@napi-rs/canvas* [👁️](snapshots/to-svg_napi.svg)           | `  30 ms` | ` 5.96 s` <img src="bars/to-svg_napi.svg" width="250" height="16">       |
| *skia-canvas (serial)* [👁️](snapshots/to-svg_skia-sync.svg) | `   3 ms` | ` 610 ms` <img src="bars/to-svg_skia-sync.svg" width="250" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/to-svg_skia-async.svg) | `   3 ms` | ` 548 ms` <img src="bars/to-svg_skia-async.svg" width="250" height="16"> |

### [SVG to PDF](/tests/to-pdf.js) (200 iterations)
> Note: `canvas` converts the input SVG to a bitmap rather than exporting it as a vector

| Library                                                      | Per Run   | Total Time                                                               |
| ------------------------------------------------------------ | --------- | ------------------------------------------------------------------------ |
| canvaskit-wasm                                               | ` ————— ` | ` ————— `   *not supported*                                              |
| *canvas* [👁️](snapshots/to-pdf_canvas.pdf)                  | `  23 ms` | ` 4.52 s` <img src="bars/to-pdf_canvas.svg" width="250" height="16">     |
| @napi-rs/canvas                                              | ` ————— ` | ` ————— `   *not supported*                                              |
| *skia-canvas (serial)* [👁️](snapshots/to-pdf_skia-sync.pdf) | `   4 ms` | ` 869 ms` <img src="bars/to-pdf_skia-sync.svg" width="250" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/to-pdf_skia-async.pdf) | `   1 ms` | ` 206 ms` <img src="bars/to-pdf_skia-async.svg" width="250" height="16"> |

### [Scale/rotate images](/tests/image-blit.js) (50 iterations)
| Library                                                          | Per Run   | Total Time                                                                   |
| ---------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------- |
| *canvaskit-wasm* [👁️](snapshots/image-blit_wasm.png)            | ` 258 ms` | `12.90 s` <img src="bars/image-blit_wasm.svg" width="250" height="16">       |
| *canvas* [👁️](snapshots/image-blit_canvas.png)                  | ` 246 ms` | `12.32 s` <img src="bars/image-blit_canvas.svg" width="250" height="16">     |
| *@napi-rs/canvas* [👁️](snapshots/image-blit_napi.png)           | `  98 ms` | ` 4.91 s` <img src="bars/image-blit_napi.svg" width="250" height="16">       |
| *skia-canvas (serial)* [👁️](snapshots/image-blit_skia-sync.png) | `  86 ms` | ` 4.32 s` <img src="bars/image-blit_skia-sync.svg" width="250" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/image-blit_skia-async.png) | `   9 ms` | ` 447 ms` <img src="bars/image-blit_skia-async.svg" width="250" height="16"> |

### [Get/put ImageData](/tests/image-rw.js) (150 iterations)
| Library                                                        | Per Run   | Total Time                                                                 |
| -------------------------------------------------------------- | --------- | -------------------------------------------------------------------------- |
| canvaskit-wasm                                                 | ` ————— ` | ` ————— `   *not supported*                                                |
| *canvas* [👁️](snapshots/image-rw_canvas.png)                  | `  59 ms` | ` 8.87 s` <img src="bars/image-rw_canvas.svg" width="250" height="16">     |
| *@napi-rs/canvas* [👁️](snapshots/image-rw_napi.png)           | `  36 ms` | ` 5.41 s` <img src="bars/image-rw_napi.svg" width="250" height="16">       |
| *skia-canvas (serial)* [👁️](snapshots/image-rw_skia-sync.png) | `  54 ms` | ` 8.08 s` <img src="bars/image-rw_skia-sync.svg" width="250" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/image-rw_skia-async.png) | `  44 ms` | ` 6.59 s` <img src="bars/image-rw_skia-async.svg" width="250" height="16"> |

### [Gradients](/tests/gradients.js) (150 iterations)
| Library                                                         | Per Run   | Total Time                                                                  |
| --------------------------------------------------------------- | --------- | --------------------------------------------------------------------------- |
| *canvaskit-wasm* [👁️](snapshots/gradients_wasm.png)            | `  85 ms` | `12.79 s` <img src="bars/gradients_wasm.svg" width="250" height="16">       |
| *canvas* [👁️](snapshots/gradients_canvas.png)                  | `  43 ms` | ` 6.49 s` <img src="bars/gradients_canvas.svg" width="250" height="16">     |
| *@napi-rs/canvas* [👁️](snapshots/gradients_napi.png)           | `  39 ms` | ` 5.81 s` <img src="bars/gradients_napi.svg" width="250" height="16">       |
| *skia-canvas (serial)* [👁️](snapshots/gradients_skia-sync.png) | `  43 ms` | ` 6.38 s` <img src="bars/gradients_skia-sync.svg" width="250" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/gradients_skia-async.png) | `   4 ms` | ` 623 ms` <img src="bars/gradients_skia-async.svg" width="250" height="16"> |

### [Basic text](/tests/text.js) (200 iterations)
| Library                                                    | Per Run   | Total Time                                                             |
| ---------------------------------------------------------- | --------- | ---------------------------------------------------------------------- |
| *canvaskit-wasm* [👁️](snapshots/text_wasm.png)            | `  20 ms` | ` 4.05 s` <img src="bars/text_wasm.svg" width="250" height="16">       |
| *canvas* [👁️](snapshots/text_canvas.png)                  | `  21 ms` | ` 4.13 s` <img src="bars/text_canvas.svg" width="250" height="16">     |
| *@napi-rs/canvas* [👁️](snapshots/text_napi.png)           | `  16 ms` | ` 3.26 s` <img src="bars/text_napi.svg" width="250" height="16">       |
| *skia-canvas (serial)* [👁️](snapshots/text_skia-sync.png) | `  18 ms` | ` 3.67 s` <img src="bars/text_skia-sync.svg" width="250" height="16">  |
| *skia-canvas (async)* [👁️](snapshots/text_skia-async.png) | `   2 ms` | ` 351 ms` <img src="bars/text_skia-async.svg" width="250" height="16"> |