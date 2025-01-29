interface ParsedMpesaMessage {
  transactionId: string;
  amount: number;
  contributorName: string;
  phoneNumber: string;
  date: string;
}

export const parseMpesaMessage = (message: string): ParsedMpesaMessage | null => {
  try {
    // Improved regex patterns for better matching
    const patterns = {
      // Match codes like QCY1234567 or similar formats
      transactionId: /([A-Z0-9]{8,12})/,
      // Match amounts with or without decimals, with Ksh/KES prefix
      amount: /(?:Ksh|KES)[.,\s]*(\d+(?:[.,]\d{2})?)/i,
      // Match 10-12 digit phone numbers, with or without country code
      phoneNumber: /(?:254|\+254|0)?([0-9]{9,10})/,
      // Match common date formats
      date: /(\d{1,2}\/\d{1,2}\/\d{2,4})|(\d{1,2}-\d{1,2}-\d{2,4})/,
      // Match name between "from" and the phone number
      name: /(?:from|received from)\s+([A-Z\s]+)(?=\s+\d)/i
    };

    // Extract transaction ID
    const transactionIdMatch = message.match(patterns.transactionId);
    if (!transactionIdMatch) {
      console.log("Failed to match transaction ID");
      return null;
    }

    // Extract amount
    const amountMatch = message.match(patterns.amount);
    if (!amountMatch) {
      console.log("Failed to match amount");
      return null;
    }

    // Extract phone number
    const phoneMatch = message.match(patterns.phoneNumber);
    if (!phoneMatch) {
      console.log("Failed to match phone number");
      return null;
    }

    // Extract name
    const nameMatch = message.match(patterns.name);
    if (!nameMatch) {
      console.log("Failed to match name");
      return null;
    }

    // Clean and format the extracted data
    const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    const contributorName = nameMatch[1].trim();
    const phoneNumber = phoneMatch[0];
    const date = new Date().toLocaleDateString();

    console.log("Parsed M-Pesa message:", {
      transactionId: transactionIdMatch[1],
      amount,
      contributorName,
      phoneNumber,
      date
    });

    return {
      transactionId: transactionIdMatch[1],
      amount,
      contributorName,
      phoneNumber,
      date,
    };
  } catch (error) {
    console.error('Error parsing M-Pesa message:', error);
    return null;
  }
};