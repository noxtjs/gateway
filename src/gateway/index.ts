export * from './bootstrap'
export * from './load-module'
export type GatewayFactory<S, T = {}, U = {}> = (ports: T, config: U) => S
