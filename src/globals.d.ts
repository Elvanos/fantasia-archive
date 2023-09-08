import { I_faWindowControlAPI } from './interfaces/I_faWindowControlAPI'
import { I_extraEnvVariablesAPI } from './interfaces/I_extraEnvVariablesAPI'

export {}

declare global{
    interface Window {
          faWindowControlAPI: I_faWindowControlAPI,
          extraEnvVariables: I_extraEnvVariablesAPI
    }
}
