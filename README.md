# tok-sim — Tokens/Second Visual Simulator

A visual simulator that shows what **X tokens/sec** actually looks like when generating text. Pick a style, set a rate, and watch characters stream out at the speed of your choice. Compare two side by side.

## Features

- **Text style picker** — Choose from prose, code, math, markdown, JSON, and shell. Each style produces character-appropriate generated text with a different character-to-token ratio.
- **Configurable token rate** — Set any rate from 1 to 500 tokens/sec with quick-presets for common values (5, 10, 20, 50, 100, 200).
- **Configurable output length** — Choose how many tokens to generate (10–5000).
- **1 or 2 generation windows** — Toggle between single-window and side-by-side dual-window mode. In dual mode, each window has its own independent style, rate, and length settings.
- **Live stats** — Real-time token count, elapsed time, and estimated remaining time.
- **Terminal aesthetic** — Dark theme with scanline overlay, JetBrains Mono font, and green accent colors matching the [DGX Spark Bench](https://jvr0x.github.io/dgx-spark-bench/).

## Usage

Open `index.html` directly in a browser — no build step, no server required. Works via `file://` protocol.

## Text Styles

| Style | Char/Token Ratio | Description |
|-------|-----------------|-------------|
| Prose | ~1.3 | Natural language text |
| Code | ~2.5 | Programming code (Rust, Python, JS) |
| Math | ~1.8 | Mathematical expressions and formulas |
| Markdown | ~1.4 | Markdown-formatted documentation |
| JSON | ~2.0 | JSON data structures |
| Shell | ~2.2 | Shell scripts and commands |

## Architecture

Single-file app — `index.html` contains everything: HTML structure, CSS styling, and JavaScript logic. No external dependencies beyond the Google Fonts import for JetBrains Mono.

## License

MIT — see [LICENSE](LICENSE) for details.

## Links

- [Source code](https://github.com/jvr0x/tok-sim)
- [jvr0x.github.io](https://jvr0x.github.io)
- [DGX Spark LLM Bench](https://jvr0x.github.io/dgx-spark-bench/)
