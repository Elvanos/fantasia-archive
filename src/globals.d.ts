import { I_faWindowControlAPI } from './interfaces/I_faWindowControlAPI'

export {}

declare global{
    interface Window {
          faWindowControlAPI: I_faWindowControlAPI
    }
}
