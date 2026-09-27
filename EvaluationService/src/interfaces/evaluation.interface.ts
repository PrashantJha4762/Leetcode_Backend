export interface TestCase {
    _id?: string;
    id?: string;
    input: string;
    output: string;
}

export interface Problem {
    id?: string;
    _id?: string;
    title: string;
    description: string;
    difficulty?: string;
    diffculty?: string;
    editorial?: string;
    testcases: TestCase[];
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

export interface EvaluationJob {
    submissionId: string;
    code: string;
    language: "python" | "cpp";
    problem: Problem;
}

export interface EvaluationResult {
    status: "success" | "failed" | "time_limit_exceeded";
    output: string | undefined;
}
