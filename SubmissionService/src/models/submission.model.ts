import {  Schema,  Document, model } from "mongoose";

export enum SubmissionLanguage{
    CPP="cpp",
    PYTHON="python"
}
export enum SubmissionStatus{
    PENDING="pending",
    COMPLETED="completed"
}

export interface SubmissionData{
    "testCaseId":string
    "status":string
}
export interface ISubmission extends Document{
    problemId:string
    code:string
    language:SubmissionLanguage
    status:SubmissionStatus
    submissionData:SubmissionData
    createdAt:Date
    updatedAt:Date
}

export const submissionschema= new Schema<ISubmission>({
    problemId:{
        type:String,
        required:[true,"problemId is required"]
    },
    code:{
        type:String,
        required:[true,"code is required for evaluation"]
    },
    language:{
        type:String,
        required:[true,"language is required for evaluation"],
        enum:Object.values(SubmissionLanguage)
    },
    status:{
        type:String,
        required:true,
        default:SubmissionStatus.PENDING,
        enum:Object.values(SubmissionStatus)
    },
    submissionData:{
        type:Object,
        required:true,
        default:{}
    }
},{
        timestamps:true,
        toJSON: {
        transform: (_, record) => {
            delete (record as any).__v; // delete __v field
            (record as any).id = record._id; // add id field
            delete (record as any)._id; // delete _id field
            return record;
        }
    }
})
submissionschema.index({ status: 1, createdAt: -1 });

export const Submission = model<ISubmission>("Submission", submissionschema);
