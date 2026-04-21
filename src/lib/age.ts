export function calculateAge(birthYear: number): number {
  return new Date().getFullYear() - birthYear;
}
