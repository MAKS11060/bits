# Bits manipulation utility

[![JSR][JSR badge]][JSR]
[![CI](https://github.com/MAKS11060/bits/actions/workflows/ci.yml/badge.svg)](https://github.com/MAKS11060/bits/actions/workflows/ci.yml)

 <!-- https://jsr.io/docs/badges -->
[JSR]: https://jsr.io/@maks11060/bits
[JSR badge]: https://jsr.io/badges/@maks11060/bits

## Usage

### Bits
```ts
import {Bits} from '@maks11060/bits'

const Flags = Bits.Instance({
  option_1: 0,
  option_2: 1,
  option_3: 2,
})

const flags = Flags.now()

flags.set(Flags.flags.option_1)
flags.has(Flags.flags.option_2)
flags.toggle(Flags.flags.option_3)

flags.value   // 5
flags.toBin() // '101'
```

also works with `enum`
```ts
import {Bits} from '@maks11060/bits'

enum Flags {
  flag1 = 0,
  flag2 = 1,
  flag3 = 2,
}
const bits = new Bits<Flags>()

bits.set(Flags.flag1)
bits.clear(Flags.flag2)
bits.toggle(Flags.flag3)
bits.value   // 5
bits.toBin() // 101
```

### BitsN (using bigint)
```ts
import {BitsN} from '@maks11060/bits'

const Flags = BitsN.Instance({
  option_1: 0n,
  option_2: 1n,
  option_3: 2n,
})
const flags = Flags.now()

flags.set(Flags.flags.option_1)
flags.has(Flags.flags.option_2)
flags.toggle(Flags.flags.option_3)
```
```ts
import {BitsN} from '@maks11060/bits'

const Flags = {
  flag1: 0n,
  flag2: 1n,
  flag3: 2n,
} as const
const bits = BitsN.from<typeof Flags>(0)

bits.set(Flags.flag1)
bits.clear(Flags.flag2)
bits.toggle(Flags.flag3)
bits.value   // 5n
bits.toBin() // 101n
```
