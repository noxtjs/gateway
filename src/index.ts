export * from './gateway/bootstrap'
export * from './gateway/load-module'
export type GatewayFactory<S, T = {}, U = {}> = (config: T, ports: U) => S
