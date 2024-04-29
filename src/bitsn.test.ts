#!/usr/bin/env -S deno test --watch

import {assertEquals} from 'https://deno.land/std/assert/mod.ts'
import {BitsN} from '../mod.ts'

Deno.test('BitsN from', () => {
  const b = new BitsN(1234)
  assertEquals(b.value, 1234n)

  assertEquals(BitsN.from(b.value).value, 1234n)
  assertEquals(BitsN.fromBin(b.toBin()).value, 1234n)
  assertEquals(BitsN.fromHex(b.toHex()).value, 1234n)
  assertEquals(BitsN.from(JSON.parse(JSON.stringify(b))).value, 1234n)
})

Deno.test('BitsN toBin/toHex/toJSON', () => {
  const b = new BitsN(1234)

  assertEquals(b.value, 1234n)
  assertEquals(b.toBin(), '10011010010')
  assertEquals(b.toHex(), '4d2')

  assertEquals(b.toJSON(), '1234')
  assertEquals(JSON.stringify({b}), '{"b":"1234"}')
})

Deno.test('BitsN set/toggle/clear', () => {
  const b = new BitsN(0)
  assertEquals(b.toBin(), '0')

  b.set(2n)
  b.set(3n)
  b.set(4n)
  b.set(5n)
  assertEquals(b.toBin(), '111100')

  b.toggle(2n)
  b.toggle(3n)
  assertEquals(b.toBin(), '110000')

  b.clear(4n)
  assertEquals(b.toBin(), '100000')

  b.clear(4n)
  assertEquals(b.toBin(), '100000')
})

Deno.test('BitsN write', () => {
  const b = new BitsN(0)
  assertEquals(b.toBin(), '0')

  b.write(2n, 4n, 6n)
  assertEquals(b.toBin(), '1010100')
})
Deno.test('BitsN write enum', () => {
  const Flags = {
    Read: 0n,
    Write: 1n,
    Execute: 2n,
  } as const

  const b = new BitsN<typeof Flags>(0)
  assertEquals(b.toBin(), '0')

  b.write(Flags.Read, Flags.Execute)
  assertEquals(b.toBin(), '101')
})

Deno.test('BitsN has', () => {
  const b = BitsN.fromBin('11010011')

  assertEquals(b.has(0n), true)
  assertEquals(b.has(1n), true)
  assertEquals(b.has(2n), false)
  assertEquals(b.has(3n), false)
  assertEquals(b.has(4n), true)
  assertEquals(b.has(5n), false)
  assertEquals(b.has(6n), true)
  assertEquals(b.has(7n), true)
})

Deno.test('BitsN enum', () => {
  const Flags = {
    flag1: 0n,
    flag2: 1n,
    flag3: 2n,
  } as const
  const b = new BitsN<typeof Flags>()
  b.set(Flags.flag1)
  b.clear(Flags.flag2)
  b.toggle(Flags.flag3)
  assertEquals(b.value, 5n)
})

Deno.test('BitsN.bit()', () => {
  assertEquals(BitsN.bit(4), 16n)
  assertEquals(BitsN.bit(7), 128n)
})
