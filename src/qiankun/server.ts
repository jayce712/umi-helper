import { createQiankunProxyOption } from './helpers';
import { AppItem, Options } from './types';

export const createQiankunAppsProxy = (apps: AppItem[], opts: Options) => apps
    .map((item) => createQiankunProxyOption(item, opts))
    .filter(Boolean);
