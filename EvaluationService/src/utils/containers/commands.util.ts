const bashConfig = ['/bin/bash', '-c'];

export const commands = {
    python: function (code: string, input: string = "") {
        // Base64 encode code and input to safely preserve quotes, newlines, and special characters
        const b64Code = Buffer.from(code).toString('base64');
        const b64Input = Buffer.from(input || '').toString('base64');
        const runCommand = `echo '${b64Code}' | base64 -d > code.py && echo '${b64Input}' | base64 -d > input.txt && python3 code.py < input.txt`;
        return [...bashConfig, runCommand];
    },
    cpp: function (code: string, input: string = "") {
        // Base64 encode code and input to safely preserve quotes, newlines, and special characters
        const b64Code = Buffer.from(code).toString('base64');
        const b64Input = Buffer.from(input || '').toString('base64');
        const runCommand = `mkdir -p app && cd app && echo '${b64Code}' | base64 -d > code.cpp && echo '${b64Input}' | base64 -d > input.txt && g++ code.cpp -o run && ./run < input.txt`;
        return [...bashConfig, runCommand];
    }
};
