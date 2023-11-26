export function mdListArrayConvertor (mdString: string) {
  // Remove leading "- "
  let removedLeads = mdString.replaceAll('\n- ', '\n')
  if (removedLeads.substring(0, 2) === '- ') { removedLeads = removedLeads.slice(2) }

  // Cleaned up ` characters and replace them with "
  const cleanedString = removedLeads.replaceAll('`', '"')

  // Split the list by leading newline characters and remove the last empty line (if present)
  const tipArray = cleanedString.split('\n')
  if (tipArray[tipArray.length - 1] === '') { tipArray.pop() }
  return tipArray
}
