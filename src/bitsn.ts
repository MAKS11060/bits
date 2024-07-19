type toUnion<T extends bigint | Record<string, bigint>> = T extends bigint
  ? T
  : T[keyof T]

/**
 * A utility class for working with big integers as bitsets.
 *
 * @example BitsN.Instance
 * ```ts
 * const Flags = BitsN.Instance({
 *   option_1: 0n,
 *   option_2: 1n,
 *   option_3: 2n,
 * })
 *
 * const flags = Flags.now()
 *
 * flags.set(Flags.flags.option_1)
 * flags.has(Flags.flags.option_2)
 * flags.toggle(Flags.flags.option_3)
 *
 * flags.value   // 5n
 * flags.toBin() // '101'
 *  ```
 *
 * @example Use readonly object
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
export class BitsN<Flags extends bigint | Record<string, bigint> = bigint> {
  #value: bigint

  constructor(value: string | number | bigint = 0n) {
    this.#value = BigInt(value)
  }

  /**
   * Gets the current value of the bitset.
   * @returns {bigint} The current value of the bitset.
   */
  get value(): bigint {
    return this.#value
  }

  /**
   * Creates a new instance of the {@linkcode BitsN} class with a set of predefined flags.
   * @param {T} flags - The predefined flags to use.
   * @returns {{ flags: T, now: (value?: string | number | bigint) => BitsN<T> }} An object containing the predefined flags and a function for creating new instances of the BitsN class with those flags.
   */
  static Instance<const T extends Record<string, bigint>>(
    flags: T
  ): {
    flags: T
    now(value?: string | number | bigint): BitsN<T>
  } {
    return {
      flags,
      now(value: string | number | bigint = 0n) {
        return new BitsN<T>(value)
      },
    }
  }

  /**
   * Creates a new instance of the {@linkcode BitsN} class from a number, string, or bigint.
   * @template {bigint | Record<string, bigint>} T - The type of flags to use.
   * @param {string | number | bigint} value - The initial value of the bitset.
   * @returns {BitsN<T>} A new instance of the BitsN class.
   */
  static from<T extends bigint | Record<string, bigint>>(
    value: string | number | bigint
  ): BitsN<T> {
    return new this<T>(value)
  }

  /**
   * Creates a new instance of the {@linkcode BitsN} class from a **binary** string.
   * @template {bigint | Record<string, bigint>} T - The type of flags to use.
   * @param {string} value - The initial value of the bitset in binary representation.
   * @returns {BitsN<T>} A new instance of the BitsN class.
   */
  static fromBin<T extends bigint | Record<string, bigint>>(
    value: string
  ): BitsN<T> {
    return new this<T>(BigInt(`0b` + value))
  }

  /**
   * Creates a new instance of the {@linkcode BitsN} class from a **hexadecimal** string.
   * @template {bigint | Record<string, bigint>} T - The type of flags to use.
   * @param {string} value - The initial value of the bitset in hexadecimal representation.
   * @returns {BitsN<T>} A new instance of the BitsN class.
   */
  static fromHex<T extends bigint | Record<string, bigint>>(
    value: string
  ): BitsN<T> {
    return new this<T>(BigInt(`0x` + value))
  }

  /**
   * Returns the value of the bit at the specified position.
   * @param {bigint | number} n - The position of the bit.
   * @returns {bigint} The value of the bit at the specified position.
   */
  static bit(n: bigint | number): bigint {
    return 1n << BigInt(n)
  }

  /**
   * Checks if the bit at the specified position is set.
   * @param {toUnion<Flags>} bit - The position of the bit.
   * @returns {boolean} True if the bit is set, false otherwise.
   */
  has(bit: toUnion<Flags>): boolean {
    return (this.#value & BitsN.bit(bit)) !== 0n
  }

  /**
   * Sets the bit at the specified position.
   * @param {toUnion<Flags>} bit - The position of the bit.
   * @returns {BitsN<Flags>} The current instance of the BitsN class.
   */
  set(bit: toUnion<Flags>): BitsN<Flags> {
    this.#value |= BitsN.bit(bit)
    return this
  }

  /**
   * Sets the bits at the specified positions.
   * @param {...toUnion<Flags>} bits - The positions of the bits to set.
   * @returns {BitsN<Flags>} The current instance of the BitsN class.
   */
  write(...bits: toUnion<Flags>[]): BitsN<Flags> {
    this.#value |= bits.reduce((acc, bit) => acc | BitsN.bit(bit), 0n)
    return this
  }

  /**
   * Clears the bit at the specified position.
   * @param {toUnion<Flags>} bit - The position of the bit.
   * @returns {BitsN<Flags>} The current instance of the BitsN class.
   */
  clear(bit: toUnion<Flags>): BitsN<Flags> {
    this.#value &= ~BitsN.bit(bit)
    return this
  }

  /**
   * Toggles the bit at the specified position.
   * @param {toUnion<Flags>} bit - The position of the bit.
   * @returns {BitsN<Flags>} The current instance of the BitsN class.
   */
  toggle(bit: toUnion<Flags>): BitsN<Flags> {
    this.#value ^= BitsN.bit(bit)
    return this
  }

  /**
   * Converts the current value of the bitset to a binary string.
   * @returns {string} The current value of the bitset in binary representation.
   */
  toBin(): string {
    return this.#value.toString(2)
  }

  /**
   * Converts the current value of the bitset to a hexadecimal string.
   * @returns {string} The current value of the bitset in hexadecimal representation.
   */
  toHex(): string {
    return this.#value.toString(16)
  }

  /**
   * Converts the current value of the bitset to a JSON string.
   * @returns {string} The current value of the bitset in decimal representation.
   */
  toJSON(): string {
    return this.#value.toString()
  }
}
