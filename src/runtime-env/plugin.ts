module.exports = (api, opts) => {
  const {
    PUBLIC_RUNTIME_CONFIG_KEY = '__PUBLIC_RUNTIME_CONFIG__',
    PUBLIC_RUNTIME_CONFIG = {},
  } = opts || {};
  if (process.env.NODE_ENV === 'development') {
    api.addHTMLHeadScripts(
      () =>
        `window.${PUBLIC_RUNTIME_CONFIG_KEY}=${JSON.stringify(
          PUBLIC_RUNTIME_CONFIG,
        )}`,
    );
  } else {
    api.addHTMLHeadScripts(
      () =>
        `window.${PUBLIC_RUNTIME_CONFIG_KEY}={{${PUBLIC_RUNTIME_CONFIG_KEY}}}`,
    );
  }

  api.onGenerateFiles(() => {
    try {
      const dts = Object.keys(PUBLIC_RUNTIME_CONFIG).reduce((memo, key) => {
        memo += `${key}: any;\n`;
        return memo;
      }, '');

      api.writeTmpFile({
        path: 'env.ts',
        content: `
export interface RUNTIME_ENV {
  ${dts}
}

export const runtimeEnv:RUNTIME_ENV = window.${PUBLIC_RUNTIME_CONFIG_KEY};

export const getRuntimeEnv = <T extends keyof RUNTIME_ENV>(key:T, defaultValue?: RUNTIME_ENV[T]): RUNTIME_ENV[T] => {
  return runtimeEnv[key] ?? defaultValue;
}
`
      })
      api.writeTmpFile({
        path: 'index.ts',
        content: `
export * from './env.ts';
`
      })
    } catch (e) {
      api.logger.error(e);
    }
  });
};
