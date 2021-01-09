import { IDeserializable } from '../interfaces/deserializable.interface';
import { Variable } from './variable.model';

/**
 * Station model from API
 *
 * @export
 */
export class Station implements IDeserializable {
  _id: string;
  label: string;
  ip: string;
  vComm?: Variable;
  vMachine?: Variable;
  variables?: Variable[];
  state: boolean;

  /**
   * Deserialize method for Station
   *
   * @param input - JSON like data
   * @return - current object
   */
  deserialize(input: any): this {
    Object.assign(this, input);
    if (input.vComm) {
      this.vComm = new Variable().deserialize(input.vComm);
    }
    if (input.vMachine) {
      this.vMachine = new Variable().deserialize(input.vMachine);
    }
    if (input.variables) {
      this.variables = [];
      for (const variable of input.variables) {
        this.variables.push(new Variable().deserialize(variable));
      }
    }
    return this;
  }
}
