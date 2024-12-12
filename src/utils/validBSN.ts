export const isValidBSN = (bsn: number): boolean => {
    // Convert the number to a string to handle leading zeros
    let bsnString = bsn.toString().padStart(9, '0'); // Ensure it is a 9-digit string
    
    // Ensure the BSN is exactly a 9-digit string
    const regex = /^[0-9]{9}$/;
    if (!regex.test(bsnString)) {
      return false; // If it's not exactly 9 digits, it's invalid
    }

    // Add specific check for all zeros (invalid BSN)
    if (bsnString === '000000000') {
      return false; // All-zero BSN is invalid
    }

    // Convert the BSN string to an array of digits
    const digits = bsnString.split('').map(Number);

    // Calculate the weighted sum of the first 8 digits
    const weightedSum = digits.slice(0, 8).reduce((acc, digit, index) => {
      return acc + digit * (9 - index); // 9, 8, 7,... multiplier
    }, 0);

    // Check the checksum condition: weighted sum modulo 11 should equal the 9th digit
    const checkDigit = digits[8];
    return (weightedSum % 11 === checkDigit);
};
