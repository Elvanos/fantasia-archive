export interface ProjectInterface {
  projectLoaded: boolean,
  projectName: string
}

function state (): ProjectInterface {
  return {
    projectLoaded: false,
    projectName: ""
  }
}

export default state
