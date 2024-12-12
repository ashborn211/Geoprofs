export const isValidBSN = (bsn: string): boolean => {
    
    if (bsn.length === 8) {
        bsn = '0' + bsn; // Add leading zero to make it 9 digits
      }    
    
    // Ensure the BSN is exactly a 9-digit string
    const regex = /^[0-9]{9}$/;
    if (!regex.test(bsn)) {
      return false; // If it's not exactly 9 digits, it's invalid
    }
  
    // Add specific check for all zeros (invalid BSN)
    if (bsn === '000000000') {
      return false; // All-zero BSN is invalid
    }
    
  
    // Convert the BSN to an array of digits (leading zeros are preserved as part of the string)
    const digits = bsn.split('').map(Number);
    
  
    // Calculate the weighted sum of the first 8 digits
    const weightedSum = digits.slice(0, 8).reduce((acc, digit, index) => {
      return acc + digit * (9 - index); // 9, 8, 7,... multiplier
    }, 0);
  
    // Check the checksum condition: weighted sum modulo 11 should equal the 9th digit
    const checkDigit = digits[8];
    return (weightedSum % 11 === checkDigit);
  };
  