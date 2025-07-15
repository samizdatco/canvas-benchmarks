## Canvas Benchmarks (Tue Jul 15 2025)

<details><summary>

### System Details

</summary>

#### Hardware & Software
- **System**: Mac Studio (2025) / Apple Inc. Mac16,9
- **CPU**: Apple M4 Max (2.4 GHz, 16 cores)
- **Memory**: 64.00 GiB total (10.74 GiB free)
- **OS**: macOS 15.4.1 (Sequoia)
- **Node**: 20.18.0

#### Library Versions
- `canvas`: v3.1.2
- `@napi-rs/canvas`: v0.1.73
- `canvaskit-wasm`: v0.40.0
- `skia-canvas`: v2.0.2

</details>

### [Startup latency](/tests/cold-start.js) (50 iterations)
| Library              | Per Run   | Total Time                                                                      |
| -------------------- | --------- | ------------------------------------------------------------------------------- |
| *canvaskit-wasm*     | `  22 ms` | ` 1.12 s` <img src="img/bars/cold-start_wasm.svg" width="250" height="16">      |
| *canvas*             | ` 181 ms` | ` 9.05 s` <img src="img/bars/cold-start_canvas.svg" width="250" height="16">    |
| *@napi-rs/canvas*    | `  74 ms` | ` 3.71 s` <img src="img/bars/cold-start_napi.svg" width="250" height="16">      |
| *skia-canvas*        | `  11 ms` | ` 528 ms` <img src="img/bars/cold-start_skia-sync.svg" width="250" height="16"> |

### [Simple house](/tests/house.js) (200 iterations)
| Library                                                          | Per Run   | Total Time                                                                  |
| ---------------------------------------------------------------- | --------- | --------------------------------------------------------------------------- |
| *canvaskit-wasm* [👁️](/img/snapshots/house_wasm.png)            | `  19 ms` | ` 3.88 s` <img src="img/bars/house_wasm.svg" width="250" height="16">       |
| *canvas* [👁️](/img/snapshots/house_canvas.png)                  | `  14 ms` | ` 2.82 s` <img src="img/bars/house_canvas.svg" width="250" height="16">     |
| *@napi-rs/canvas* [👁️](/img/snapshots/house_napi.png)           | `  12 ms` | ` 2.44 s` <img src="img/bars/house_napi.svg" width="250" height="16">       |
| *skia-canvas (serial)* [👁️](/img/snapshots/house_skia-sync.png) | `  13 ms` | ` 2.58 s` <img src="img/bars/house_skia-sync.svg" width="250" height="16">  |
| *skia-canvas (async)* [👁️](/img/snapshots/house_skia-async.png) | `   1 ms` | ` 225 ms` <img src="img/bars/house_skia-async.svg" width="250" height="16"> |

### [Complex shapes](/tests/path2d.js) (200 iterations)
| Library                                                           | Per Run   | Total Time                                                                   |
| ----------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------- |
| canvaskit-wasm                                                    | ` ————— ` | ` ————— `   *not supported*                                                  |
| *canvas* [👁️](/img/snapshots/path2d_canvas.png)                  | `  67 ms` | `13.39 s` <img src="img/bars/path2d_canvas.svg" width="250" height="16">     |
| *@napi-rs/canvas* [👁️](/img/snapshots/path2d_napi.png)           | `  41 ms` | ` 8.29 s` <img src="img/bars/path2d_napi.svg" width="250" height="16">       |
| *skia-canvas (serial)* [👁️](/img/snapshots/path2d_skia-sync.png) | `  32 ms` | ` 6.34 s` <img src="img/bars/path2d_skia-sync.svg" width="250" height="16">  |
| *skia-canvas (async)* [👁️](/img/snapshots/path2d_skia-async.png) | `   3 ms` | ` 559 ms` <img src="img/bars/path2d_skia-async.svg" width="250" height="16"> |

### [Bezier curves](/tests/beziers.js) (20 iterations)
| Library                                                            | Per Run   | Total Time                                                                    |
| ------------------------------------------------------------------ | --------- | ----------------------------------------------------------------------------- |
| *canvaskit-wasm* [👁️](/img/snapshots/beziers_wasm.png)            | ` 739 ms` | `14.77 s` <img src="img/bars/beziers_wasm.svg" width="250" height="16">       |
| *canvas* [👁️](/img/snapshots/beziers_canvas.png)                  | ` 399 ms` | ` 7.98 s` <img src="img/bars/beziers_canvas.svg" width="250" height="16">     |
| *@napi-rs/canvas* [👁️](/img/snapshots/beziers_napi.png)           | ` 191 ms` | ` 3.83 s` <img src="img/bars/beziers_napi.svg" width="250" height="16">       |
| *skia-canvas (serial)* [👁️](/img/snapshots/beziers_skia-sync.png) | ` 110 ms` | ` 2.19 s` <img src="img/bars/beziers_skia-sync.svg" width="250" height="16">  |
| *skia-canvas (async)* [👁️](/img/snapshots/beziers_skia-async.png) | `  14 ms` | ` 287 ms` <img src="img/bars/beziers_skia-async.svg" width="250" height="16"> |

### [SVG to PNG](/tests/from-svg.js) (100 iterations)
| Library                                                             | Per Run   | Total Time                                                                     |
| ------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------ |
| canvaskit-wasm                                                      | ` ————— ` | ` ————— `   *not supported*                                                    |
| *canvas* [👁️](/img/snapshots/from-svg_canvas.png)                  | ` 110 ms` | `11.03 s` <img src="img/bars/from-svg_canvas.svg" width="250" height="16">     |
| *@napi-rs/canvas* [👁️](/img/snapshots/from-svg_napi.png)           | `  83 ms` | ` 8.31 s` <img src="img/bars/from-svg_napi.svg" width="250" height="16">       |
| *skia-canvas (serial)* [👁️](/img/snapshots/from-svg_skia-sync.png) | `  47 ms` | ` 4.74 s` <img src="img/bars/from-svg_skia-sync.svg" width="250" height="16">  |
| *skia-canvas (async)* [👁️](/img/snapshots/from-svg_skia-async.png) | `   5 ms` | ` 453 ms` <img src="img/bars/from-svg_skia-async.svg" width="250" height="16"> |

### [Create SVG](/tests/to-svg.js) (200 iterations)
> Note: `canvas` & `napi-rs` convert the input SVG to a bitmap rather than exporting it as a vector

| Library                                                           | Per Run   | Total Time                                                                   |
| ----------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------- |
| canvaskit-wasm                                                    | ` ————— ` | ` ————— `   *not supported*                                                  |
| *canvas* [👁️](/img/snapshots/to-svg_canvas.svg)                  | `  28 ms` | ` 5.59 s` <img src="img/bars/to-svg_canvas.svg" width="250" height="16">     |
| *@napi-rs/canvas* [👁️](/img/snapshots/to-svg_napi.svg)           | `  30 ms` | ` 5.98 s` <img src="img/bars/to-svg_napi.svg" width="250" height="16">       |
| *skia-canvas (serial)* [👁️](/img/snapshots/to-svg_skia-sync.svg) | `   3 ms` | ` 620 ms` <img src="img/bars/to-svg_skia-sync.svg" width="250" height="16">  |
| *skia-canvas (async)* [👁️](/img/snapshots/to-svg_skia-async.svg) | `   3 ms` | ` 548 ms` <img src="img/bars/to-svg_skia-async.svg" width="250" height="16"> |

### [Create PDF](/tests/to-pdf.js) (200 iterations)
> Note: `canvas` converts the input SVG to a bitmap rather than exporting it as a vector

| Library                                                           | Per Run   | Total Time                                                                   |
| ----------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------- |
| canvaskit-wasm                                                    | ` ————— ` | ` ————— `   *not supported*                                                  |
| *canvas* [👁️](/img/snapshots/to-pdf_canvas.pdf)                  | `  23 ms` | ` 4.51 s` <img src="img/bars/to-pdf_canvas.svg" width="250" height="16">     |
| @napi-rs/canvas                                                   | ` ————— ` | ` ————— `   *not supported*                                                  |
| *skia-canvas (serial)* [👁️](/img/snapshots/to-pdf_skia-sync.pdf) | `   4 ms` | ` 879 ms` <img src="img/bars/to-pdf_skia-sync.svg" width="250" height="16">  |
| *skia-canvas (async)* [👁️](/img/snapshots/to-pdf_skia-async.pdf) | `   1 ms` | ` 207 ms` <img src="img/bars/to-pdf_skia-async.svg" width="250" height="16"> |

### [Scale/rotate images](/tests/image-blit.js) (50 iterations)
| Library                                                               | Per Run   | Total Time                                                                       |
| --------------------------------------------------------------------- | --------- | -------------------------------------------------------------------------------- |
| *canvaskit-wasm* [👁️](/img/snapshots/image-blit_wasm.png)            | ` 230 ms` | `11.49 s` <img src="img/bars/image-blit_wasm.svg" width="250" height="16">       |
| *canvas* [👁️](/img/snapshots/image-blit_canvas.png)                  | ` 137 ms` | ` 6.87 s` <img src="img/bars/image-blit_canvas.svg" width="250" height="16">     |
| *@napi-rs/canvas* [👁️](/img/snapshots/image-blit_napi.png)           | `  63 ms` | ` 3.16 s` <img src="img/bars/image-blit_napi.svg" width="250" height="16">       |
| *skia-canvas (serial)* [👁️](/img/snapshots/image-blit_skia-sync.png) | `  49 ms` | ` 2.45 s` <img src="img/bars/image-blit_skia-sync.svg" width="250" height="16">  |
| *skia-canvas (async)* [👁️](/img/snapshots/image-blit_skia-async.png) | `   5 ms` | ` 255 ms` <img src="img/bars/image-blit_skia-async.svg" width="250" height="16"> |

### [Get/put ImageData](/tests/image-rw.js) (50 iterations)
| Library                                                             | Per Run   | Total Time                                                                     |
| ------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------ |
| canvaskit-wasm                                                      | ` ————— ` | ` ————— `   *not supported*                                                    |
| *canvas* [👁️](/img/snapshots/image-rw_canvas.png)                  | `  40 ms` | ` 2.02 s` <img src="img/bars/image-rw_canvas.svg" width="250" height="16">     |
| *@napi-rs/canvas* [👁️](/img/snapshots/image-rw_napi.png)           | `  38 ms` | ` 1.91 s` <img src="img/bars/image-rw_napi.svg" width="250" height="16">       |
| *skia-canvas (serial)* [👁️](/img/snapshots/image-rw_skia-sync.png) | ` 121 ms` | ` 6.06 s` <img src="img/bars/image-rw_skia-sync.svg" width="250" height="16">  |
| *skia-canvas (async)* [👁️](/img/snapshots/image-rw_skia-async.png) | ` 104 ms` | ` 5.22 s` <img src="img/bars/image-rw_skia-async.svg" width="250" height="16"> |

### [Gradients](/tests/gradients.js) (150 iterations)
| Library                                                              | Per Run   | Total Time                                                                      |
| -------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------- |
| *canvaskit-wasm* [👁️](/img/snapshots/gradients_wasm.png)            | `  84 ms` | `12.55 s` <img src="img/bars/gradients_wasm.svg" width="250" height="16">       |
| *canvas* [👁️](/img/snapshots/gradients_canvas.png)                  | `  43 ms` | ` 6.50 s` <img src="img/bars/gradients_canvas.svg" width="250" height="16">     |
| *@napi-rs/canvas* [👁️](/img/snapshots/gradients_napi.png)           | `  39 ms` | ` 5.79 s` <img src="img/bars/gradients_napi.svg" width="250" height="16">       |
| *skia-canvas (serial)* [👁️](/img/snapshots/gradients_skia-sync.png) | `  41 ms` | ` 6.21 s` <img src="img/bars/gradients_skia-sync.svg" width="250" height="16">  |
| *skia-canvas (async)* [👁️](/img/snapshots/gradients_skia-async.png) | `   4 ms` | ` 578 ms` <img src="img/bars/gradients_skia-async.svg" width="250" height="16"> |

### [Basic text](/tests/text.js) (200 iterations)
| Library                                                         | Per Run   | Total Time                                                                 |
| --------------------------------------------------------------- | --------- | -------------------------------------------------------------------------- |
| *canvaskit-wasm* [👁️](/img/snapshots/text_wasm.png)            | `  20 ms` | ` 4.04 s` <img src="img/bars/text_wasm.svg" width="250" height="16">       |
| *canvas* [👁️](/img/snapshots/text_canvas.png)                  | `  21 ms` | ` 4.12 s` <img src="img/bars/text_canvas.svg" width="250" height="16">     |
| *@napi-rs/canvas* [👁️](/img/snapshots/text_napi.png)           | `  16 ms` | ` 3.22 s` <img src="img/bars/text_napi.svg" width="250" height="16">       |
| *skia-canvas (serial)* [👁️](/img/snapshots/text_skia-sync.png) | `  17 ms` | ` 3.42 s` <img src="img/bars/text_skia-sync.svg" width="250" height="16">  |
| *skia-canvas (async)* [👁️](/img/snapshots/text_skia-async.png) | `   2 ms` | ` 341 ms` <img src="img/bars/text_skia-async.svg" width="250" height="16"> |