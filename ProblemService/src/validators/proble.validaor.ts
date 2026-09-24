import z from "zod";

export const ProblemSchema=z.object({
    title:z.string().min(1,"title is required").max(100,"title should not exceed 100 characters"),
    description:z.string().min(1,"description is required"),
    difficulty:z.enum(["easy","medium","hard"]),
    editorial:z.string().optional(),
    testcases:z.array(z.object({
        input:z.string().min(1,"input is required"),
        output:z.string().min(1,"output is required")
    })).min(1,"at least one testcase is required")
})    

export const Updateschema=z.object({
    title:z.string().min(1,"title is required").max(100,"title should not exceed 100 characters").optional(),
    description:z.string().min(1,"description is required").optional(),
    difficulty:z.enum(["easy","medium","hard"]).optional(),
    editorial:z.string().optional(),
    testcases:z.array(z.object({
        input:z.string().min(1,"input is required"),
        output:z.string().min(1,"output is required")
    })).min(1,"at least one testcase is required").optional()
})

export const findByDifficultySchema = z.object({
    difficulty: z.enum(["easy", "medium", "hard"])
});

//ye tareeka h dto banane ka without specifically creating a folder

export type CreateProblemDto = z.infer<typeof ProblemSchema>;
export type UpdateProblemDto = z.infer<typeof Updateschema>;