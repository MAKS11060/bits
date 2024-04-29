/**
 * @module
 *
 * This module contains a class for working with bits (using bigint)
 *
 * ```ts
 * import {BitsN} from '@maks11060/bits'
 *
 * const Flags = {
 *   flag1: 0n,
 *   flag2: 1n,
 *   flag3: 2n,
 * } as const
 *
 * const b = BitsN.from<typeof Flags>(0)
 * b.set(Flags.flag1)
 * b.clear(Flags.flag2)
 * b.toggle(Flags.flag3)
 * b.value   // 5
 * b.toBin() // 101
 * ```
 */

type toUnion<T extends bigint | Record<string, bigint>> = T extends bigint
  ? T
  : T[keyof T]

/**
 * Tool for working with bits. BigInt version
 *
 * @example
 * ```ts
 * const Flags = {
 *   flag1: 0n,
 *   flag2: 1n,
 *   flag3: 2n,
 * } as const
 * const b = BitsN.from<typeof Flags>(0)
 *
 * b.set(Flags.flag1)
 * b.clear(Flags.flag2)
 * b.toggle(Flags.flag3)
 * b.value   // 5n
 * b.toBin() // 101n
 * ```
 */
export class BitsN<Flags extends bigint | Record<string, bigint>> {
  #value: bigint

  constructor(value: string | number | bigint = 0n) {
    this.#value = BigInt(value)
  }

  /**
   * Return bigint
   */
  get value(): bigint {
    return this.#value
  }

  /**
   * {@linkcode BitsN} from **number**
   * @example
   * ```ts
   * const b = Bits.from(255)
   * b.value.toString(2) // 11111111
   * ```
   */
  static from<T extends bigint | Record<string, bigint>>(
    value: string | number | bigint
  ): BitsN<T> {
    return new this<T>(value)
  }

  /**
   * {@linkcode BitsN} from **Binary** string
   * @example
   * ```ts
   * const b = Bits.from('10101010')
   * b.value // 170n
   * ```
   */
  static fromBin<T extends bigint | Record<string, bigint>>(
    value: string
  ): BitsN<T> {
    return new this<T>(BigInt(`0b` + value))
  }

  /**
   * {@linkcode BitsN} from **HEX** string
   * @example
   * ```ts
   * const b = Bits.fromHex('ff')
   * b.value // 255n
   * ```
   */
  static fromHex<T extends bigint | Record<string, bigint>>(
    value: string
  ): BitsN<T> {
    return new this<T>(BigInt(`0x` + value))
  }

  /**
   * Get bit(n)
   * @example
   * ```ts
   * Bits.bit(4n) // 16
   * ```
   */
  static bit(n: bigint | number): bigint {
    return 1n << BigInt(n)
  }

  /**
   * Check is set bit
   * @example
   * ```ts
   * const b = new Bits(0n)
   * b.has(1n) // false
   * ```
   */
  has(bit: toUnion<Flags>): boolean {
    return (this.#value & BitsN.bit(bit)) !== 0n
  }

  /**
   * Set bit
   * @example
   * ```ts
   * const b = new Bits(0n)
   * b.set(0n) // 0b0001n
   * b.set(1n) // 0b0011n
   * b.set(3n) // 0b1011n
   * ```
   */
  set(bit: toUnion<Flags>): BitsN<Flags> {
    this.#value |= BitsN.bit(bit)
    return this
  }

  /**
   * Write bits
   * @example
   * ```ts
   * const b = new Bits(0n)
   * b.write(2, 4, 6) // 0b1010100n
   * b.value // 84n
   * ```
   */
  write(...bits: toUnion<Flags>[]): BitsN<Flags> {
    this.#value |= bits.reduce((acc, bit) => acc | BitsN.bit(bit), 0n)
    return this
  }

  /**
   * Remove bit
   * @example
   * ```ts
   * const b = new Bits(255n)
   * b.clear(1) // 0b10n
   * ```
   */
  clear(bit: toUnion<Flags>): BitsN<Flags> {
    this.#value &= ~BitsN.bit(bit)
    return this
  }

  /**
   * Inverse bit
   * @example
   * ```ts
   * const b = new Bits(0)
   * b.toggle(1) // 0b10
   * ```
   */
  toggle(bit: toUnion<Flags>): BitsN<Flags> {
    this.#value ^= BitsN.bit(bit)
    return this
  }

  /**
   * @example
   * ```ts
   * const b = Bits.from(255)
   * b.toBin() // 11111111
   * ```
   */
  toBin(): string {
    return this.#value.toString(2)
  }

  /**
   * @example
   * ```ts
   * const b = Bits.from(255)
   * b.toHex() // ff
   * ```
   */
  toHex(): string {
    return this.#value.toString(16)
  }

  /**
   * @example
   * ```ts
   * const flags = Bits.from(255n)
   * console.log(JSON.stringify({flags})) // "{"flags": ""}"
   * ```
   */
  toJSON(): string {
    return this.#value.toString()
  }
}
