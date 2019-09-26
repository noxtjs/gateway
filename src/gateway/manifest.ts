export interface Manifest {
  inputPorts: { [props: string]: string }
  outputPort: string
  codeImplementation: string // unknown にしたい
  codePortsInterface: string
}
