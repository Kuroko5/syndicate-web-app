import { IDeserializable } from '../interfaces/deserializable.interface';

/**
 * Parameter model from API
 *
 * @export
 */
export class Parameter implements IDeserializable {
  category: string;
  code: string;
  label: string;

  /**
   * Deserialize Parameter input like object
   *
   * @param input - JSON like data
   * @return - current instance of object
   * @memberOf {Parameter}
   */
  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
