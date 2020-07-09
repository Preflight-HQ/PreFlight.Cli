export class TestRun {
    id: string = '';
    results: TestRunResult[] = [];
}

export class TestRunResult {
    status: string = '';
    platform: string = '';
    browser: string = '';
    width: number = 0;
    height: number = 0;
    videoUrl: string = '';
    errorDetails: any;
}