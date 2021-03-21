import * as moment from 'moment';
import { IDeserializable } from '../interfaces/deserializable.interface';

/**
 * Counter model
 */
export class Counter implements IDeserializable {
  _id: string;
  label: string;
  description: string;
  value: string;
  initOn?: boolean;
  type: string;
  unit: string;
  date: string;
  variable: {
    vId: string;
    format: string;
  };

  /**
   * Assign input to current object
   *
   * @param input - JSON like data
   * @return current object instance
   * @memberOf {Counter}
   */
  deserialize(input: any): this {
    Object.assign(this, input);
    this.date = moment(input.date).format();
    return this;
  }
}
