import { booleanValueValidator, selectValueValidator } from "./attribute-validators"
import ruleValidators from "./attribute-rule-validators"
import { merge } from "lodash"

function validate(itemSubmission, rules, itemTypes) {
  const itemType = itemTypes.find(type => type.uuid == itemSubmission.itemTypeUuid);
  let valid = true;
  let automaticAttributeErrors = validateAttributesWithRestrictedValues(itemSubmission.attributeValues, itemType)
  let attributeRuleErrors = validateAttributesWithRules(itemSubmission.attributeValues, rules, itemType)

  return { data: {
    valid,
    errors: {
      // plenty of problems with mergine and per field errors right now :/
      attributeValues: merge(automaticAttributeErrors, attributeRuleErrors),
    },
  }};
}

function validateAttributesWithRestrictedValues(attributeValues, {attributeDefinitions}) {
  let errors = {}
  for (let attributeDefinitionUUID of Object.keys(attributeValues)) {
    const attributeDefinition = attributeDefinitions.find(definition => definition.id == attributeDefinitionUUID);
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

function validateAttributesWithRules(attributeValues, rules, {attributeDefinitions}) {
  let errors = {}
  for (let rule of rules) {
    const attributeIdentifier = rule.attribute
    const ruleName = rule.check
    const ruleOptions = rule.options
    const [attributeLabel] = attributeIdentifier.split(":")
    const attributeDefinition = attributeDefinitions.find(definition => definition.label === attributeLabel)
    const specifiedAttributeValues = attributeValues[attributeDefinition.id]

    var result = (ruleValidators[ruleName]|| ruleValidators.defaultFunction)(specifiedAttributeValues, attributeIdentifier, attributeDefinition, ruleOptions)
    if (!result.valid) {
      errors[attributeDefinition.id] = errors[attributeDefinition.id] || [];
      errors[attributeDefinition.id] = result.messages; // actually ought to merge?
    }
  }

  return errors
}


export default validate;

