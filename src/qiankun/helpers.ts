import type { AppItem, Options } from './types';

const MICROAPP_ENV_PREFIX = 'MICROAPP_';

export const hasProtocol = (url: string) => url.startsWith('http://') || url.startsWith('https://');

export const formatPath = (basePath: string) => {
  const _basePath = basePath.endsWith('/')
    ? basePath.substr(0, basePath.length - 1)
    : basePath;
  return _basePath;
};

export const formatOptions = (opts: Options) => {
  const options = {
    basePath: '/',
    prefix: '/__slave__',
    ...opts,
  } as Options & {rewrite:string};
  if (options.basePath) {
    options.basePath = formatPath(options.basePath);
  }
  if (options.prefix) {
    options.prefix = formatPath(options.prefix);
  }

  options.rewrite = `${options.basePath || ''}${options.prefix || ''}`;

  return options;
};

export const createQiankunAppOption = (item: AppItem, opts: Options) => {
  const { rewrite } = formatOptions(opts);
  const entry = hasProtocol(item.entry)
    ? item.entry
    : `${rewrite}${item.entry}`;
  return {
    name: item.name,
    entry,
    rewrite,
  };
};

export const getFallbackAppTarget = (item: AppItem) => {
  if (item.target) {
    return item.target;
  }
  const key = `${MICROAPP_ENV_PREFIX}${item.name.toUpperCase().replace('-', '_')}`;
  if (key in process.env) {
    return process.env[key];
  }
  // fallback to docker container
  return `http://${item.name}`;
};

// @ts-ignore
export const createQiankunProxyOption = (item: AppItem, opts: Options) => {
  const { rewrite, entry } = createQiankunAppOption(item, opts);
  if (!hasProtocol(entry)) {
    return {
      changeOrigin: true,
      context: entry,
      target: getFallbackAppTarget(item),
      pathRewrite: (path) => {
        if (path === entry) {
          return path;
        }
        return path.replace(rewrite, '');
      },
    };
  }
};
