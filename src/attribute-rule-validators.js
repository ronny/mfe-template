const requiredAttribute = (specifiedAttributeValues, attributeIdentifier, attributeDefinition) => {
  let result =  { valid: true,  messages: []}
  const expectedNumberOfValues = attributeDefinition.options.length

  for (let i=0; i < expectedNumberOfValues; i++) {
    const value = specifiedAttributeValues[i]
    if (value === null || value === undefined || value.trim() === ""){
      result.valid = false
      result.messages[i] = attributeDefinition.label + " is required."
    }
  }
  return result
}

const matchesRegex = (specifiedAttributeValues, attributeIdentifier, attributeDefinition, {regex, message}) => {
  let result =  { valid: true,  messages: []}
  regex = new RegExp(regex);
  let [,position] = attributeIdentifier.split(":")
  position = position || 0

  if (!regex.test(specifiedAttributeValues[position] || "")) {
    result.valid = false
    result.messages[position] = message
  }

  return result
}

const rangeValid = (specifiedAttributeValues, attributeIdentifier, attributeDefinition, {greaterThan, lessThan}) => {
  let result =  { valid: true,  messages: []}
  let [,position] = attributeIdentifier.split(":")
  position = position || 0
  const value = specifiedAttributeValues[position]
  if (value < greaterThan) {
    result.valid = false
    result.messages[position] = attributeDefinition.label + " is less than the allowed minimum of " + greaterThan
  }else if (value > lessThan) {
    result.valid = false
    result.messages[position] = attributeDefinition.label + " is more than the allowed minimum of " + lessThan
  }

  return result
}

export default {
  required: requiredAttribute,
  matches: matchesRegex,
  rangeValid,
  defaultFunction: () => {
    return { valid: true }
  }
}

