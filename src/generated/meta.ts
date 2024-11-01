// This file is generated by `vscode-ext-gen`. Do not modify manually.
// @see https://github.com/antfu/vscode-ext-gen

// Meta info
export const publisher = "oeyoews"
export const name = "usewiki2"
export const version = "2.8.0"
export const displayName = "usewiki2"
export const description = undefined
export const extensionId = `${publisher}.${name}`

/**
 * Type union of all commands
 */
export type CommandKey = 
  | "usewiki2.wikiinfo"
  | "usewiki2.openwiki"
  | "usewiki2.opensettings"

/**
 * Commands map registed by `oeyoews.usewiki2`
 */
export const commands = {
  /**
   * %usewiki2.tiddlywiki.title%
   * @value `usewiki2.wikiinfo`
   */
  wikiinfo: "usewiki2.wikiinfo",
  /**
   * %usewiki2.openwiki.title%
   * @value `usewiki2.openwiki`
   */
  openwiki: "usewiki2.openwiki",
  /**
   * %usewiki2.opensettings.title%
   * @value `usewiki2.opensettings`
   */
  opensettings: "usewiki2.opensettings",
} satisfies Record<string, CommandKey>

/**
 * Type union of all configs
 */
export type ConfigKey = 
  | "usewiki2.enableSendSound"
  | "usewiki2.defaultTag"
  | "usewiki2.defaultUsername"
  | "usewiki2.ip"
  | "usewiki2.port"
  | "usewiki2.enableHttps"
  | "usewiki2.lang"
  | "usewiki2.type"

export interface ConfigKeyTypeMap {
  "usewiki2.enableSendSound": boolean,
  "usewiki2.defaultTag": string,
  "usewiki2.defaultUsername": string,
  "usewiki2.ip": string,
  "usewiki2.port": number,
  "usewiki2.enableHttps": boolean,
  "usewiki2.lang": ("en" | "zhCN"),
  "usewiki2.type": ("text/markdown" | "text/vnd.tiddlywiki"),
}

export interface ConfigShorthandMap {
  enableSendSound: "usewiki2.enableSendSound",
  defaultTag: "usewiki2.defaultTag",
  defaultUsername: "usewiki2.defaultUsername",
  ip: "usewiki2.ip",
  port: "usewiki2.port",
  enableHttps: "usewiki2.enableHttps",
  lang: "usewiki2.lang",
  type: "usewiki2.type",
}

export interface ConfigItem<T extends keyof ConfigKeyTypeMap> {
  key: T,
  default: ConfigKeyTypeMap[T],
}


/**
 * Configs map registed by `oeyoews.usewiki2`
 */
export const configs = {
  /**
   * %usewiki2.enableSendSound.title%
   * @key `usewiki2.enableSendSound`
   * @default `false`
   * @type `boolean`
   */
  enableSendSound: {
    key: "usewiki2.enableSendSound",
    default: false,
  } as ConfigItem<"usewiki2.enableSendSound">,
  /**
   * %usewiki2.defaultTag.title%
   * @key `usewiki2.defaultTag`
   * @default `"Journal"`
   * @type `string`
   */
  defaultTag: {
    key: "usewiki2.defaultTag",
    default: "Journal",
  } as ConfigItem<"usewiki2.defaultTag">,
  /**
   * %usewiki2.defaultUsername%
   * @key `usewiki2.defaultUsername`
   * @default `""`
   * @type `string`
   */
  defaultUsername: {
    key: "usewiki2.defaultUsername",
    default: "",
  } as ConfigItem<"usewiki2.defaultUsername">,
  /**
   * %usewiki2.ip%
   * @key `usewiki2.ip`
   * @default `"127.0.0.1"`
   * @type `string`
   */
  ip: {
    key: "usewiki2.ip",
    default: "127.0.0.1",
  } as ConfigItem<"usewiki2.ip">,
  /**
   * %usewiki2.port%
   * @key `usewiki2.port`
   * @default `8080`
   * @type `number`
   */
  port: {
    key: "usewiki2.port",
    default: 8080,
  } as ConfigItem<"usewiki2.port">,
  /**
   * %usewiki2.enableHttps%
   * @key `usewiki2.enableHttps`
   * @default `false`
   * @type `boolean`
   */
  enableHttps: {
    key: "usewiki2.enableHttps",
    default: false,
  } as ConfigItem<"usewiki2.enableHttps">,
  /**
   * %usewiki2.lang%
   * @key `usewiki2.lang`
   * @default `"en"`
   * @type `string`
   */
  lang: {
    key: "usewiki2.lang",
    default: "en",
  } as ConfigItem<"usewiki2.lang">,
  /**
   * %usewiki2.type%
   * @key `usewiki2.type`
   * @default `"text/vnd.tiddlywiki"`
   * @type `string`
   */
  type: {
    key: "usewiki2.type",
    default: "text/vnd.tiddlywiki",
  } as ConfigItem<"usewiki2.type">,
}

export interface ScopedConfigKeyTypeMap {
  "enableSendSound": boolean,
  "defaultTag": string,
  "defaultUsername": string,
  "ip": string,
  "port": number,
  "enableHttps": boolean,
  "lang": ("en" | "zhCN"),
  "type": ("text/markdown" | "text/vnd.tiddlywiki"),
}

export const scopedConfigs = {
  scope: "usewiki2",
  defaults: {
    "enableSendSound": false,
    "defaultTag": "Journal",
    "defaultUsername": "",
    "ip": "127.0.0.1",
    "port": 8080,
    "enableHttps": false,
    "lang": "en",
    "type": "text/vnd.tiddlywiki",
  } satisfies ScopedConfigKeyTypeMap,
}

