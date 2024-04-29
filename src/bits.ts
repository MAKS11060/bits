/**
 * @module
 *
 * This module contains a class for working with bits
 *
 * ```ts
 * import {Bits} from '@maks11060/bits'
 *
 * enum Flags {
 *   flag1 = 0,
 *   flag2 = 1,
 *   flag3 = 2,
 * }
 *
 * const b = Bits.from(0)
 * b.set(Flags.flag1)
 * b.clear(Flags.flag2)
 * b.toggle(Flags.flag3)
 * b.value   // 5
 * b.toBin() // 101
 * ```
 */

/**
 * Tool for working with bits
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
export class Bits<Flags extends number = number> {
  #value: number

  constructor(value: number = 0) {
    this.#value = value
  }

  /**
   * Return number
   */
  get value(): number {
    return this.#value
  }

  /**
   * {@linkcode Bits} from **number**
   * @example
   * ```ts
   * const b = Bits.from(255)
   * b.value.toString(2) // 11111111
   * ```
   */
  static from<T extends number>(value: number): Bits<T> {
    return new this<T>(value)
  }

  /**
   * {@linkcode Bits} from **Binary** string
   * @example
   * ```ts
   * const b = Bits.from('10101010')
   * b.value // 170
   * ```
   */
  static fromBin<T extends number>(value: string): Bits<T> {
    return new this<T>(parseInt(value, 2))
  }

  /**
   * {@linkcode Bits} from **HEX** string
   * @example
   * ```ts
   * const b = Bits.fromHex('ff')
   * b.value // 255
   * ```
   */
  static fromHex<T extends number>(value: string): Bits<T> {
    return new this<T>(parseInt(value, 16))
  }

  /**
   * Get bit(n)
   * @example
   * ```ts
   * Bits.bit(4) // 16
   * ```
   */
  static bit(n: number): number {
    return 1 << n
  }

  /**
   * Check is set bit
   * @example
   * ```ts
   * const b = new Bits(0)
   * b.has(1) // false
   * ```
   */
  has(bit: Flags): boolean {
    return (this.#value & Bits.bit(bit)) !== 0
  }

  /**
   * Set bit
   * @example
   * ```ts
   * const b = new Bits(0)
   * b.set(0) // 0b0001
   * b.set(1) // 0b0011
   * b.set(3) // 0b1011
   * ```
   */
  set(bit: Flags): Bits<Flags> {
    this.#value |= Bits.bit(bit)
    return this
  }

  /**
   * Write bits
   * @example
   * ```ts
   * const b = new Bits(0)
   * b.write(2, 4, 6) // 0b1010100
   * b.value // 84
   * ```
   */
  write(...bits: Flags[]): Bits<Flags> {
    this.#value |= bits.reduce((acc, bit) => acc | Bits.bit(bit), 0)
    return this
  }

  /**
   * Remove bit
   * @example
   * ```ts
   * const b = new Bits(255)
   * b.clear(1) // 0b10
   * ```
   */
  clear(bit: Flags): Bits<Flags> {
    this.#value &= ~Bits.bit(bit)
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
  toggle(bit: Flags): Bits<Flags> {
    this.#value ^= Bits.bit(bit)
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
   * const flags = Bits.from(255)
   * console.log(JSON.stringify({flags})) // "{"flags": 255}"
   * ```
   */
  toJSON(): number {
    return this.#value
  }
}
