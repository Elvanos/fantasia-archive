// Bodge: for old Node types with newer deps
declare module "fs" {
  export class Dir {}
  export type OpenDirOptions = {}
  export type RmDirOptions = {}
}
