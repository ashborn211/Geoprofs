export const isValidBSN = (bsn: number): boolean => {
    // Convert the number to a string and remove leading zeros
    let bsnString = bsn.toString();

    // Remove leading zeros by parsing it as an integer and converting back to string
    bsnString = String(parseInt(bsnString, 10)); // This removes leading zeros automatically
    
    // Ensure the BSN is between 8 and 9 digits
    if (bsnString.length < 8 || bsnString.length > 9) {
        return false; // If the length is not exactly 9 digits, it's invalid
    }
    
    // If less than 9 digits, pad with leading zeros to make it 9 digits
    bsnString = bsnString.padStart(9, '0');
    
    // Ensure the BSN is exactly 9 digits (no more, no less)
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
