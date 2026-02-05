import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors'; // Handles async errors automatically
import { routes } from './routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { setupSwagger } from './swagger';

export const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

setupSwagger(app);
app.use('/api', routes);

app.use(errorMiddleware);
