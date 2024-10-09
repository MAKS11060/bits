type EnumToRecord<T = {}> = {
  [K in keyof T]: T[K] extends number ? number : never
}

type ToType<T extends number | bigint = number> = T extends number
  ? number
  : bigint

type BitSetInstance<
  T extends Record<string, number>,
  I extends number | bigint = number
> = {
  now: <V extends number | bigint = I>(value?: V) => BitSet<T, V>
  fromHex: (value: string) => BitSet<T, number>
  fromBin: (value: string) => BitSet<T, number>
  fromHexBigInt: (value: `0x${string}`) => BitSet<T, bigint>
  fromBinBigInt: (value: `0b${string}`) => BitSet<T, bigint>
  options: T
}

/**
 * Represents a {@linkcode BitSet} with methods to manipulate and retrieve `bit` values.
 *
 * @example
 * ```ts
 * const Bits = new BitSet.Instance({})
 * const bits = Bits.now()
 *
 * bits.set(10)
 * bits.has(10) // true
 * ```
 */
export class BitSet<
  T extends Record<string, number>,
  V extends number | bigint = number
> {
  #value: V

  /**
   * Creates a new {@linkcode BitSet} with the given options and value.
   * @param {T} [options={}]
   * @param {V} [value]
   */
  constructor(readonly options: T = {} as T, value?: V) {
    this.#value = value ?? (0 as V)
  }

  /**
   * Gets the current value of the bit set.
   * @returns {ToType<V>}
   */
  get value(): ToType<V> {
    return typeof this.#value === 'number'
      ? ((this.#value >>> 0) as ToType<V>)
      : (this.#value as ToType<V>)
  }

  /**
   * Creates a new {@linkcode BitSet} instance with the given options and value.
   *
   * @example
   * ```ts
   * const Flags = BitSet.Instance({a: 0, b: 1, c: 2})
   *
   * const bits = Flags.now()
   * bits.set('a')
   * bits.set('c')
   *
   * bits.has('a') // true
   * bits.has('b') // false
   * ```
   *
   * @param {U} [options={}]
   * @returns {BitSetInstance<U, I>}
   */
  static Instance<
    T extends /* Record<string, number> | */ EnumToRecord,
    I extends number | bigint = number
  >(options: T = {} as T): BitSetInstance<T, I> {
    return {
      now: (value) => new BitSet(options, value),
      fromHex: (value) => new BitSet(options, parseInt(value, 16)),
      fromBin: (value) => new BitSet(options, parseInt(value, 2)),
      fromHexBigInt: (value) => new BitSet(options, BigInt(value)),
      fromBinBigInt: (value) => new BitSet(options, BigInt(value)),
      options,
    }
  }

  /**
   * Returns a `bit` value based on the given bit number.
   * @param {number | bigint} n
   * @returns {number | bigint}
   */
  static bit(n: number): number
  static bit(n: bigint): bigint
  static bit(n: number | bigint): number | bigint {
    if (typeof n === 'number' && n > 31)
      throw new Error(`The maximum bit number must be less than 32`)
    return typeof n === 'number' ? 1 << n : 1n << n
  }

  /**
   * Clears all `bits` in the bit set.
   * @returns {this}
   */
  clear(): this {
    const key = Object.keys(this.options)[0]
    // set default value
    if (key) this.#value = (typeof this.options[key] === 'number' ? 0 : 0n) as V

    return this
  }

  /**
   * Deletes the specified `bit` from the bit set.
   * @param {keyof T | number} bit
   * @returns {this}
   */
  delete(flag: keyof T): this
  delete(bit: number): this
  delete(bit: keyof T | number) {
    const bitValue = typeof bit === 'number' ? bit : this.options[bit]

    if (typeof this.#value === 'number') {
      ;(this.#value as number) &= ~BitSet.bit(bitValue)
    } else if (typeof this.#value === 'bigint') {
      ;(this.#value as bigint) &= ~BitSet.bit(BigInt(bitValue))
    }

    return this
  }

  /**
   * Gets the value of the specified `bit`.
   * @param {keyof T | number} bit
   * @returns {ToType<V>}
   */
  get(flag: keyof T): ToType<V>
  get(bit: number): ToType<V>
  get(bit: keyof T | number) {
    const bitValue = typeof bit === 'number' ? bit : this.options[bit]

    if (typeof this.#value === 'number') {
      return (this.#value as number) & BitSet.bit(bitValue)
    } else if (typeof this.#value === 'bigint') {
      return (this.#value as bigint) & BitSet.bit(BigInt(bitValue))
    }
  }

  /**
   * Checks if the specified `bit` is set.
   * @param {keyof T | number} bit
   * @returns {boolean}
   */
  has(flag: keyof T): boolean
  has(bit: number): boolean
  has(bit: keyof T | number) {
    const bitValue = typeof bit === 'number' ? bit : this.options[bit]

    if (typeof this.#value === 'number') {
      return Boolean((this.#value as number) & BitSet.bit(bitValue))
    } else if (typeof this.#value === 'bigint') {
      return Boolean((this.#value as bigint) & BitSet.bit(BigInt(bitValue)))
    }
  }

  /**
   * Sets the specified `bit` in the bit set.
   * @param {keyof T | number} bit
   * @returns {this}
   */
  set(flag: keyof T): this
  set(bit: number): this
  set(bit: keyof T | number) {
    const bitValue = typeof bit === 'number' ? bit : this.options[bit]

    if (typeof this.#value === 'number') {
      ;(this.#value as number) |= BitSet.bit(bitValue)
    } else if (typeof this.#value === 'bigint') {
      ;(this.#value as bigint) |= BitSet.bit(BigInt(bitValue))
    }

    return this
  }

  /**
   * Sets multiple `bits` in the bit set.
   * @param {...(keyof T)[] | number[]} bits
   * @returns {this}
   */
  write(...bits: (keyof T)[]): this
  write(...bits: number[]): this
  write(...bits: (keyof T)[] | number[]) {
    for (const bit of bits) {
      this.set(bit as number)
    }
    return this
  }

  /**
   * Toggles the specified `bit` in the bit set.
   * @param {keyof T | number} bit
   * @returns {this}
   */
  toggle(flag: keyof T): this
  toggle(bit: number): this
  toggle(bit: keyof T | number) {
    const bitValue = typeof bit === 'number' ? bit : this.options[bit]
    if (typeof this.#value === 'number') {
      ;(this.#value as number) ^= BitSet.bit(bitValue)
    } else if (typeof this.#value === 'bigint') {
      ;(this.#value as bigint) ^= BitSet.bit(BigInt(bitValue))
    }
    return this
  }

  /**
   * Returns an iterator that yields an array containing the `bit` flag and its corresponding value.
   * @template U
   * @param {U} [bits]
   * @yields {U extends true ? [number, boolean] : [keyof T, boolean]}
   */
  entries(): IterableIterator<[keyof T, boolean]>
  entries(bits: true): IterableIterator<[number, boolean]>
  *entries(bits?: boolean): IterableIterator<[keyof T | number, boolean]> {
    if (bits) {
      for (let i = 0; i < this.#value.toString(2).length; i++) {
        yield [i, this.has(i)]
      }
    } else {
      for (const flag of Object.keys(this.options)) {
        yield [flag, this.has(flag)]
      }
    }
  }

  /**
   * Returns an iterator that yields an array containing the `bit` flag and its corresponding value.
   * @template U
   * @yields {U extends true ? [number, boolean] : [keyof T, boolean]}
   */
  *[Symbol.iterator](): IterableIterator<[keyof T, boolean]> {
    yield* this.entries()
  }

  /**
   * Returns the current value as a serializable JSON value.
   * @returns {V extends number ? number : string}
   */
  toJSON(): V extends number ? number : string {
    return typeof this.#value === 'number'
      ? this.#value
      : (this.#value as any).toString()
  }
}
