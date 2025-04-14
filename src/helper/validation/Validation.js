export function validateLoginForm(formData) {
  const {username, password} = formData;
  const newErrors = {};

  const usernameErrors = validate(username, 'Username or email', 3, 255, false, "Username must be alphanumeric");
  const passwordErrors = validate(password, 'Password', 8, 255, passwordRegex, validationMessagePassword);

  if (usernameErrors) newErrors.username = usernameErrors;
  if (passwordErrors) newErrors.password = passwordErrors;

  const isValid = Object.keys(newErrors).length === 0;
  return {
    error: isValid,
    validation: newErrors
  }
}

export function validatePassword(password) {
  let newErrors = false;
  const passwordErrors = validate(password, 'Password', 8, 255, passwordRegex, validationMessagePassword);
  if (passwordErrors) newErrors = true;
  return newErrors;
}

export function passwordRequirements(password, setRequirements, setShowRequirements, show = false) {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  setRequirements({
    uppercase: hasUpperCase,
    lowercase: hasLowerCase,
    number: hasNumber,
    special: hasSpecial
  });

  const isSomeValid =
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSpecial;
  if (show) {
    setShowRequirements(!isSomeValid);
  } else {
    setShowRequirements(false);
  }

}

/**
 *
 * @param value String
 * @param field String
 * @param min Integer
 * @param max Integer
 * @param regex String
 * @param message String
 * @returns {*|string}
 */
function validate(value, field, min, max, regex, message) {
  if (!value) return `${field} is required`;
  if (value?.length < min) return `${field} must have at least ${min} characters`;
  if (value?.length > max) return `${field} must have at least ${max} characters`;
  if (regex && !regex.test(value)) return message;
  return '';
}

/**
 * Validate password message.
 *
 * @type {string}
 */
const validationMessagePassword = `
    Must contain an upper case letter. <br>
    Must contain a lower case letter. <br>
    Must contain a number. <br>
    Must contain a special character.
`;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
