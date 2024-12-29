#!/usr/bin/env -S deno test -A --watch

import {assertEquals} from 'jsr:@std/assert/equals'
import {expect} from 'jsr:@std/expect'
import {BitSet} from './bitSet.ts'

Deno.test('BitSet.Instance from hex/bin', () => {
  const testBits = BitSet.Instance({a: 0, b: 1, c: 2, d: 2})

  assertEquals(testBits.fromBin('11111111').value, 255)
  assertEquals(testBits.fromHex('ffffffff').value, 2 ** 32 - 1)
  assertEquals(
    testBits.fromBinBigInt('0b11111111111111111111111111111111').value,
    2n ** 32n - 1n
  )
  assertEquals(
    testBits.fromHexBigInt('0xffffffffffffffff').value,
    2n ** 64n - 1n
  )
})

Deno.test('BitSet', () => {
  const bits = new BitSet({a: 1, b: 2})
  bits //
    .set('a')
    .set('b')

  assertEquals(bits.has('a'), true)
  assertEquals(bits.has('b'), true)

  bits.toggle('a')
  assertEquals(bits.has('a'), false)

  bits.delete('b')
  assertEquals(bits.has('b'), false)

  bits.set(3)
  assertEquals(bits.has(3), true)

  bits.clear()
  assertEquals(bits.has('a'), false)
  assertEquals(bits.has('b'), false)
  assertEquals(bits.has(3), false)
})

Deno.test('BitSet.Instance', () => {
  const testBits = BitSet.Instance({a: 0, b: 1, c: 2, d: 3})

  const bits = testBits.now()
  const bits2 = testBits.now()

  assertEquals(bits.options, bits2.options)

  bits.set('a')
  assertEquals(bits.value, 1) // 1

  bits.set('b')
  assertEquals(bits.value, 3) // 11

  assertEquals(bits.has('a'), true)
  assertEquals(bits.has('c'), false)
  assertEquals(Object.fromEntries(bits), {a: true, b: true, c: false, d: false})
})

Deno.test('BitSet.Instance enum', () => {
  enum Flags {
    a = 0,
    b = 1,
    c = 2,
  }

  const testBits = BitSet.Instance(Flags)
  const bits = testBits.now()

  bits.set(Flags.a)
  bits.set('b')
  bits.set(Flags.c)

  assertEquals(bits.value, 7) // 111
})

Deno.test('BitSet', async (t) => {
  await t.step('initial value types', () => {
    const a = new BitSet({}, 0)
    assertEquals(a.value, 0)

    const b = new BitSet({}, 1n)
    assertEquals(b.value, 1n)

    const c = new BitSet({a: 2})
    c.get(1)
    c.get('a')
    assertEquals(a.value, 0)
  })

  await t.step('set/toggle/get/has number bit', () => {
    const a = new BitSet({})
    a.set(0)
    a.set(1).set(2).set(3)
    a.toggle(1)
    a.toggle(2)

    assertEquals(a.value, 9) // 1001

    assertEquals(a.get(0), 1) // 1001
    assertEquals(a.get(1), 0) // 1001
    assertEquals(a.get(2), 0) // 1001
    assertEquals(a.get(3), 8) // 1001

    assertEquals(a.has(0), true) // 1001
    assertEquals(a.has(1), false) // 1001
    assertEquals(a.has(2), false) // 1001
    assertEquals(a.has(3), true) // 1001
  })

  await t.step('set/toggle/get/has bigint bit', () => {
    const a = new BitSet({}, 0n)
    a.set(0)
    a.set(1).set(2).set(3)
    a.toggle(1)
    a.toggle(2)

    a.set(100)

    assertEquals(a.value, 1267650600228229401496703205385n) // 1..1001

    assertEquals(a.get(0), 1n)
    assertEquals(a.get(1), 0n)
    assertEquals(a.get(2), 0n)
    assertEquals(a.get(3), 8n)

    assertEquals(a.has(0), true)
    assertEquals(a.has(1), false)
    assertEquals(a.has(2), false)
    assertEquals(a.has(3), true)
  })

  await t.step('entries/iterator', () => {
    const a = new BitSet({a: 0, b: 1, c: 2})
    a.set('a')
    a.set('c')

    assertEquals(Object.fromEntries(a), {a: true, b: false, c: true})
    assertEquals(Object.fromEntries(a.entries()), {
      a: true,
      b: false,
      c: true,
    })
    assertEquals(Array.from(a.entries(true)), [
      [0, true],
      [1, false],
      [2, true],
    ])
    assertEquals(
      new Map(a),
      new Map([
        ['a', true],
        ['b', false],
        ['c', true],
      ])
    )
    assertEquals(
      new Map(a.entries(true)),
      new Map([
        [0, true],
        [1, false],
        [2, true],
      ])
    )
  })

  await t.step('toJSON', () => {
    const a = BitSet.Instance()
    const number = a.fromHex('0xffffffff')
    const bigint = a.fromHexBigInt('0xffffffffffffffff')

    assertEquals(number.toJSON(), 2 ** 32 - 1)
    assertEquals(bigint.toJSON(), '18446744073709551615')

    assertEquals(JSON.stringify({number}), '{"number":4294967295}')
    assertEquals(JSON.stringify({bigint}), '{"bigint":"18446744073709551615"}')
  })
})

Deno.test('BitSet from obj', () => {
  const fooBarFlags = BitSet.Instance({
    foo: 1,
    bar: 2,
    baz: 31,

    v1: 11,
    v2: 12,
    v3: 13,
    v4: 14,
    v5: 15,
    v6: 15,
  })

  const fooBar = fooBarFlags.from({
    bar: true,
    baz: true,

    v1: 1,
    v2: 0,
    v3: '',
    v4: NaN,
    v5: undefined,
    v6: null,
  })

  expect(Object.fromEntries(fooBar)).toEqual({
    foo: false,
    bar: true,
    baz: true,
    v1: true,
    v2: false,
    v3: false,
    v4: false,
    v5: false,
    v6: false,
  })
})

Deno.test('BitSet fromBigInt obj', () => {
  const fooBarFlags = BitSet.Instance({
    foo: 1,
    bar: 2,
    baz: 31,

    v1: 111,
    v2: 112,
    v3: 113,
    v4: 114,
    v5: 115,
    v6: 115,
  })

  const fooBar = fooBarFlags.fromBigInt({
    bar: true,
    baz: true,

    v1: 1,
    v2: 0,
    v3: '',
    v4: NaN,
    v5: undefined,
    v6: null,
  })

  expect(fooBar.value).toEqual(2596148429267413814265250312093700n)
  expect(Object.fromEntries(fooBar)).toEqual({
    foo: false,
    bar: true,
    baz: true,
    v1: true,
    v2: false,
    v3: false,
    v4: false,
    v5: false,
    v6: false,
  })
})

/* {
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
} */
