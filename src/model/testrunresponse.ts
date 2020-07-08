export class TestRun {
    id: string = '';
    results: TestRunResult[] = [];
}

export class TestRunResult {
    status: string = '';
    videoUrl: string = '';
    platform: string = '';
    browser: string = '';
    width: number = 0;
    height: number = 0;
    errorDetails: any;
}