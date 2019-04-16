import ts from 'typescript';
import { AnyInfo } from './interfaces';
export declare function lint(project: string, detail: boolean, debug: boolean, files?: string[], oldProgram?: ts.Program, strict?: boolean, enableCache?: boolean, ignoreCatch?: boolean): Promise<{
    correctCount: number;
    totalCount: number;
    anys: AnyInfo[];
    program: ts.Program;
}>;
