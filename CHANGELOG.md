## [1.0.14] - 2024-03-13

### Added:
- `wasmToHex` utility function for building wasm outside of test env

### Updated:
- xrpl.js: ^2.7.3-alpha.25 -> ^2.7.3-alpha.26

## [1.0.15] - 2024-05-20

### Added:
- `submitBatch` utility function to submit a batch of txns

### Removed:
- `chai` removed the chai assert dependency

### Updated:
- `Account` reduce account generate costs @tequ

## [1.0.16] - 2024-05-21

### Fixed:
- exports of the `xrpl-helpers` and `binary-models` utils

### Updated:
- xrpl.js: ^2.7.3-alpha.26 -> ^2.7.3-alpha.26

## [2.0.0] - 2024-08-05

### Added:
- `jshooks` new functionality for js hooks

### Added:
- `params.debugStream` debug stream option when submitting hooks. Debug will stream to the console and create a debug.log file in the root of the repo.
- `@transia/hooks-toolkit-cli` we now use the hooks-toolkit-cli to build all wasm hooks

### Updated:
- `RIPPLED_ENV -> XRPLD_ENV` we updated the env name for selecting the txn submission type
- `C2WASM_CLI_HOST -> HOOKS_COMPILE_HOST` we now use the HOOKS_COMPILE_HOST for all wasm builds

### Updated:
- xrpl.js: ^2.7.3-alpha.26 -> ^2.7.3-alpha.28
