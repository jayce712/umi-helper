---
 title: 介绍
---

# runtime-env

给`umi`用的注入运行时的环境变量，主要功能

- 提供umi插件配置runtime环境变量，统一接口
- 提供运行时环境变量注入和替换

### 使用

#### 配置
```ts | pure
// @app/shared/constance.ts
const PUBLIC_RUNTIME_CONFIG = {
  enableRuntimeEnv: process.env.ENABLE_RUNTIME_ENV === 'true'
};

const PUBLIC_RUNTIME_CONFIG_KEY = '__PUBLIC_RUNTIME_CONFIG__';

module.exports = {
  PUBLIC_RUNTIME_CONFIG,
  PUBLIC_RUNTIME_CONFIG_KEY
};

```

#### client端配置

- umi配置项

在`umirc.ts`或者`config/config.ts`中加入插件

```ts | pure
import {
  PUBLIC_RUNTIME_CONFIG,
  PUBLIC_RUNTIME_CONFIG_KEY,
} from '@app/shared/constance';

export default defineConfig({
  plugins: [
    ['@/runtime-env/plugin',{
      PUBLIC_RUNTIME_CONFIG,
      PUBLIC_RUNTIME_CONFIG_KEY,
    }]
  ],
})
```

#### server端配置

- 代理配置

```ts | pure
const path = require('path');
const {
  PUBLIC_RUNTIME_CONFIG,
  PUBLIC_RUNTIME_CONFIG_KEY,
} = require('@app/shared/constance');
const handleHtml = require('@/runtime-env/server');

module.exports = function (app) {
  // 前端打包后的代码目录
  const staticDir = path.join(__dirname, '..', '..', 'client', 'dist');

  app.get('*', (req, res) => {
    const html = fs.readFileSync(path.join(staticDir, 'index.html'), 'utf8');
    res.send(handleHtml(html, { PUBLIC_RUNTIME_CONFIG, PUBLIC_RUNTIME_CONFIG_KEY }));
  });
};

```