import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const verifyToken = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token === undefined) {
    return res.status(401).send({ error: true, message: 'Token missing' });
  } else {
    if (token.indexOf('Bearer') > -1) {
      token = token.split(' ')[1];
    }
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data) {
      return res.status(401).json({ message: 'Invalid token or expired token' });
    }

    req.user = data.user; // Attach user data to the request object
    next();
  } catch (error) {
    // console.log(error);
    return res.status(401).send({ error, message: 'Invalid token' });
  }
};

export default verifyToken;
