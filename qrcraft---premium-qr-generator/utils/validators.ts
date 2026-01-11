
import { InputType, ValidationResult } from '../types';

export const validateInput = (value: string, type: InputType): ValidationResult => {
  if (!value.trim()) {
    return { isValid: false, message: 'Input cannot be empty' };
  }

  switch (type) {
    case InputType.URL:
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      return {
        isValid: urlPattern.test(value),
        message: urlPattern.test(value) ? '' : 'Please enter a valid URL (e.g., https://google.com)'
      };
    case InputType.EMAIL:
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return {
        isValid: emailPattern.test(value),
        message: emailPattern.test(value) ? '' : 'Please enter a valid email address'
      };
    case InputType.PHONE:
      const phonePattern = /^\+?[\d\s-]{7,15}$/;
      return {
        isValid: phonePattern.test(value),
        message: phonePattern.test(value) ? '' : 'Please enter a valid phone number'
      };
    case InputType.TEXT:
    default:
      return { isValid: true, message: '' };
  }
};

export const getPlaceholder = (type: InputType): string => {
  switch (type) {
    case InputType.URL: return 'https://example.com';
    case InputType.EMAIL: return 'hello@example.com';
    case InputType.PHONE: return '+1 234 567 890';
    case InputType.TEXT: return 'Enter any text or message...';
    default: return 'Type here...';
  }
};
