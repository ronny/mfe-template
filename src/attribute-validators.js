const booleanValueValidator = (value, label) => {
  let result =  { valid: true }

  if (value === "yes" || value === "no") {
    result.valid = false;
    result.message = label + " does not have a valid value selected"
  }

  return result
}

const selectValueValidator = (value, label, fieldOptions) => {
  let result =  { valid: true }
  let matchedValue = fieldOptions.options.find(opt => opt === value)

  if (!matchedValue) {
    result.valid = false;
    result.message = label + " does not have a valid value selected"
  }

  return result
}

export default {
  booleanValueValidator,
  selectValueValidator,
}

