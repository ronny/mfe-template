import { booleanValueValidator, selectValueValidator } from "./attribute-validators"

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
}


export default validate;

