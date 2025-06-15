
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validationService = {
  validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      errors.push('Email is required');
    } else if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    }
    
    return { isValid: errors.length === 0, errors };
  },

  validatePhoneNumber(phone: string): ValidationResult {
    const errors: string[] = [];
    const phoneRegex = /^\+254[0-9]{9}$/;
    
    if (!phone) {
      errors.push('Phone number is required');
    } else if (!phoneRegex.test(phone)) {
      errors.push('Please enter a valid Kenyan phone number (+254XXXXXXXXX)');
    }
    
    return { isValid: errors.length === 0, errors };
  },

  validateContribution(amount: number, targetAmount?: number): ValidationResult {
    const errors: string[] = [];
    
    if (!amount || amount <= 0) {
      errors.push('Contribution amount must be greater than 0');
    }
    
    if (amount > 1000000) {
      errors.push('Contribution amount cannot exceed KES 1,000,000');
    }
    
    if (targetAmount && amount > targetAmount) {
      errors.push('Contribution cannot exceed the group target amount');
    }
    
    return { isValid: errors.length === 0, errors };
  },

  validateGroupName(name: string): ValidationResult {
    const errors: string[] = [];
    
    if (!name || name.trim().length === 0) {
      errors.push('Group name is required');
    } else if (name.length < 3) {
      errors.push('Group name must be at least 3 characters');
    } else if (name.length > 100) {
      errors.push('Group name cannot exceed 100 characters');
    }
    
    return { isValid: errors.length === 0, errors };
  },

  validateTaskTitle(title: string): ValidationResult {
    const errors: string[] = [];
    
    if (!title || title.trim().length === 0) {
      errors.push('Task title is required');
    } else if (title.length < 2) {
      errors.push('Task title must be at least 2 characters');
    } else if (title.length > 200) {
      errors.push('Task title cannot exceed 200 characters');
    }
    
    return { isValid: errors.length === 0, errors };
  },

  validateTargetAmount(amount: number): ValidationResult {
    const errors: string[] = [];
    
    if (!amount || amount <= 0) {
      errors.push('Target amount must be greater than 0');
    }
    
    if (amount > 10000000) {
      errors.push('Target amount cannot exceed KES 10,000,000');
    }
    
    return { isValid: errors.length === 0, errors };
  },

  validateEndDate(date: Date): ValidationResult {
    const errors: string[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!date) {
      errors.push('End date is required');
    } else if (date <= today) {
      errors.push('End date must be in the future');
    }
    
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 5);
    
    if (date > maxDate) {
      errors.push('End date cannot be more than 5 years from now');
    }
    
    return { isValid: errors.length === 0, errors };
  }
};
