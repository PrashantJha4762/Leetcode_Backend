import type { IProblem } from "../models/problem.model";
import type { IProblemRepository } from "../repositories/problem.repository";

export interface IProblemService{
    createProblem(problem:Partial<IProblem>):Promise<IProblem>;
    getProblemById(id:string):Promise<IProblem|null>;
    getAllProblems():Promise<IProblem[]>;
    updateProblem(id:string,problem:Partial<IProblem>):Promise<IProblem|null>;
    deleteProblem(id:string):Promise<boolean>;
    findBydifficulty(difficulty:"easy"|"medium"|"hard"):Promise<IProblem[]>;
    searchProblems(query:string):Promise<IProblem[]>;
}
export class ProblemServie implements IProblemService{
    private problemRepository:IProblemRepository;

    constructor(problemRepository:IProblemRepository){
        this.problemRepository=problemRepository;
    }
    
}
