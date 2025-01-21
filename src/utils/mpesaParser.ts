interface ParsedMpesaMessage {
  transactionId: string;
  amount: number;
  contributorName: string;
  phoneNumber: string;
  date: string;
}

export const parseMpesaMessage = (message: string): ParsedMpesaMessage | null => {
  // Example message: TAJ1RBVSYF Confirmed.You have received Ksh30.00 from MOHAMMED AGESA 0722370253 on 19/1/25 at 4:37 PM
  try {
    const transactionIdMatch = message.match(/^([A-Z0-9]+)/);
    const amountMatch = message.match(/Ksh([\d,.]+)/);
    const nameMatch = message.match(/from ([A-Z\s]+)/);
    const phoneMatch = message.match(/(\d{10})/);
    const dateMatch = message.match(/on (\d{1,2}\/\d{1,2}\/\d{2})/);

    if (!transactionIdMatch || !amountMatch || !nameMatch || !phoneMatch || !dateMatch) {
      return null;
    }

    return {
      transactionId: transactionIdMatch[1],
      amount: parseFloat(amountMatch[1].replace(',', '')),
      contributorName: nameMatch[1].trim(),
      phoneNumber: phoneMatch[1],
      date: dateMatch[1],
    };
  } catch (error) {
    console.error('Error parsing M-Pesa message:', error);
    return null;
  }
};