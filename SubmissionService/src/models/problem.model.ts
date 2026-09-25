import type { Document } from "mongoose";
import mongoose from "mongoose";

export interface ITestcase{
    input:string,
    output:string
}

export interface IProblem extends Document{
    title:string,
    description:string,
    difficulty:"easy"|"medium"|"hard",
    created_at:Date,
    updated_at:Date,
    editorial?:string,
    testcases:[ITestcase]
}

const testcaseSchema=new mongoose.Schema<ITestcase>({
    input:{
        type:String,
        required:[true,"input is required"],
        trim:true
    },
    output:{
        type:String,
        required:[true,"output is required"],
        trim:true
    }
});

const problemschema=new mongoose.Schema<IProblem>({
    title:{
        type:String,
        required:[true,"title is required"],
        maxlength:[100,"title should not exceed 100 characters"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"description is required"],
        trim:true
    },
    difficulty:{
        type:String,
        enum:{
            values:["easy","medium","hard"],
            message:"difficulty should be easy,medium or hard"
        },  
        trim:true,
        required:[true,"difficulty is required"]  
    },
    editorial:{
        type:String,
        trim:true
    },
    testcases:{
        type:[testcaseSchema],
        required:[true,"testcases are required"],
        // _id:false
    }
},{
    timestamps:true
})

export const Problem=mongoose.model<IProblem>("Problem",problemschema)