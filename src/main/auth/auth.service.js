import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword, generateUserToken } from '../../helper/helper.js';

const prisma = new PrismaClient();
const base_url = process.env.BASE_URL;

const register = async (req, res) => {
  const { name, username, email, password, password_confirmation, age } = req.body;
  if (!username || !email || !password || !name || !age) {
    return res
      .status(400)
      .send({ error: true, message: 'Name, username, email, password and age are required' });
  }

  const isEmailExist = await prisma.user.findUnique({ where: { email: email } });
  if (isEmailExist !== null) {
    return res.status(409).send({ error: true, message: 'Email already exists' });
  }

  const isUsernameExist = await prisma.user.findUnique({ where: { username: username } });
  if (isUsernameExist !== null) {
    return res.status(409).send({ error: true, message: 'Username already exists' });
  }

  if (password !== password_confirmation) {
    return res.status(400).send({ error: true, message: 'Password does not match' });
  }

  if (age < 18) {
    return res.status(400).send({ error: true, message: 'Age is restricted' });
  }

  try {
    const newPassword = hashPassword(password);
    const users = await prisma.user.create({
      data: {
        name: name,
        username: username,
        email: email,
        password: newPassword,
        passwordHash: password,
        age: age,
      },
    });
    delete users.passwordHash;
    return res.status(201).send(users);
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: true, message: error });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .send({ error: true, message: 'Email/username and/or password are required' });
  }
  try {
    const user = await prisma.user.findFirst({
      where: { OR: [{ username: { equals: username } }, { email: { equals: username } }] },
    });

    if (user === null) {
      return res.status(401).send({ error: true, message: 'Unauthorized' });
    }

    if (!comparePassword(user.password, password)) {
      return res.status(401).send({ error: true, message: 'Unauthorized' });
    }

    const token = generateUserToken(user.id, user.name, user.username, user.isAdmin);
    const _links = {
      self: {
        href: `${base_url}/api/auth/me`,
      },
      logout: {
        href: `${base_url}/api/auth/logout`,
        method: 'POST',
      },
    }
    return res.status(200).send({ token, _links });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: true, message: error });
  }
};

const createSuperAdmin = async () => {
  try {
    const newPassword = hashPassword(process.env.SUPERADMIN_PASSWORD);
    const superAdmin = await prisma.user.create({
      data: {
        name: process.env.SUPERADMIN_NAME,
        username: process.env.SUPERADMIN_USERNAME,
        email: process.env.SUPERADMIN_EMAIL,
        password: newPassword,
        passwordHash: process.env.SUPERADMIN_PASSWORD,
        age: process.env.SUPERADMIN_AGE,
        isAdmin: true,
      },
    });
    console.log('super admin created')
    return superAdmin;
  } catch (error) {
    // console.log(error)
    return
  }
};

export { register, login, createSuperAdmin };
