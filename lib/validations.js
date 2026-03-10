const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  return EMAIL_REGEX.test(email.trim());
}

export function isValidPassword(password) {
  if (!password || typeof password !== "string") return false;
  return password.length >= MIN_PASSWORD_LENGTH;
}

export function getEmailError(email) {
  if (!email?.trim()) return "Email is required";
  if (!isValidEmail(email)) return "Please enter a valid email address";
  return null;
}

export function getPasswordError(password, isRegister = false) {
  if (!password) return "Password is required";
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return null;
}
