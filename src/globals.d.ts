import { I_extraEnvVariablesAPI } from 'app/interfaces/I_extraEnvVariablesAPI'
import { I_faWindowControlAPI } from 'app/interfaces/I_faWindowControlAPI'
import { I_faDevToolsControl } from 'app/interfaces/I_faDevToolsControl'

declare global{
    interface Window {
          faWindowControlAPI: I_faWindowControlAPI,
          faDevToolsControlAPI: I_faDevToolsControl,
          extraEnvVariables: I_extraEnvVariablesAPI
    }
}
