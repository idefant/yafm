import path from 'path';

import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import express, { Router } from 'express';
import { auth } from 'express-openid-connect';

import errorMiddleware from '#middlewares/errorMiddleware';
import { oidcConfig } from '#oidcConfig';
import authRouter from '#routes/authRouter';
import commitRouter from '#routes/commitRouter';
import swaggerDocs from '#utils/swagger';

dotenvExpand.expand(dotenv.config({ path: '../.env' }));

const app = express();
const port = Number(process.env.BACKEND_PORT) || 8080;

app.use(auth(oidcConfig));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

app.use(express.static(path.resolve(__dirname, '../public')));

const router = Router();
router.use('/auth', authRouter);
router.use('/commit', commitRouter);
app.use('/api', router);

app.use(errorMiddleware);

swaggerDocs(app, port);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.listen(port, async () => {
  console.log(`YAFM API listening on port ${port}`);
});
