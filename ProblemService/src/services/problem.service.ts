import type { IProblem } from "../models/problem.model";
import type { IProblemRepository } from "../repositories/problem.repository";
import { sanitizeMarkdown } from "../utils/helpers/problem.helper";
import type { CreateProblemDto, UpdateProblemDto } from "../validators/proble.validaor";

export interface IProblemService{
    createProblem(problem:CreateProblemDto):Promise<IProblem>;
    getProblemById(id:string):Promise<IProblem|null>;
    getAllProblems():Promise<IProblem[]>;
    updateProblem(id:string,problem:UpdateProblemDto):Promise<IProblem|null>;
    deleteProblem(id:string):Promise<boolean>;
    findBydifficulty(difficulty:"easy"|"medium"|"hard"):Promise<IProblem[]>;
    searchProblems(query:string):Promise<IProblem[]>;
}
export class ProblemService implements IProblemService{
    static createProblem(body: any) {
        throw new Error("Method not implemented.");
    }
    private problemRepository:IProblemRepository;

    constructor(problemRepository:IProblemRepository){
        this.problemRepository=problemRepository;
    }
    async createProblem(problem:CreateProblemDto){
        const sanitizedpayload=Object.fromEntries(Object.entries({
            ...problem, //it means everything from problem
            description:await sanitizeMarkdown(problem.description),
            ...(problem.editorial !== undefined
                ? { editorial: await sanitizeMarkdown(problem.editorial) }
                : {}) //it means if
            //editorial exists then sanitize it
        }).filter(([, value]) => value !== undefined)) as Partial<IProblem>;
        return await this.problemRepository.createProblem(sanitizedpayload)
    }

    async getProblemById(id:string){
        return this.problemRepository.getProblemById(id);
    }

    async getAllProblems(){
        return this.problemRepository.getAllProblems();
    }

    async updateProblem(id:string,problem:UpdateProblemDto){
        const sanitizedPayload=Object.fromEntries(Object.entries({
            ...problem,
            ...(problem.description !== undefined
                ? { description: await sanitizeMarkdown(problem.description) }
                : {}),
            ...(problem.editorial !== undefined
                ? { editorial: await sanitizeMarkdown(problem.editorial) }
                : {})
        }).filter(([, value]) => value !== undefined)) as Partial<IProblem>;
        return this.problemRepository.updateProblem(id,sanitizedPayload);
    }

    async deleteProblem(id:string){
        return this.problemRepository.deleteProblem(id);
    }

    async findBydifficulty(difficulty:"easy"|"medium"|"hard"){
        return this.problemRepository.findBydifficulty(difficulty);
    }

    async searchProblems(query:string){
        return this.problemRepository.searchProblems(query);
    }
}
