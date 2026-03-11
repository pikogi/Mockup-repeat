/**
 * Valida una contraseña según los requisitos especificados
 * @param {string} password - La contraseña a validar
 * @returns {object} - Objeto con información de validación
 */
export function validatePassword(password) {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const errors = [];
  if (!hasMinLength) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  if (!hasUppercase) {
    errors.push('La contraseña debe contener al menos una letra mayúscula');
  }
  if (!hasNumber) {
    errors.push('La contraseña debe contener al menos un número');
  }

  return {
    isValid: hasMinLength && hasUppercase && hasNumber,
    errors,
    requirements: {
      hasMinLength,
      hasUppercase,
      hasNumber,
    },
  };
}

/**
 * Obtiene el mensaje de requisito con su estado
 * @param {boolean} isMet - Si el requisito se cumple
 * @param {string} message - El mensaje del requisito
 * @returns {object} - Objeto con el mensaje y estado
 */
export function getRequirementStatus(isMet, message) {
  return {
    isMet,
    message,
  };
}

