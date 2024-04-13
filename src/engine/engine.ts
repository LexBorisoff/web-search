import type {
  EngineOptions,
  NavigateConfig,
  ResourceGetterFn,
  ResourceObject,
  SearchConfig,
  SearchObject,
} from './engine.types.js';

export class Engine<
  SearchOption extends string | SearchObject,
  ResourceOption extends ResourceObject,
> {
  constructor(
    private readonly baseUrl: string,
    private readonly options?: EngineOptions<SearchOption, ResourceOption>,
  ) {}

  public search(
    searchQuery?: string,
    { query, ...config }: SearchConfig<SearchOption> = {},
  ) {
    if (typeof query === 'string') {
      return;
    }

    if (Array.isArray(query)) {
      return;
    }

    if (query != null && this.options?.search != null) {
      const result = query(this.options.search);
      return;
    }
  }

  public navigate(
    resource: string | string[] | ResourceGetterFn<ResourceOption>,
    config?: NavigateConfig,
  ) {
    if (typeof resource === 'string') {
      return;
    }

    if (Array.isArray(resource)) {
      return;
    }

    if (resource != null && this.options?.resources != null) {
      const result = resource(this.options.resources);
      return;
    }
  }

  private isValidPortString(value: string): boolean {
    return !Number.isNaN(Number.parseInt(value, 10));
  }

  private getUniquePorts(
    value: number | string | (number | string)[],
  ): number[] {
    const list = Array.isArray(value) ? value : [value];

    const ports = list.reduce<number[]>((result, port) => {
      if (typeof port === 'number') {
        return [...result, port];
      }

      if (this.isValidPortString(port)) {
        return [...result, Number.parseInt(port, 10)];
      }

      return result;
    }, []);

    return [...new Set(ports)];
  }
}
