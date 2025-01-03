import express from 'express';
import auth from './src/main/auth/auth.router.js';
import tests from './src/main/tests/tests.router.js';
import space from './src/main/space/space.router.js';
import category from './src/main/category/category.router.js';
import bodyParser from 'body-parser';
import { createSuperAdmin } from './src/main/auth/auth.service.js';

const app = express();

app.use(bodyParser.json());
app.use('/', tests);
app.use('/api', auth);
app.use('/api', space);
app.use('/api', category);

const PORT = 5000;
// await createSuperAdmin();
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Running on PORT ${PORT}`);
  });
}

export default app;
