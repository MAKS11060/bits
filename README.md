# Bits manipulation utility

[![JSR][JSR badge]][JSR]
[![CI](https://github.com/MAKS11060/bits/actions/workflows/ci.yml/badge.svg)](https://github.com/MAKS11060/bits/actions/workflows/ci.yml)

 <!-- https://jsr.io/docs/badges -->
[JSR]: https://jsr.io/@maks11060/bits
[JSR badge]: https://jsr.io/badges/@maks11060/bits

## Usage

### Install
```ts
// deno add jsr:@maks11060/bits
import {BitSet} from '@maks11060/bits'

// or
import {BitSet} from 'jsr:@maks11060/bits'
```

#### Create Instance with `flags`
```ts
const bitOptions = BitSet.Instance({
  option_1: 0,
  option_2: 1,
  option_3: 2,
})

const flags = bitOptions.now(0) // `BigInt` support when specifying the initial value of '0n'

flags.set('option_1') // use autocomplete for name flags
flags.set(1) // set bit(n)
flags.set(flags.options.option_3)

flags.value // 7 / 0b111

flags.has(0) // true
flags.delete(1) // 5 / 0b101
flags.toggle('option_3') // 1 / 0b001

// Support iterator
for (const [flag, value] of flags.entries()) {
  console.log(`${flag}: ${value}`)
}
// option_1: true
// option_2: false
// option_3: false

for (const [bit, value] of flags.entries(true)) {
  console.log(`${bit}: ${value}`)
}
// 0: true

console.log(new Map(flags))               // options => value
console.log(new Map(flags.entries(true))) // bit     => value
console.log(Object.fromEntries(flags))    // {option_1: true, option_2: false, option_3: false}
```

#### Create Instance with `enums`
```ts
enum UserAccountFlags {
  isAdmin = 0,
  verifyUser = 1,
  verifyEmail = 2,
}

const UserFlags = BitSet.Instance(UserAccountFlags)
const userFlags = UserFlags.now()

userFlags.set('isAdmin')
userFlags.set('verifyUser')

const user = {
  username: 'Admin',
  flags: userFlags,
}

console.log(JSON.stringify(user)) // {"username":"Admin","flags":3}
```

#### Usage without `flags`
```ts
const bitOptions = BitSet.Instance()
const flags = bitOptions.now(0n)

flags.set(0)
flags.set(1)
flags.set(30)
flags.set(100)

flags.has(30)

console.log(flags.value) // 1267650600228229401497776947203n
```

## `API`
```ts
const Flags = BitSet.Instance()

Flags.now()
Flags.now(0n)
Flags.fromBin('11111111') // 255
Flags.fromHex('ff') // 255
Flags.fromBinBigInt('0b11111111111111111111111111111111') // 2 ^ 32 - 1
Flags.fromHexBigInt('0xffffffffffffffff') // 2 ^ 64 - 1

const Flags2 = BitSet.Instance({a: 0, b: 1, c: 2})
const flags2 = Flags2.now()

flags2.set(0)
flags2.set('b')
flags2.set(flags2.options.c)

flags2.has(0) // true
flags2.has('b') // true
flags2.has(flags2.options.c) // true

flags2.toggle('a') // switch bit

flags2.delete('b')

flags2.clear() // value = 0

flags2.toJSON() // for serialization in JSON.Stringify

flags2.write('a', 'b', 'c')

flags2.value // get typed value (number | bigint)
```
