export interface I_NewObjectTrigger {
  label?: string
  icon?: string
  parent?: string
  handler?: (e: I_NewObjectTrigger) => void
  _id: string
}
