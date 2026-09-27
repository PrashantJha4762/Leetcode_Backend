import express from 'express';
import { pingHandler } from '../../controllers/ping.controller';
import { validateRequestBody } from '../../validators';
import { pingSchema } from '../../validators/ping.validator';

const pingRouter = express.Router();

pingRouter.get('/', pingHandler);
pingRouter.post('/', validateRequestBody(pingSchema), pingHandler);

export default pingRouter;
