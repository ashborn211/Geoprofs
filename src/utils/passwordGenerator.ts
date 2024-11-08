export const generatePassword = (length = 10) => {
    const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numericChars = "0123456789";
    const specialChars = "!@#$%^&*()_+-=[]{}|;':,.<>?";
  
    // Ensure the password includes at least one character from each category
    const randomUpperCase = upperCaseChars.charAt(Math.floor(Math.random() * upperCaseChars.length));
    const randomLowerCase = lowerCaseChars.charAt(Math.floor(Math.random() * lowerCaseChars.length));
    const randomNumeric = numericChars.charAt(Math.floor(Math.random() * numericChars.length));
    const randomSpecial = specialChars.charAt(Math.floor(Math.random() * specialChars.length));
  
    // Fill the remaining characters randomly from all categories
    let password = randomUpperCase + randomLowerCase + randomNumeric + randomSpecial;
  
    const allChars = upperCaseChars + lowerCaseChars + numericChars + specialChars;
    for (let i = password.length; i < length; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
  
    // Shuffle the password to prevent predictable patterns
    password = password.split('').sort(() => Math.random() - 0.5).join('');
  
    return password;
  };
  