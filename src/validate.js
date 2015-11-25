function validate(itemSubmission, rules, itemTypes) {
  const itemType = itemTypes.find(type => type.uuid == itemSubmission.itemTypeUuid);
  let itemSubmissionErrors = {};
  let valid = true;
  let attributeErrors = validateAttributesWithRestrictedValues(itemSubmission.attributeValues, itemType)

  return { data: {
    valid,
    itemSubmissionErrors,
    attributeErrors
  }};
}

let booleanValueValidator = (value, label) => {
  let result =  { valid: true }

  if (value === "yes" || value === "no") {
    result.valid = false;
    result.message = label + " does not have a valid value selected"
  }

  return result
}

let selectValueValidator = (value, label, fieldOptions) => {
  let result =  { valid: true }
  let matchedValue = fieldOptions.options.find(opt => opt === value)

  if (!matchedValue) {
    result.valid = false;
    result.message = label + " does not have a valid value selected"
  }

  return result
}

function validateAttributesWithRestrictedValues(attributeValues, itemType) {
  let errors = {}
  for (let attributeDefinitionUUID of Object.keys(attributeValues)) {
    const attributeDefinition = itemType.attributeDefinitions.find(definition => definition.id == attributeDefinitionUUID);
    let position = -1;
    checkFieldOptions: for(let fieldOptions of attributeDefinition.options) {
      position = position + 1;
      let validator;
      switch (fieldOptions.type) {
        case "boolean":
          validator = booleanValueValidator;
          break;
        case "select":
          validator = selectValueValidator;
          break;
        default:
          continue checkFieldOptions;
      }

      let result = validator(attributeValues[attributeDefinitionUUID][position], attributeDefinition.label, fieldOptions)

      if (!result.valid) {
        errors[attributeDefinitionUUID] = errors[attributeDefinitionUUID] || [];
        errors[attributeDefinitionUUID][position] = result.message;
      }
    }

  }

  return errors;
// item_submission_attributes[:attributeValues].each do |attribute_id, attribute_values|
//   definition = item_type.attribute_definitions[attribute_id]
//   definition.options.each_with_index do |options, position|
//     validator_class = case options.fetch("type")
//                       when "select"
//                         AttributeSelectOptionValid
//                       when "boolean"
//                         AttributeIsBoolean
//                       else
//                         next
//                       end
//     validator = validator_class.new(attribute_values, "#{definition.label}:#{position}", definition)
//     next if validator.valid?
//
//     attribute_values_errors[attribute_id] ||= []
//     attribute_values_errors[attribute_id] << validator.message
//
//
//   end
// end
}


export default validate;

