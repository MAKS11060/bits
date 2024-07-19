#!/usr/bin/env -S deno test --watch

import {assertEquals} from 'jsr:@std/assert'
import {Bits} from '../mod.ts'

Deno.test('Bits Instance', () => {
  const Flags = Bits.Instance({
    option_1: 0,
    option_2: 1,
    option_3: 2,
  })

  const flags = Flags.now()

  flags.set(Flags.flags.option_1)
  flags.has(Flags.flags.option_2)
  flags.toggle(Flags.flags.option_3)

  assertEquals(flags.value, 5)
  assertEquals(flags.toBin(), '101')
})

Deno.test('Bits from', () => {
  const b = new Bits(1234)
  assertEquals(b.value, 1234)

  assertEquals(Bits.from(b.value).value, 1234)
  assertEquals(Bits.fromBin(b.toBin()).value, 1234)
  assertEquals(Bits.fromHex(b.toHex()).value, 1234)
  assertEquals(Bits.from(JSON.parse(JSON.stringify(b))).value, 1234)
})

Deno.test('Bits toBin/toHex/toJSON', () => {
  const b = new Bits(1234)

  assertEquals(b.value, 1234)
  assertEquals(b.toBin(), '10011010010')
  assertEquals(b.toHex(), '4d2')

  assertEquals(b.toJSON(), 1234)
  assertEquals(JSON.stringify({b}), '{"b":1234}')
})

Deno.test('Bits set/toggle/clear', () => {
  const b = new Bits(0)
  assertEquals(b.toBin(), '0')

  b.set(2)
  b.set(3)
  b.set(4)
  b.set(5)
  assertEquals(b.toBin(), '111100')

  b.toggle(2)
  b.toggle(3)
  assertEquals(b.toBin(), '110000')

  b.clear(4)
  assertEquals(b.toBin(), '100000')

  b.clear(4)
  assertEquals(b.toBin(), '100000')
})

Deno.test('Bits write', () => {
  const b = new Bits(0)
  assertEquals(b.toBin(), '0')

  b.write(2, 4, 6)
  assertEquals(b.toBin(), '1010100')
})

Deno.test('Bits write enum', () => {
  enum Flags {
    Read,
    Write,
    Execute,
  }

  const b = new Bits<Flags>(0)
  assertEquals(b.toBin(), '0')

  b.write(Flags.Read, Flags.Execute)
  assertEquals(b.toBin(), '101')
})

Deno.test('Bits has', () => {
  const b = Bits.fromBin('11010011')

  assertEquals(b.has(0), true)
  assertEquals(b.has(1), true)
  assertEquals(b.has(2), false)
  assertEquals(b.has(3), false)
  assertEquals(b.has(4), true)
  assertEquals(b.has(5), false)
  assertEquals(b.has(6), true)
  assertEquals(b.has(7), true)
})

Deno.test('Bits enum', () => {
  enum Flags {
    flag1,
    flag2,
    flag3,
  }
  const b = new Bits<Flags>()

  b.set(Flags.flag1)
  b.clear(Flags.flag2)
  b.toggle(Flags.flag3)

  assertEquals(b.value, 5)
})

Deno.test('Bits.bit()', () => {
  assertEquals(Bits.bit(4), 16)
  assertEquals(Bits.bit(7), 128)
})
