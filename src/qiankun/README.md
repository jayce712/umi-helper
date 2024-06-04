---
 title: 介绍
---

# qiankun

给`umi + qiankun`用的通用helpers函数，主要功能

- 主应用通过代理方式访问子应用，降低运维部署门槛
- 支持子应用静态资源通过代理方式访问

### 使用

#### 类型定义
```ts | pure
export interface AppItem {
    /** 子应用名字 */
    name: string;
    /** 子应用入口(子应用basePath，应用内唯一) */
    entry: string;
    /** 子应用服务(域名/容器服务名) */
    target: string;
}

export interface Options {
    /** 父应用basePath */
    basePath?: string;
    /** 父应用加载子应用路由前缀，默认`__slave__` */
    prefix?: string;
}

createMasterOption(AppItem[], Options);
createQiankunAppsProxy(AppItem[], Options);
createMasterRuntimeOption(Options);
```

#### 应用配置
```ts | pure
// @app/shared/constance.ts
const QIANKUN_APPS = [
  {
    name: 'app-ems-ui',
    entry: `/ems/`,
    target: process.env.MICROAPP_APP_EMS_UI || 'http://localhost:3001',
  },
  {
    name: 'app-engine-ui',
    entry: '/engine/',
    target: process.env.MICROAPP_APP_ENGINE_UI || 'http://localhost:8001',
  },
];

module.exports = {
  QIANKUN_APPS,
};

```

#### client端配置

- umi配置项

在`umirc.ts`或者`config/config.ts`中加入proxy配置以及qiankun子应用注册

```ts | pure
import {
  createMasterOption,
  createQiankunAppsProxy,
} from '@/qiankun';
import { QIANKUN_APPS } from '@app/shared/constance';

export default defineConfig({
  proxy: [
    ...createQiankunAppsProxy(QIANKUN_APPS, { basePath: PUBLIC_PATH }),
  ],
  qiankun: {
    master: createMasterOption(QIANKUN_APPS, { basePath: PUBLIC_PATH }),
  },
})
```

- runtime运行时配置

```ts | pure
import { createMasterRuntimeOption } from '@/qiankun';
import { QIANKUN_APPS } from '@app/shared/constance';

export const qiankun = {
  ...createMasterRuntimeOption({ basePath: PUBLIC_PATH }),
};
```

#### server端配置

- 代理配置

```ts | pure
const { createProxyMiddleware } = require('http-proxy-middleware');
const logger = require('morgan');
const { createQiankunAppsProxy } = require('@/qiankun');
const { QIANKUN_APPS } = require('@app/shared/constance');

const config = require('../config');

module.exports = function (app) {
  const proxyOptions = createQiankunAppsProxy(QIANKUN_APPS, {
    basePath: config.PUBLIC_PATH,
  });

  proxyOptions.forEach((item) => {
    app.use(item.context, logger('tiny'), createProxyMiddleware(item));
  });
};

```