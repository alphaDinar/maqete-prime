export const fixContact = (contact: string) => {
  const formattedNumber = `+${contact.slice(0, 3)} ${contact.slice(3, 5)} ${contact.slice(5, 8)} ${contact.slice(8)}`;
  return formattedNumber;
}

export const checkContact = (phoneCode: string, contact: string) => {
  const phoneCodeTemp = '+' + phoneCode;
  const regex = new RegExp("^" + phoneCodeTemp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "\\d{9}$");
  return regex.test('+' + phoneCode + contact);
}

export const joinContact = (contact: string) => {
  const joinedContact = contact.replace(/\s/g, '');
  return joinedContact;
}


export const checkPassLength = (pass: string) => {
  const isValid = /.{8,}/.test(pass);
  return isValid;
}

export const checkPassNumber = (pass: string) => {
  const isValid = /[0-9]/.test(pass);
  return isValid;
}

export const checkPassLower = (pass: string) => {
  const isValid = /[a-z]/.test(pass);
  return isValid;
}

export const checkPassUpper = (pass: string) => {
  const isValid = /[A-Z]/.test(pass);
  return isValid;
}

export const checkPassSpecial = (pass: string) => {
  const isValid = /[^A-Za-z0-9]/.test(pass);
  return isValid;
}