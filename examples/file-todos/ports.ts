export interface FileTodoPort {
  find: (searchPattern: string) => Promise<string[]>
}
