/**
 * Interface used to define the deserialization method
 * for models
 *
 * @export
 */
export interface IDeserializable {

  /**
   * assign JSON input to current object
   *
   * @param input - JSON like data
   * @returns - current instance of object
   * @memberOf {IDeserializable}
   */
  deserialize(input: any): this;
}
