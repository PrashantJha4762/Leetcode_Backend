import express from 'express';
import {  validateRequestBody, validateRequestParams } from '../../validators';
import { ProblemSchema, findByDifficultySchema, Updateschema } from '../../validators/proble.validaor';
import { ProblemController } from '../../controllers/problem.controller';

const problemRouter = express.Router();


problemRouter.post(
    '/', 
    validateRequestBody(ProblemSchema), 
    ProblemController.createProblem);


problemRouter.get(
    '/:id',
    ProblemController.getProblemById);


problemRouter.get(
    '/', 
    ProblemController.getAllProblems);


problemRouter.put(
    '/:id', 
    validateRequestBody(Updateschema),
    ProblemController.updateProblem);


problemRouter.delete(
    '/:id', 
    ProblemController.deleteProblem);

problemRouter.get(
    '/difficulty/:difficulty', 
    validateRequestParams(findByDifficultySchema),
    ProblemController.findByDifficulty);

problemRouter.get(
    '/search', 
    ProblemController.searchProblems);

export default problemRouter;
