export function validateEmail(email: string): string | null {
  const normalized = email.trim();
  if (!normalized) return "Email address is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return "Enter a valid email address.";
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  return null;
}

export function validateFullName(fullName: string): string | null {
  if (!fullName.trim()) return "Full name is required.";
  if (fullName.trim().length < 2) return "Enter your full name.";
  return null;
}
