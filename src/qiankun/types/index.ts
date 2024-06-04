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