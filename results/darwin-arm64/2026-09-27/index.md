## Canvas Benchmarks · 27 Sept 2026
#### Configuration
- **System**: MacBook Air (13-inch, M3, 2024) / Apple Inc. Mac15,12
- **CPU**: Apple M3 (2.4 GHz, 8 cores)
- **GPU**: Apple M3 / Apple (Built-In, 10 cores)
- **Memory**: 24.00 GiB total (1.89 GiB free)
- **OS**: macOS 15.7.5 (Sequoia)
- **Node**: 24.6.0

#### Libraries Tested
- [`canvas`](https://www.npmjs.com/package/canvas): v3.2.3
- [`@napi-rs/canvas`](https://www.npmjs.com/package/@napi-rs/canvas): v1.0.8
- [`canvaskit-wasm`](https://www.npmjs.com/package/canvaskit-wasm): v0.42.0
- [`skia-canvas`](https://www.npmjs.com/package/skia-canvas): v4.0.0-rc4

#### Methodology
For each drawing test, the `canvas` library's time is used as a baseline measurement and the other libraries' Relative Speed values are presented as ‘*n* times faster’ multiples (e.g., `2×` means it ran in half the time). The file sizes listed in the Output column vary between libraries in part due to Skia Canvas’s PNG exporter automatically selecting which adaptive filters to use.

Skia Canvas is tested running in two modes: `serial` and `async`. When running serially, each rendering operation is completed before continuing to the next test iteration. When running asynchronously, all the test iterations are begun at once and are executed in parallel within a `Promise.all` block, making use of the library’s multi-threading.

### [Startup latency](/tests/cold-start.js)
| Library           | Elapsed Time                                  |
| ----------------- | --------------------------------------------- |
| *canvaskit-wasm*  | `  25 ms` ![ ](bars.svg#cold-start_wasm)      |
| *canvas*          | ` 116 ms` ![ ](bars.svg#cold-start_canvas)    |
| *@napi-rs/canvas* | `  71 ms` ![ ](bars.svg#cold-start_napi)      |
| *skia-canvas*     | `   7 ms` ![ ](bars.svg#cold-start_skia-sync) |

### [Path2D drawing](/tests/path2d.js)
| Library                | Per Run   | Relative Speed (50 iterations)           | Output                                       |
| ---------------------- | --------- | ---------------------------------------- | -------------------------------------------- |
| *canvaskit-wasm*       | ` 484 ms` | ` 0.3×` ![ ](bars.svg#path2d_wasm)       | [` 499 KB`](snapshots/path2d_wasm.png)       |
| *canvas*               | ` 135 ms` | ` 1.0×` ![ ](bars.svg#path2d_canvas)     | [` 506 KB`](snapshots/path2d_canvas.png)     |
| *@napi-rs/canvas*      | ` 100 ms` | ` 1.3×` ![ ](bars.svg#path2d_napi)       | [` 501 KB`](snapshots/path2d_napi.png)       |
| *skia-canvas (serial)* | `  52 ms` | ` 2.6×` ![ ](bars.svg#path2d_skia-sync)  | [` 331 KB`](snapshots/path2d_skia-sync.png)  |
| *skia-canvas (async)*  | `  23 ms` | ` 5.9×` ![ ](bars.svg#path2d_skia-async) | [` 331 KB`](snapshots/path2d_skia-async.png) |

### [Bezier curves](/tests/beziers.js)
| Library                | Per Run   | Relative Speed (40 iterations)            | Output                                        |
| ---------------------- | --------- | ----------------------------------------- | --------------------------------------------- |
| *canvaskit-wasm*       | ` 646 ms` | ` 0.7×` ![ ](bars.svg#beziers_wasm)       | [` 555 KB`](snapshots/beziers_wasm.png)       |
| *canvas*               | ` 422 ms` | ` 1.0×` ![ ](bars.svg#beziers_canvas)     | [` 561 KB`](snapshots/beziers_canvas.png)     |
| *@napi-rs/canvas*      | ` 184 ms` | ` 2.3×` ![ ](bars.svg#beziers_napi)       | [` 559 KB`](snapshots/beziers_napi.png)       |
| *skia-canvas (serial)* | `  47 ms` | ` 8.9×` ![ ](bars.svg#beziers_skia-sync)  | [` 559 KB`](snapshots/beziers_skia-sync.png)  |
| *skia-canvas (async)*  | `   9 ms` | `45.7×` ![ ](bars.svg#beziers_skia-async) | [` 559 KB`](snapshots/beziers_skia-async.png) |

### [Dense line chart](/tests/line-chart.js)
| Library                | Per Run   | Relative Speed (100 iterations)              | Output                                           |
| ---------------------- | --------- | -------------------------------------------- | ------------------------------------------------ |
| *canvaskit-wasm*       | `  76 ms` | ` 1.5×` ![ ](bars.svg#line-chart_wasm)       | [` 311 KB`](snapshots/line-chart_wasm.png)       |
| *canvas*               | ` 113 ms` | ` 1.0×` ![ ](bars.svg#line-chart_canvas)     | [` 345 KB`](snapshots/line-chart_canvas.png)     |
| *@napi-rs/canvas*      | `  42 ms` | ` 2.7×` ![ ](bars.svg#line-chart_napi)       | [` 311 KB`](snapshots/line-chart_napi.png)       |
| *skia-canvas (serial)* | `  26 ms` | ` 4.3×` ![ ](bars.svg#line-chart_skia-sync)  | [` 135 KB`](snapshots/line-chart_skia-sync.png)  |
| *skia-canvas (async)*  | `   7 ms` | `16.1×` ![ ](bars.svg#line-chart_skia-async) | [` 135 KB`](snapshots/line-chart_skia-async.png) |

### [SVG to PNG](/tests/from-svg.js)
| Library                | Per Run   | Relative Speed (100 iterations)            | Output                                         |
| ---------------------- | --------- | ------------------------------------------ | ---------------------------------------------- |
| canvaskit-wasm         | ` ————— ` | ` ——— `   *not supported*                  | ` ————— `                                      |
| *canvas*               | ` 169 ms` | ` 1.0×` ![ ](bars.svg#from-svg_canvas)     | [` 494 KB`](snapshots/from-svg_canvas.png)     |
| *@napi-rs/canvas*      | ` 113 ms` | ` 1.5×` ![ ](bars.svg#from-svg_napi)       | [` 498 KB`](snapshots/from-svg_napi.png)       |
| *skia-canvas (serial)* | `  95 ms` | ` 1.8×` ![ ](bars.svg#from-svg_skia-sync)  | [` 366 KB`](snapshots/from-svg_skia-sync.png)  |
| *skia-canvas (async)*  | `  18 ms` | ` 9.6×` ![ ](bars.svg#from-svg_skia-async) | [` 366 KB`](snapshots/from-svg_skia-async.png) |

### [SVG to SVG](/tests/to-svg.js)
> *`canvas` & `napi-rs` convert the input SVG to a bitmap rather than exporting it as a vector*

| Library                | Per Run   | Relative Speed (100 iterations)          | Output                                       |
| ---------------------- | --------- | ---------------------------------------- | -------------------------------------------- |
| canvaskit-wasm         | ` ————— ` | ` ——— `   *not supported*                | ` ————— `                                    |
| *canvas*               | `  33 ms` | ` 1.0×` ![ ](bars.svg#to-svg_canvas)     | [` 255 KB`](snapshots/to-svg_canvas.svg)     |
| *@napi-rs/canvas*      | `  35 ms` | ` 0.9×` ![ ](bars.svg#to-svg_napi)       | [` 453 KB`](snapshots/to-svg_napi.svg)       |
| *skia-canvas (serial)* | `   4 ms` | ` 8.9×` ![ ](bars.svg#to-svg_skia-sync)  | [` 174 KB`](snapshots/to-svg_skia-sync.svg)  |
| *skia-canvas (async)*  | `   3 ms` | `10.6×` ![ ](bars.svg#to-svg_skia-async) | [` 174 KB`](snapshots/to-svg_skia-async.svg) |

### [SVG to PDF](/tests/to-pdf.js)
> *`canvas` & `napi-rs` convert the input SVG to a bitmap rather than exporting it as a vector*

| Library                | Per Run   | Relative Speed (200 iterations)          | Output                                       |
| ---------------------- | --------- | ---------------------------------------- | -------------------------------------------- |
| canvaskit-wasm         | ` ————— ` | ` ——— `   *not supported*                | ` ————— `                                    |
| *canvas*               | `  27 ms` | ` 1.0×` ![ ](bars.svg#to-pdf_canvas)     | [` 142 KB`](snapshots/to-pdf_canvas.pdf)     |
| *@napi-rs/canvas*      | `  28 ms` | ` 1.0×` ![ ](bars.svg#to-pdf_napi)       | [` 272 KB`](snapshots/to-pdf_napi.pdf)       |
| *skia-canvas (serial)* | `   5 ms` | ` 5.3×` ![ ](bars.svg#to-pdf_skia-sync)  | [`  52 KB`](snapshots/to-pdf_skia-sync.pdf)  |
| *skia-canvas (async)*  | `   2 ms` | `17.2×` ![ ](bars.svg#to-pdf_skia-async) | [`  52 KB`](snapshots/to-pdf_skia-async.pdf) |

### [PDF to PNG](/tests/from-pdf.js)
> *rendered in JavaScript using [**PDF.js**](https://www.npmjs.com/package/pdfjs-dist):*

| Library                | Per Run   | Relative Speed (20 iterations)             | Output                                         |
| ---------------------- | --------- | ------------------------------------------ | ---------------------------------------------- |
| canvaskit-wasm         | ` ————— ` | ` ——— `   *not supported*                  | ` ————— `                                      |
| *canvas*               | ` 767 ms` | ` 1.0×` ![ ](bars.svg#from-pdf_canvas)     | [` 3.1 MB`](snapshots/from-pdf_canvas.png)     |
| *@napi-rs/canvas*      | ` 663 ms` | ` 1.2×` ![ ](bars.svg#from-pdf_napi)       | [` 3.4 MB`](snapshots/from-pdf_napi.png)       |
| *skia-canvas (serial)* | ` 458 ms` | ` 1.7×` ![ ](bars.svg#from-pdf_skia-sync)  | [` 1.9 MB`](snapshots/from-pdf_skia-sync.png)  |
| *skia-canvas (async)*  | ` 248 ms` | ` 3.1×` ![ ](bars.svg#from-pdf_skia-async) | [` 1.9 MB`](snapshots/from-pdf_skia-async.png) |

> *[rendered natively](/tests/from-pdf-native.js) in Rust using [Hayro](https://github.com/laurenzv/hayro):*

|                        |           |                                                   |                                                       |
| ---------------------- | --------- | ------------------------------------------------- | ----------------------------------------------------- |
| *skia-canvas (serial)* | ` 155 ms` | ` 4.9×` ![ ](bars.svg#from-pdf-native_skia-sync)  | [` 1.3 MB`](snapshots/from-pdf-native_skia-sync.png)  |
| *skia-canvas (async)*  | `  70 ms` | `11.0×` ![ ](bars.svg#from-pdf-native_skia-async) | [` 1.3 MB`](snapshots/from-pdf-native_skia-async.png) |

### [Scale/rotate images](/tests/image-blit.js)
| Library                | Per Run   | Relative Speed (30 iterations)               | Output                                           |
| ---------------------- | --------- | -------------------------------------------- | ------------------------------------------------ |
| *canvaskit-wasm*       | ` 785 ms` | ` 1.1×` ![ ](bars.svg#image-blit_wasm)       | [` 2.1 MB`](snapshots/image-blit_wasm.png)       |
| *canvas*               | ` 826 ms` | ` 1.0×` ![ ](bars.svg#image-blit_canvas)     | [` 1.9 MB`](snapshots/image-blit_canvas.png)     |
| *@napi-rs/canvas*      | ` 195 ms` | ` 4.2×` ![ ](bars.svg#image-blit_napi)       | [` 2.1 MB`](snapshots/image-blit_napi.png)       |
| *skia-canvas (serial)* | ` 134 ms` | ` 6.2×` ![ ](bars.svg#image-blit_skia-sync)  | [` 2.0 MB`](snapshots/image-blit_skia-sync.png)  |
| *skia-canvas (async)*  | `  26 ms` | `31.7×` ![ ](bars.svg#image-blit_skia-async) | [` 2.0 MB`](snapshots/image-blit_skia-async.png) |

### [Get/put ImageData](/tests/image-rw.js)
| Library                | Per Run   | Relative Speed (50 iterations)             | Output                                         |
| ---------------------- | --------- | ------------------------------------------ | ---------------------------------------------- |
| canvaskit-wasm         | ` ————— ` | ` ——— `   *not supported*                  | ` ————— `                                      |
| *canvas*               | ` 274 ms` | ` 1.0×` ![ ](bars.svg#image-rw_canvas)     | [` 220 KB`](snapshots/image-rw_canvas.png)     |
| *@napi-rs/canvas*      | ` 257 ms` | ` 1.1×` ![ ](bars.svg#image-rw_napi)       | [` 228 KB`](snapshots/image-rw_napi.png)       |
| *skia-canvas (serial)* | ` 239 ms` | ` 1.1×` ![ ](bars.svg#image-rw_skia-sync)  | [` 175 KB`](snapshots/image-rw_skia-sync.png)  |
| *skia-canvas (async)*  | ` 202 ms` | ` 1.4×` ![ ](bars.svg#image-rw_skia-async) | [` 175 KB`](snapshots/image-rw_skia-async.png) |

### [Gradients](/tests/gradients.js)
| Library                | Per Run   | Relative Speed (250 iterations)             | Output                                          |
| ---------------------- | --------- | ------------------------------------------- | ----------------------------------------------- |
| canvaskit-wasm         | ` ————— ` | ` ——— `   *not supported*                   | ` ————— `                                       |
| *canvas*               | `  57 ms` | ` 1.0×` ![ ](bars.svg#gradients_canvas)     | [` 133 KB`](snapshots/gradients_canvas.jpg)     |
| *@napi-rs/canvas*      | `  25 ms` | ` 2.3×` ![ ](bars.svg#gradients_napi)       | [` 130 KB`](snapshots/gradients_napi.jpg)       |
| *skia-canvas (serial)* | `   8 ms` | ` 7.5×` ![ ](bars.svg#gradients_skia-sync)  | [` 130 KB`](snapshots/gradients_skia-sync.jpg)  |
| *skia-canvas (async)*  | `   3 ms` | `16.6×` ![ ](bars.svg#gradients_skia-async) | [` 130 KB`](snapshots/gradients_skia-async.jpg) |

### [Text rendering](/tests/text.js)
| Library                | Per Run   | Relative Speed (200 iterations)        | Output                                     |
| ---------------------- | --------- | -------------------------------------- | ------------------------------------------ |
| *canvaskit-wasm*       | `  99 ms` | ` 0.2×` ![ ](bars.svg#text_wasm)       | [` 150 KB`](snapshots/text_wasm.png)       |
| *canvas*               | `  24 ms` | ` 1.0×` ![ ](bars.svg#text_canvas)     | [` 161 KB`](snapshots/text_canvas.png)     |
| *@napi-rs/canvas*      | `  19 ms` | ` 1.2×` ![ ](bars.svg#text_napi)       | [` 155 KB`](snapshots/text_napi.png)       |
| *skia-canvas (serial)* | `  14 ms` | ` 1.7×` ![ ](bars.svg#text_skia-sync)  | [` 127 KB`](snapshots/text_skia-sync.png)  |
| *skia-canvas (async)*  | `   4 ms` | ` 5.7×` ![ ](bars.svg#text_skia-async) | [` 127 KB`](snapshots/text_skia-async.png) |