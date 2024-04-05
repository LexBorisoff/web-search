type Routes = Record<string, string>;
interface EngineOptions {
  name?: string;
  query?: string;
  routes?: Routes;
  delimiter?: string;
}

export class Engine {
  public readonly delimiter: string;
  public readonly name?: string;
  public readonly query?: string;
  public readonly routes?: Routes;

  constructor(
    public readonly baseUrl: string,
    { name, query, routes, delimiter }: EngineOptions = {},
  ) {
    this.name = name;
    this.query = query;
    this.routes = routes;
    this.delimiter = delimiter ?? ' ';
  }
}
