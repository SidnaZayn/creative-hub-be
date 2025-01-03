import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const SECRET = process.env.JWT_SECRET;

const hashPassword = (password) => bcrypt.hashSync(password, salt);

const comparePassword = (hashedPassword, password) => {
  return bcrypt.compareSync(password, hashedPassword);
};

const validatePassword = (password) => {
  if (password.length <= 5 || password === '') {
    return false;
  }
  return true;
};

const generateUserToken = (id, name, username, isAdmin) => {
  const token = jwt.sign(
    {
      id,
      name,
      username,
      isAdmin,
    },
    SECRET,
    { expiresIn: '12h' }
  );
  return token;
};

export { hashPassword, comparePassword, validatePassword, generateUserToken };
