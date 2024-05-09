# Bits utils

 <!-- https://jsr.io/docs/badges -->
[JSR]: https://jsr.io/@maks11060/bits
[JSR badge]: https://jsr.io/badges/@maks11060/bits
<!-- https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/adding-a-workflow-status-badge -->
[CI]: https://github.com/maks11060/bits/actions/workflows/ci.yml
[CI badge]: https://github.com/maks11060/bits/actions/workflows/ci.yml/badge.svg

Bit manipulation utility

### Bits
```ts
import {Bits} from '@maks11060/bits'

enum Flags {
  flag1 = 0,
  flag2 = 1,
  flag3 = 2,
}
const b = new Bits<Flags>()

b.set(Flags.flag1)
b.clear(Flags.flag2)
b.toggle(Flags.flag3)
b.value   // 5
b.toBin() // 101
```

### BitsN (using bigint)
```ts
import {BitsN} from '@maks11060/bits'

const Flags = {
  flag1: 0n,
  flag2: 1n,
  flag3: 2n,
} as const
const b = BitsN.from<typeof Flags>(0)

b.set(Flags.flag1)
b.clear(Flags.flag2)
b.toggle(Flags.flag3)
b.value   // 5n
b.toBin() // 101n
```
