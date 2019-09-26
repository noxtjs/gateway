export interface Manifest {
  requirePorts: { [props: string]: string }
  name: string
  impl: string // unknown にしたい
  portsDef: string
}
