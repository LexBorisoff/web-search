type Routes = Record<string, string>;
interface EngineOptions {
  query?: string;
  routes?: Routes;
  delimiter?: string;
}

export class Engine {
  public readonly delimiter: string;
  public readonly query?: string;
  public readonly routes?: Routes;

  constructor(
    public readonly name: string,
    public readonly url: string,
    { query, routes, delimiter }: EngineOptions = {},
  ) {
    this.query = query;
    this.routes = routes;
    this.delimiter = delimiter ?? ' ';
  }
}
