interface BrowserOptions {
  incognito?: boolean;
  profileDirectory?: string | string[];
}

export class Browser {
  constructor(
    public readonly browserName: string,
    public readonly browserOptions: BrowserOptions = {},
  ) {}
}
