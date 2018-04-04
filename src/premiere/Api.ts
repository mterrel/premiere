import Hash from "./Hash";
import axios, { AxiosInstance } from "axios";
import 'axios-debug-log';
import { trailUrl } from "./helpers/UrlHelper";

export class Api {
  private _base: string;
  private _httpOptions: any = {};

  headers: Hash<string> = {};

  get path(): string {
    return "";
  }

  constructor(properties: Hash<any> = {}) {
    Object.assign(this, properties);
  }

  get base(): string {
    return this._base || api._base || "/";
  }

  set base(value: string) {
    this._base = value;
  }

  get mixedHeaders(): Hash<string> {
    return Object.assign({}, api.headers, this.headers);
  }

  get baseUrl(): string {
    let url = this.base;
    if (this.path && this.path.length)
      url += `/${this.path}`;
    return url;
  }

  get jwtToken(): string | null {
    return this.mixedHeaders.Authorization;
  }

  set jwtToken(token: string) {
    this.headers.Authorization = `Bearer ${token}`;
  }

  get csrfToken(): string {
    return this.mixedHeaders["X-CSRF-Token"];
  }

  set csrfToken(token: string | null) {
    this.headers["X-CSRF-Token"] = token;
  }

  get httpOptions(): any {
    return Object.assign({}, this._httpOptions, {
      baseURL: this.baseUrl,
      headers: this.mixedHeaders
    });
  }

  set httpOptions(opts: any) {
    // Keep a copy.
    this._httpOptions = Object.assign({}, opts);
  }

  get http(): AxiosInstance {
    return axios.create(this.httpOptions);
  }
}

const api = new Api();
export default api;
