export function validateLoginForm(formData) {
    const {username, password} = formData;
    const newErrors = {};

    const usernameErrors = validate(username, 'Username or email', 3, 255, false, "Username must be alphanumeric");
    const passwordErrors = validate(password, 'Password', 8, 255, passwordRegex, validationMessagePassword);

    if (usernameErrors) newErrors.username = usernameErrors;
    if (passwordErrors) newErrors.password = passwordErrors;
    return newErrors;
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