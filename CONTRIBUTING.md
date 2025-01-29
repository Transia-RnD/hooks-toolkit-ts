# The Hooks Toolkit (Typescript)

## Global Prerequsits

`$ npm i -g @transia/hooks-cli`

## Compile Hooks

Run this command to locally compile an XAHL Hook source file (inside ./contracts) from .c to .wasm code:

`$ hooks-cli compile-c contracts build`

You can also build a single hook with;

`$ hooks-cli compile-c contracts/toolbox/base.c build`

## Test the Hook Library

Run Unit tests

`$ yarn run test:unit`

Before you can run the integration tests you must have a standalone rippled server running.

- Full env with explorer:

- - `$ xrpld-netgen up:standalone --version=2024.7.17-jshooks+933`

- Docker standalone only:

- - `$ docker run -p 5005:5005 -p 6006:6006 -it transia/xahaud:latest`

Run Integration tests

`$ yarn run test:integration`

Run single Integration test

`$ yarn run test:integration test/integration/toolbox/base.test.ts`

## Debug the test env

`xrpld-netgen logs:standalone`

## Adding a new Hook

1. Add the hook.c file into the `contracts` directory
4. Build the hooks `$ yarn run build:hooks`
3. Copy the hook `base.test.ts` template into the correct folder. (audited/toolbox)
4. Test the hook using:
`$ yarn run test:integration test/integration/audited/myHook.test.ts`
