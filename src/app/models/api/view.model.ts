import { IDeserializable } from '../interfaces/deserializable.interface';

/**
 * View model from API
 *
 * @export
 */
export class View implements IDeserializable {
  _id: string;
  code: string;
  label: string;
  values: {
    type: string;
    title: string;
    variables: {
      name: string;
      order: number;
    }[];
  }[];

  /**
   * Deserialize View input like object
   *
   * @param input - JSON like data
   * @return - current instance of object
   * @memberOf {View}
   */
  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
