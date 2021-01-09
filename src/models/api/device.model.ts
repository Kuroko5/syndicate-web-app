import { IDeserializable } from '../interfaces/deserializable.interface';

/**
 * Device model
 */
export class Device implements IDeserializable {
  _id: string;
  tbmrn: string;
  enable: boolean;
  ip: string;
  rack: number;
  slot: number;
  period: number;

  /**
   * Assign input to current object
   *
   * @param input - JSON like data
   * @return current object instance
   * @memberOf {Device}
   */
  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
