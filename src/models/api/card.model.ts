import { CardType } from '../../syndicate/enums/card-type.enum';
import { IDeserializable } from '../interfaces/deserializable.interface';

/**
 * Card model
 */
export class Card implements IDeserializable {
  _id: string;
  label: string;
  type: CardType;
  position: number;
  column: number = 1;
  variables: any[];

  /**
   * Assign input to current object
   *
   * @param input - JSON like data
   * @return current object instance
   * @memberOf {Card}
   */
  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
