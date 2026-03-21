import { hashSync, compareSync} from "bcrypt";
import { saltRounds } from "../../../config/env.services.js";
export const hash = ({ plainText, saltRounds = Number(saltRounds) } = {}) => {
  return hashSync(plainText, saltRounds);
};

export const compare = ({plainText, cipherText} = {}) => {
  return compareSync(plainText, cipherText);
};