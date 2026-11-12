export interface PasswordStrength { score: number; label: string; suggestions: string[]; }

// Local guidance only: passwords are never sent to a strength-checking service.
export function passwordStrength(password: string): PasswordStrength {
  if (!password) return { score: 0, label: 'Not entered', suggestions: ['Use a unique password or a phrase of several unrelated words.'] };
  const length = Array.from(password).length;
  const common = /password|qwerty|123456|letmein|welcome|admin|udupi|tejasvi/i.test(password);
  const repeated = /^(.)\1+$/u.test(password) || /^(.{1,4})\1+$/u.test(password);
  const predictable = /^(?:[0-9]+|[a-z]*abcdefghijklmnopqrstuvwxyz[a-z]*|[a-z]*zyxwvutsrqponmlkjihgfedcba[a-z]*)$/i.test(password);
  const suggestions: string[] = [];
  let score = length < 8 ? 1 : length < 12 ? 2 : length < 16 ? 2 : length < 20 ? 3 : 4;
  const varieties = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9\s]/].filter(rule => rule.test(password)).length;
  if (length >= 12 && varieties >= 3) score = Math.min(4, score + 1);
  if (common || repeated || predictable) score = 1;
  if (length < 12) suggestions.push('Use at least 12 characters.');
  else if (length < 16) suggestions.push('Aim for 16 or more characters, or use several unrelated words.');
  if (common || repeated || predictable) suggestions.push('Avoid common passwords, names, number sequences, and repeated patterns.');
  if (new TextEncoder().encode(password).length > 72) { score = 0; suggestions.push('This password is too long to save. Shorten it, especially if it contains emoji.'); }
  if (!suggestions.length) suggestions.push('Keep it unique to this account and save it in a password manager.');
  return { score, label: ['Too long', 'Very weak', 'Weak', 'Fair', 'Strong'][score], suggestions };
}
