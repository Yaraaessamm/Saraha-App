import { compareSync, hashSync } from "bcrypt";

export const hash = ({ plainText, salt_rounds } = {}) => {
  return hashSync(plainText, salt_rounds);
};

export const compare = ({ plainText, cipherText } = {}) => {
  return compareSync(plainText, cipherText);
};