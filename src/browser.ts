export class Browser {
  constructor(
    public readonly name: string,
    public readonly profileDirectory?: string | string[],
  ) {}
}
