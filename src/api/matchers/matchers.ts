export const matchers = {
  url: /^(https?:\/\/)?(\b([A-Za-z0-9]+([A-Za-z0-9-])*([A-Za-z0-9])*\b)\.)+[a-z]{2,}\/?/i,
  port: /:(\d{1,5})/,
  flagWithPort: /^\w+:\d+$/,
  protocol: /^https?:\/\//,
  slash: {
    leading: /^\//,
    trailing: /\/$/,
  },
};
