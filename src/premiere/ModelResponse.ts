import { AxiosResponse } from "axios";
import Hash from "./Hash";
import Model from "./Model";

export interface CallbackResponse {
  data: Hash<any> | Hash<any>[];
}

export type ApiResponse = AxiosResponse;
export type Callback = (response: ApiResponse) => CallbackResponse | Promise<CallbackResponse>;

export default class ModelResponse<T extends Model> {
  model: typeof Model;
  response: AxiosResponse;
  callback: Callback;

  constructor(model: typeof Model, response: AxiosResponse, callback?: Callback) {
    this.model = model;
    this.response = response;
    this.callback = callback;
  }

  get data(): Promise<any> {
    if (this.callback) {
      return Promise.resolve(this.callback(this.response)).then((resp) => {
        return resp.data;
      });
    }

    return Promise.resolve(this.response.data);
  }

  get asInstance(): Promise<T> {
    return this.data.then((data) => {
      return this.model.make(data) as T;
    });
  }

  get asArray(): Promise<T[]> {
    return this.data.then((data) => {
      if (!Array.isArray(data)) {
        data = [data];
      }

      return this.model.makeArray(data) as T[];
    });
  }
}
