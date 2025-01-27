interface ParsedMpesaMessage {
  transactionId: string;
  amount: number;
  contributorName: string;
  phoneNumber: string;
  date: string;
}

export const parseMpesaMessage = (message: string): ParsedMpesaMessage | null => {
  try {
    // Handle different M-Pesa message formats
    const patterns = {
      transactionId: /([A-Z0-9]{8,12})/,
      amount: /Ksh[.,\s]*(\d+[.,]?\d*)/i,
      phoneNumber: /(\d{10,12})/,
      date: /(\d{1,2}\/\d{1,2}\/\d{2,4})|(\d{1,2}-\d{1,2}-\d{2,4})/,
    };

    // Extract transaction ID (usually at start or after "Confirmed")
    const transactionIdMatch = message.match(patterns.transactionId);
    
    // Extract amount (handle different formats like "Ksh", "KES", with/without decimals)
    const amountMatch = message.match(patterns.amount);
    
    // Extract phone number
    const phoneMatch = message.match(patterns.phoneNumber);
    
    // Extract date
    const dateMatch = message.match(patterns.date);

    // Extract name (between "from" and phone number or date)
    const nameMatch = message.match(/from\s+([A-Z\s]+(?=\s+\d))/i) || 
                     message.match(/received\s+from\s+([A-Z\s]+(?=\s+\d))/i);

    if (!transactionIdMatch || !amountMatch || !phoneMatch) {
      console.log("Failed to parse M-Pesa message:", { 
        transactionId: transactionIdMatch,
        amount: amountMatch,
        phone: phoneMatch,
        name: nameMatch,
        date: dateMatch
      });
      return null;
    }

    // Clean and format the extracted data
    const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    const contributorName = nameMatch ? nameMatch[1].trim() : "Unknown";
    const date = dateMatch ? dateMatch[0] : new Date().toLocaleDateString();

    return {
      transactionId: transactionIdMatch[1],
      amount,
      contributorName,
      phoneNumber: phoneMatch[0],
      date,
    };
  } catch (error) {
    console.error('Error parsing M-Pesa message:', error);
    return null;
  }
};