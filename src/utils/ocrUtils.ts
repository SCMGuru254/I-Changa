
/**
 * Utility functions for parsing OCR text from receipts/manual records.
 */

interface ExtractedData {
    amount?: number;
    date?: Date;
    description?: string;
    foundName?: string;
}

export const parseOCRText = (text: string, knownNames: string[] = []): ExtractedData => {
    const result: ExtractedData = {
        description: text.trim().substring(0, 100) // Default description is the first 100 chars
    };

    // 1. Extract Amount (Currency detection)
    // Look for KES, Ksh, or just numbers with commonly used payment keywords
    const amountRegex = /(?:KES|Ksh|Shs|Amount|Paid)[\s.:]*([0-9,]+(?:\.[0-9]{2})?)/i;
    // Fallback: look for largest number that "looks like" money (has commas or decimals)
    const looseNumberRegex = /\b[1-9][0-9]{0,2}(?:,[0-9]{3})*(?:\.[0-9]{2})?\b/g;

    const amountMatch = text.match(amountRegex);
    if (amountMatch && amountMatch[1]) {
        result.amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    } else {
        // Try to find standalone numbers
        const numbers = text.match(looseNumberRegex);
        if (numbers) {
            // Simple heuristic: largest number in a receipt is often the total
            const parsedNumbers = numbers.map(n => parseFloat(n.replace(/,/g, '')));
            result.amount = Math.max(...parsedNumbers);
        }
    }

    // 2. Extract Date
    // Common formats: DD/MM/YYYY, DD-MM-YYYY, DD MMM YYYY
    const dateRegex = /\b(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})\b|\b(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})\b/i;
    const dateMatch = text.match(dateRegex);

    if (dateMatch) {
        const dateStr = dateMatch[0];
        const parsedDate = new Date(dateStr);
        if (!isNaN(parsedDate.getTime())) {
            result.date = parsedDate;
        }
    }

    // 3. Extract Name (Fuzzy match against known list)
    if (knownNames.length > 0) {
        const lowerText = text.toLowerCase();
        for (const name of knownNames) {
            if (lowerText.includes(name.toLowerCase())) {
                result.foundName = name;
                break; // Stop at first match provided it's the most likely contributor
            }
        }
    }

    return result;
};
