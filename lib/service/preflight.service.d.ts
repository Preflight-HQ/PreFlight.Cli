import { TokenResponse } from '../model/tokenresponse';
import { TestRunRequest } from '../model/testrunrequest';
import { TestRun } from '../model/testrunresponse';
export declare class PreFlightService {
    private tokenUrl;
    private apiUrl;
    private request;
    constructor(request: TestRunRequest);
    getToken(): Promise<TokenResponse>;
    runTest(accessToken: any): Promise<any>;
    private getPlatformAndBrowser;
    private getSize;
    checkStatus(testRunId: string, accessToken: string): Promise<TestRun>;
}
