/**
 * Interface use for body in view creation
 */
export interface ICreateViewRequest {
  label: string;
  cards: {
    label: string;
    type: string;
    variables: {
      _id: string;
      description: string;
    }[]
  }[];
}
