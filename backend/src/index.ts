import path from 'path';

import cors from 'cors';
import dotenv from 'dotenv';
import express, { Router } from 'express';

import errorMiddleware from '#middlewares/errorMiddleware';
import commitRouter from '#routes/commitRouter';
import swaggerDocs from '#utils/swagger';

dotenv.config({ path: '../.env' });

const app = express();
const port = Number(process.env.PORT) || 8080;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

app.use(cors());
app.use(express.json());

app.use(express.static(path.resolve(__dirname, '../public')));

const router = Router();
router.use('/commit', commitRouter);
app.use('/api', router);

app.use(errorMiddleware);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.listen(port, async () => {
  console.log(`YAFM API listening on port ${port}`);
  swaggerDocs(app, port);
});
