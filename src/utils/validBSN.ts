export function isValidBSN(bsn: string): boolean {
    if (!/^\d{8,9}$/.test(bsn)) return false;
    const digits = bsn.padStart(9, '0').split('').map(Number);
    const sum = digits.reduce((acc, val, idx) => acc + val * (9 - idx), 0) - digits[8];
    return sum % 11 === 0 && sum !== 0;
}
