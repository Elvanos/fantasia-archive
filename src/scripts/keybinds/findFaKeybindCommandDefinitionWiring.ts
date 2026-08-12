import type { I_faKeybindCommandDefinition } from 'app/types/I_faKeybindsDomain'

import { FA_KEYBIND_COMMAND_DEFINITIONS } from './faKeybindCommandDefinitions_manager'

export function findFaKeybindCommandDefinition (
  id: I_faKeybindCommandDefinition['id']
): I_faKeybindCommandDefinition | undefined {
  return FA_KEYBIND_COMMAND_DEFINITIONS.find((d) => d.id === id)
}
