import { IDeserializable } from '../interfaces/deserializable.interface';
import { Parameter } from './parameter.model';
import { View } from './view.model';

/**
 * Profile model from API
 *
 * @export
 */
export class Profile implements IDeserializable {
  _id: string;
  label: string;
  description: string;
  permissions: Parameter[];
  views: View[];
  isDefault: boolean = false;

  /**
   * Deserialize Profile input like object
   *
   * @param input - JSON like data
   * @return - current instance of object
   * @memberOf {Profile}
   */
  deserialize(input: any): this {
    Object.assign(this, input);
    if (input.hasOwnProperty('permissions')) {
      this.permissions = [];
      for (const p of input.permissions) {
        this.permissions.push(new Parameter().deserialize(p));
      }
    }
    if (input.hasOwnProperty('views')) {
      this.views = [];
      for (const v of input.views) {
        this.views.push(new View().deserialize(v));
      }
    }
    return this;
  }
}
