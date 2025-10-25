export class ReferralCodeUtil {
  static generate(name: string): string {
    const cleanName = name.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4);
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${cleanName}${randomStr}`;
  }

  static isValid(code: string): boolean {
    return /^[A-Z0-9]{6,12}$/.test(code);
  }
}