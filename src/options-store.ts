import { Engine } from './engine.js';

type EngineType = Engine | string;

export interface SearchOptions {
  query?: string | number | (string | number)[];
  engine?: EngineType | EngineType[] | null;
  defaultEngine?: Engine | null;
  route?: string | string[];
  port?: number | number[];
  incognito?: boolean;
  split?: boolean;
  http?: boolean;
}

export class OptionsStore {
  constructor(private readonly searchOptions: SearchOptions = {}) {}

  protected get keywords(): string[] {
    function getKeywordsArray(keyword: string): string[] {
      return keyword.split(' ').filter((token) => token.length > 0);
    }

    const { query } = this.searchOptions;
    if (query == null) {
      return [];
    }

    if (typeof query === 'string') {
      return getKeywordsArray(query);
    }

    if (typeof query === 'number') {
      return [`${query}`];
    }

    return query.reduce<string[]>((result, keyword) => {
      if (typeof keyword === 'string') {
        return [...result, ...getKeywordsArray(keyword)];
      }

      if (typeof keyword === 'number') {
        return [...result, `${keyword}`];
      }

      return result;
    }, []);
  }

  protected get engine():
    | EngineType
    | EngineType[]
    | string
    | string[]
    | null
    | undefined {
    return this.searchOptions.engine;
  }

  protected get defaultEngine(): EngineType | undefined | null {
    return this.searchOptions.defaultEngine;
  }

  protected get route(): string | string[] | undefined {
    return this.searchOptions.route;
  }

  protected get port(): number | number[] | undefined {
    const { port: portOption } = this.searchOptions;
    const list = Array.isArray(portOption) ? portOption : [portOption];

    // unique list of ports
    const ports = [
      ...new Set(
        list.filter(
          (port): port is number =>
            port != null && typeof port === 'number' && !Number.isNaN(port),
        ),
      ),
    ];

    if (ports.length === 0) {
      return undefined;
    }

    if (ports.length === 1) {
      return ports.at(0);
    }

    return ports;
  }

  protected get incognito(): boolean {
    return this.searchOptions.incognito ?? false;
  }

  protected get split(): boolean {
    return this.searchOptions.split ?? false;
  }

  protected get http(): boolean | undefined {
    return this.searchOptions.http;
  }
}
