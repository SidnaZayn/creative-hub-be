import 'dotenv/config';
import express from 'express';
import cors from "cors";
import auth from './src/main/auth/auth.router.js';
import tests from './src/main/tests/tests.router.js';
import space from './src/main/space/space.router.js';
import spaceImage from './src/main/space-image/space-image.router.js';
import spaceSession from './src/main/space-session/space-session.router.js';
import spacePolicy from './src/main/space-policy/space-policy.router.js';
import category from './src/main/category/category.router.js';
import booking from './src/main/booking/booking.router.js';
import bodyParser from 'body-parser';
import { createSuperAdmin } from './src/main/auth/auth.service.js';

const app = express();

app.use(bodyParser.json());
app.use(cors())
app.use('/', tests);
app.use('/api', auth);
app.use('/api', spaceImage);
app.use('/api', spaceSession);
app.use('/api', spacePolicy);
app.use('/api', space);
app.use('/api', category);
app.use('/api', booking);

const PORT = 5000;
if (process.env.NODE_ENV === 'test') {
  app.access_token = process.env.ACCESS_TOKEN;
}
// await createSuperAdmin();
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Running on PORT ${PORT}`);
  });
}

export default app;
