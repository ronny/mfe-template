function validate(itemSubmission, rules, itemTypes) {
  let itemSubmissionErrors = {};
  console.log(itemSubmission)
  console.log(rules)
  console.log(itemTypes)

  return { data: { itemSubmissionErrors }};
}

export default validate;

