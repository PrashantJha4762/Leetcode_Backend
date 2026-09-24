import express from 'express'
import pingrouter from './pingrouter';
import problemRouter from './problem.router';

const v1Router=express.Router();

v1Router.use('/ping',pingrouter);
v1Router.use('/problems',problemRouter);

export default v1Router;
