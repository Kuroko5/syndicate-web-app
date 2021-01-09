import { IDeserializable } from '../interfaces/deserializable.interface';

/**
 * Variable model from API
 *
 * @export
 */
export class Variable implements IDeserializable {
  vId: string;
  descr: string;
  value: any;
  format: any;

  /**
   * Deserialize Variable input like object
   *
   * @param input - JSON like data
   * @return - current instance of object
   */
  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
