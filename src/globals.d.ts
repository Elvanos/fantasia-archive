declare module "*.md"{
  const content: string
  export default content
}

declare module "*.png"{
  const content: string
  export default content
}

interface Window {
  FA_dbs: PouchDB.Static[]
}
