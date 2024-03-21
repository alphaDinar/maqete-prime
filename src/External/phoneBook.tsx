import bcrypt from 'bcryptjs';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { fireAuth, fireStoreDB } from '@/Firebase/base';

export const makePassword = async (password: string) => {
  const hash = await bcrypt.hash(password, 10);
  return hash;
}

export const checkPassword = async (password: string, passVal: string) => {
  const isCorrect = await bcrypt.compare(password, passVal);
  return isCorrect;
}

export const checkUser = async (contact: string, password: string) => {
  const userDoc = await getDoc(doc(fireStoreDB, 'PhoneBook/', contact));

  if (userDoc.exists()) {
    const isCorrect = await bcrypt.compare(password, userDoc.data().password);
    if (isCorrect) {
      const contactKey = userDoc.data().contactKey + '@gmail.com';
      const passKey = userDoc.data().passKey;
      await signInWithEmailAndPassword(fireAuth, contactKey, passKey)
      // .then((user) => {
      // })
      return true;
    } else {
      // console.log('wrong')
      return false;
    }
  } else {
    return false;
  }
}