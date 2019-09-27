export * from './bootstrap'
export type GatewayFactory<S, T = {}, U = {}> = (ports: T, config: U) => S
