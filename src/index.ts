export * from './gateway/bootstrap'
export * from './gateway/load-module'
export type GatewayFactory<S, T = {}, U = {}> = (ports: T, config: U) => S
