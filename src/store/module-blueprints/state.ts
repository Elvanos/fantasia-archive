import { I_Blueprint } from "./../../interfaces/I_Blueprint"
export interface BlueprintStateInterface {
  blueprints: I_Blueprint[]
}

function state (): BlueprintStateInterface {
  return {
    blueprints: []
  }
}

export default state
