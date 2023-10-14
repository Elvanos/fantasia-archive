import { I_extraEnvVariablesAPI } from 'app/interfaces/I_extraEnvVariablesAPI'
import { I_faWindowControlAPI } from 'app/interfaces/I_faWindowControlAPI'
import { I_faExternalLinksManagerAPI } from 'app/interfaces/I_faExternalLinksManagerAPI'
import { I_faDevToolsControl } from 'app/interfaces/I_faDevToolsControl'

declare global{
  interface Window {
    faWindowControlAPI: I_faWindowControlAPI,
    faDevToolsControlAPI: I_faDevToolsControl,
    faExternalLinksManagerAPI: I_faExternalLinksManagerAPI,
    extraEnvVariables: I_extraEnvVariablesAPI
  }
}
