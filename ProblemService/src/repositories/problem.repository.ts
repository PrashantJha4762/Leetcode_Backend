
// export async function findby difficulty(difficulty:"easy"|"medium"|"hard"):Promise<IProblem[]>{
//     return await Problem.find({difficulty:difficulty}).sort({created_at:-1});
// }

import { Problem, type IProblem } from "../models/problem.model";


// export async function searchproblems(query:string):Promise<IProblem[]>{
// //     const regex=new RegExp(query,"i");
// //     return await Problem.find({$or:[{title:regex},{description:regex}]}).sort({created_at:-1});
// // }

export interface IProblemRepository{
    createProblem(problem:Partial<IProblem>):Promise<IProblem>;
    getProblemById(id:string):Promise<IProblem|null>;
    getAllProblems():Promise<IProblem[]>;
    updateProblem(id:string,problem:Partial<IProblem>):Promise<IProblem|null>;
    deleteProblem(id:string):Promise<boolean>;
    findBydifficulty(difficulty:"easy"|"medium"|"hard"):Promise<IProblem[]>;
    searchProblems(query:string):Promise<IProblem[]>;
}
export class ProblemRepository implements IProblemRepository{
    async createProblem(problem:Partial<IProblem>):Promise<IProblem>{
        const newProblem=new Problem(problem);
        return await newProblem.save();
    }
    async getProblemById(id:string):Promise<IProblem|null>{
        return await Problem.findById(id);
    }
    async getAllProblems():Promise<IProblem[]>{
        return await Problem.find().sort({created_at:-1});
    }
    async updateProblem(id:string,problem:Partial<IProblem>):Promise<IProblem|null>{
        return await Problem.findByIdAndUpdate(id,problem,{new:true});
    }
    async deleteProblem(id:string):Promise<boolean>{
        const result=await Problem.findByIdAndDelete(id);
        return result!==null;
    }
    async findBydifficulty(difficulty:"easy"|"medium"|"hard"):Promise<IProblem[]>{
        return await Problem.find({difficulty:difficulty}).sort({created_at:-1});
    }
    async searchProblems(query:string):Promise<IProblem[]>{
        const regex=new RegExp(query,"i");
        return await Problem.find({$or:[{title:regex},{description:regex}]}).sort({created_at:-1});
    }
}