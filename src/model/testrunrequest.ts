export class TestRunRequest {
    clientId: string = '';
    clientSecret: string = '';
    testId: string = '';
    groupId: string = '';
    environmentId: string = '';
    platforms: string = '';
    sizes: string = '';
    captureScreenshots: boolean = false;
    waitResults: boolean = true;
}