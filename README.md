# The Hooks Toolkit (Typescript)

## Global Prerequsits

`$ npm i -g c2wasm-cli xrpld-cli`

## Compile Hooks

Run this command to locally compile an XRPL Hook source file (inside ./contracts) from .c to .wasm code:

`$ yarn run build:hooks`

Here is what each command does in the background:
1. `wasmcc` - compiles a Hook source file (C code) to WebAssembly (WASM) code. For example, `./contracts/base.c` compiles to `./build/base.wasm`
2. `wasm-opt` - optimizes the WASM code `./build/base.wasm`
3. `hook-cleaner` - cleans it by removing unnecessary additional exports
4. `guard_checker` - this checks if any guard violation has occurred in the Hooks code before submitting it in `SetHook` transaction. For more information, visit [this link](https://xrpl-hooks.readme.io/docs/loops-and-guarding)
5. Converts the compiled WASM to hexadecimal characters then submits it as payload in a `SetHook` transaction

You can also build a single hook with;

`$ yarn run build:hook contracts/toolbox/keylet_hook_state_dir.c build`

## Debug the test env

`tail -f xrpld/log/debug.log | grep HookTrace`

## Test the Hook Library

Run Unit tests

`$ yarn run test:unit`

Before you can run the integration tests you must have a standalone rippled server running.

- Full env with explorer:

- - `$ xrpld-cli up:standalone`

- Docker standalone only:

- - `$ docker run -p 5005:5005 -p 6006:6006 -it gcr.io/thelab-924f3/dangell7-hooksv3d-standalone:latest`

Run Integration tests

`$ yarn run test:integration`

Run single Integration test

`$ yarn run test:integration test/integration/toolbox/base.test.ts`

## Adding a new Hook

1. Add the hook.c file into the `contracts` directory
4. Build the hooks `$ yarn run build:hooks`
3. Copy the hook `base.test.ts` template into the correct folder. (audited/toolbox)
4. Test the hook using:
`$ yarn run test:integration test/integration/audited/myHook.test.ts`
