/**
 * @module
 *
 * This module contains a class for working with bits
 *
 * @example Bits.Instance()
 * ```ts
 * const Flags = Bits.Instance({
 *   option_1: 0,
 *   option_2: 1,
 *   option_3: 2,
 * })
 *
 * const flags = Flags.now()
 *
 * flags.set(Flags.flags.option_1)
 * flags.has(Flags.flags.option_2)
 * flags.toggle(Flags.flags.option_3)
 * ```
 *
 * @example Use `enum`
 * ```ts
 * import {Bits} from '@maks11060/bits'
 *
 * enum Flags {
 *   flag1 = 0,
 *   flag2 = 1,
 *   flag3 = 2,
 * }
 *
 * const bits = Bits.from<Flags>(0)
 *
 * bits.set(Flags.flag1)
 * bits.clear(Flags.flag2)
 * bits.toggle(Flags.flag3)
 * bits.value   // 5
 * bits.toBin() // 101
 * ```
 */

type toUnion<T extends number | Record<string, number>> = T extends number
  ? T
  : T[keyof T]

/**
 * A utility class for working with bitsets.
 *
 * @example
 * ```ts
 * enum Flags {
 *   flag1 = 0,
 *   flag2 = 1,
 *   flag3 = 2,
 * }
 * const b = new Bits<Flags>()
 *
 * b.set(Flags.flag1)
 * b.clear(Flags.flag2)
 * b.toggle(Flags.flag3)
 * b.value   // 5
 * b.toBin() // 101
 * ```
 */
export class Bits<Flags extends number | Record<string, number> = number> {
  #value: number

  /**
   * Create a new {@linkcode Bits} instance
   * @param {number} [value=0] - The initial value of the bits
   */
  constructor(value: number = 0) {
    this.#value = value
  }

  /**
   * Get the current value of the bits
   * @returns {number} The current value of the bits
   */
  get value(): number {
    return this.#value
  }

  /**
   * Creates a new instance of the Bits class with a set of predefined flags.
   * @param {T} flags - The predefined flags to use.
   * @returns {{ flags: T, now: (value?: number) => Bits<T> }} An object containing the predefined flags and a function for creating new instances of the Bits class with those flags.
   */
  static Instance<const T extends Record<string, number>>(
    flags: T
  ): {
    flags: T
    now(value?: number): Bits<T>
  } {
    return {
      flags,
      now(value: number = 0) {
        return new Bits<T>(value)
      },
    }
  }

  /**
   * Create a new {@linkcode Bits} instance from a **number**
   *
   * @example
   * ```ts
   * const b = Bits.from(255)
   * b.value   // 255
   * b.toBin() // 11111111
   * ```
   *
   * @param {number} value - The initial value of the bits
   * @returns {Bits} A new {@linkcode Bits} instance
   */
  static from<T extends number>(value: number): Bits<T> {
    return new this<T>(value)
  }

  /**
   * Create a new {@linkcode Bits} instance from a **binary** string
   *
   * @example
   * ```ts
   * const b = Bits.from('10101010')
   * b.value // 170
   * ```
   *
   * @param {string} value - The initial value of the bits in binary representation
   * @returns {Bits} A new {@linkcode Bits} instance
   */
  static fromBin<T extends number>(value: string): Bits<T> {
    return new this<T>(parseInt(value, 2))
  }

  /**
   * Create a new {@linkcode Bits} instance from a **hexadecimal** string
   *
   * @example
   * ```ts
   * const b = Bits.fromHex('ff')
   * b.value // 255
   * ```
   *
   * @param {string} value - The initial value of the bits in hexadecimal representation
   * @returns {Bits} A new {@linkcode Bits} instance
   */
  static fromHex<T extends number>(value: string): Bits<T> {
    return new this<T>(parseInt(value, 16))
  }

  /**
   * Get the value of a single `bit` at a given position
   *
   * @example
   * ```ts
   * Bits.bit(4) // 16
   * ```
   *
   * @param {number} n - The position of the bit
   * @returns {number} The value of the bit at position n
   */
  static bit(n: number): number {
    return 1 << n
  }

  /**
   * Check if a bit is set at a given position
   *
   * @example
   * ```ts
   * const b = new Bits(0)
   * b.has(1) // false
   * ```
   *
   * @param {toUnion<Flags>} bit - The position of the bit
   * @returns {boolean} True if the bit is set, false otherwise
   */
  has(bit: toUnion<Flags>): boolean {
    return (this.#value & Bits.bit(bit)) !== 0
  }

  /**
   * Set a bit at a given position
   * @example
   * ```ts
   * const b = new Bits(0)
   * b.set(0) // 0b0001
   * b.set(1) // 0b0011
   * b.set(3) // 0b1011
   * ```
   *
   * @param {toUnion<Flags>} bit - The position of the bit
   * @returns {Bits} The current {@linkcode Bits} instance
   */
  set(bit: toUnion<Flags>): Bits<Flags> {
    this.#value |= Bits.bit(bit)
    return this
  }

  /**
   * Write multiple bits at given positions
   * @example
   * ```ts
   * const b = new Bits(0)
   * b.write(2, 4, 6) // 0b1010100
   * b.value // 84
   * ```
   *
   * @param {...toUnion<Flags>[]} bits - The positions of the bits to write
   * @returns {Bits} The current {@linkcode Bits} instance
   */
  write(...bits: toUnion<Flags>[]): Bits<Flags> {
    this.#value |= bits.reduce((acc, bit) => acc | Bits.bit(bit), 0)
    return this
  }

  /**
   * Clear a bit at a given position
   *
   * @example
   * ```ts
   * const b = new Bits(255)
   * b.clear(1) // 0b10
   * ```
   * @param {toUnion<Flags>[]} bit - The position of the bit
   * @returns {Bits} The current {@linkcode Bits} instance
   */
  clear(bit: toUnion<Flags>): Bits<Flags> {
    this.#value &= ~Bits.bit(bit)
    return this
  }

  /**
   * Toggle a bit at a given position
   *
   * @example
   * ```ts
   * const b = new Bits(0)
   * b.toggle(1) // 0b10
   * ```
   *
   * @param {toUnion<Flags>} bit - The position of the bit
   * @returns {Bits} The current {@linkcode Bits} instance
   */
  toggle(bit: toUnion<Flags>): Bits<Flags> {
    this.#value ^= Bits.bit(bit)
    return this
  }

  /**
   * Convert the bits to a binary string representation
   *
   * @example
   * ```ts
   * const b = Bits.from(255)
   * b.toBin() // 11111111
   * ```
   *
   * @returns {string} The binary string representation of the bits
   */
  toBin(): string {
    return this.#value.toString(2)
  }

  /**
   * Convert the bits to a hexadecimal string representation
   *
   * @example
   * ```ts
   * const b = Bits.from(255)
   * b.toHex() // ff
   * ```
   *
   * @returns {string} The hexadecimal string representation of the bits
   */
  toHex(): string {
    return this.#value.toString(16)
  }

  /**
   * Convert the bits to a JSON representation
   *
   * @example
   * ```ts
   * const flags = Bits.from(255)
   * console.log(JSON.stringify({flags})) // "{"flags": 255}"
   * ```
   *
   * @returns {number} The decimal value of the bits
   */
  toJSON(): number {
    return this.#value
  }
}
