import { useState, useEffect } from 'react';

interface PasswordValidationResult {
  password: string;
  confirmPassword: string;
  isPasswordValid: boolean;
  doPasswordsMatch: boolean;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  passwordFeedback: {
    message: string;
    isValid: boolean;
  };
  confirmPasswordFeedback: {
    message: string;
    isValid: boolean;
  };
  getInputClassName: (isValid: boolean) => string;
}

export const usePasswordValidation = (
  initialPassword = '', 
  initialConfirmPassword = '',
  color = '#7ECBC3' // Couleur primaire par défaut
): PasswordValidationResult => {
  const [password, setPassword] = useState(initialPassword);
  const [confirmPassword, setConfirmPassword] = useState(initialConfirmPassword);

  const isPasswordValid = password.length >= 8;
  const doPasswordsMatch = password === confirmPassword;

  const passwordFeedback = {
    message: password 
      ? isPasswordValid 
        ? '✓ Le mot de passe est valide'
        : 'Le mot de passe doit contenir au moins 8 caractères'
      : '',
    isValid: isPasswordValid
  };

  const confirmPasswordFeedback = {
    message: confirmPassword
      ? doPasswordsMatch
        ? '✓ Les mots de passe correspondent'
        : 'Les mots de passe ne correspondent pas'
      : '',
    isValid: doPasswordsMatch
  };

  const getInputClassName = (isValid: boolean) => {
    const baseClasses = `border-[${color}]/20 focus:border-[${color}] focus:ring-[${color}] transition-colors duration-200`;
    const invalidClasses = 'border-red-500 focus:ring-red-500 focus:border-red-500';
    
    if (!isValid && (password || confirmPassword)) {
      return `${baseClasses} ${invalidClasses}`;
    }
    return baseClasses;
  };

  return {
    password,
    confirmPassword,
    isPasswordValid,
    doPasswordsMatch,
    setPassword,
    setConfirmPassword,
    passwordFeedback,
    confirmPasswordFeedback,
    getInputClassName
  };
}; 