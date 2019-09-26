export interface FilesPort {
  read: (filename: string) => Promise<string>
}
