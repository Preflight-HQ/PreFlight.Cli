export declare class TestRun {
    id: string;
    results: TestRunResult[];
}
export declare class TestRunResult {
    status: string;
    videoUrl: string;
    platform: string;
    browser: string;
    width: number;
    height: number;
    errorDetails: any;
}
