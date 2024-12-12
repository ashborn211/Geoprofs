export const convertTimestampToString = (timestamp: any) => {
    if (!timestamp) {
      console.error("Invalid timestamp:", timestamp); // Log invalid timestamp
      return "Invalid Date"; // Return a fallback message if timestamp is missing
    }
  
    // Check if the timestamp is a Firestore Timestamp
    if (
      timestamp.seconds === undefined ||
      timestamp.nanoseconds === undefined
    ) {
      console.error("Invalid Firestore Timestamp:", timestamp); // Log invalid Firestore Timestamp
      return "Invalid Date"; // Return a fallback message if not a valid Firestore Timestamp
    }
  
    // Convert Firestore timestamp to JavaScript Date
    const date = new Date(timestamp.seconds * 1000); // Firestore Timestamp to JS Date
    if (isNaN(date.getTime())) {
      console.error("Invalid Date object:", date); // Log if date conversion fails
      return "Invalid Date"; // Return a fallback message if conversion fails
    }
  
    return date.toLocaleDateString(); // Convert to local date string
  };
  