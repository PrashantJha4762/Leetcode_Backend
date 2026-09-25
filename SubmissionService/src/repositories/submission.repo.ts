import { Submission, type ISubmission, type SubmissionData, type SubmissionStatus } from "../models/submission.model";

export interface ISubmissionRepository{
    create(submissionData:Partial<ISubmission>):Promise<ISubmission>
    findById(id:string):Promise<ISubmission|null>
    findByProblemId(id:string):Promise<ISubmission[]>
    deleteById(id:string):Promise<ISubmission|null>
    updateById(id:string,status:SubmissionStatus,data:SubmissionData):Promise<ISubmission|null>
}

export class SubmissionRepository implements ISubmissionRepository{

    async create(submissiondata:Partial<ISubmission>):Promise<ISubmission>{
        return await Submission.create(submissiondata)
    }

    async findById(id:string):Promise<ISubmission|null>{
        return await Submission.findById(id)
    }

    async findByProblemId(id:string):Promise<ISubmission[]>{
        return await Submission.find({ problemId: id })
    }

    async deleteById(id:string):Promise<ISubmission|null>{
        return await Submission.findByIdAndDelete(id)
    }

    async updateById(id:string,status:SubmissionStatus,data:SubmissionData):Promise<ISubmission|null>{
        return await Submission.findByIdAndUpdate(id, { status, submissionData: data }, { new: true })
    }
}