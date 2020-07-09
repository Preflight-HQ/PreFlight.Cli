import { TestRunRequest } from './model/testrunrequest';
import { PreFlightService } from './service/preflight.service';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export class Executor {
    private options:any

    constructor(options: any) {
        this.options = options
    }

    public async run(){
        try {
            var request = new TestRunRequest()
            request.clientId = this.options.clientId;
            request.clientSecret = this.options.clientSecret;
            request.testId = this.options.testId;
            request.groupId = this.options.groupId;
            request.environmentId = this.options.environmentId;
            request.sizes = this.options.sizes;
            request.platforms = this.options.browsers;
            request.captureScreenshots = this.options.noScreenshot ? false : true;
            request.waitResults = this.options.noWaitResult ? false : true;

            var service = new PreFlightService(request);

            if(!request.clientId && !request.clientSecret){
                console.log("Please provide client id and client secret");
                return process.exit(1);
            }

            var accessToken = (await service.getToken()).access_token;
            var response = await service.runTest(accessToken);

            if (response.testRunId == '') {
                console.log('Error occured while queuing test group');
                return process.exit(1);
            }

            if(request.waitResults){
                while(true){
                    var testResults = await service.checkStatus(response.testRunId, accessToken);
                    console.log(JSON.stringify(testResults));
                    
                    if(testResults.results == null || testResults.results.length == 0)
                        break;
                    
                    if(testResults.results.filter(c => c.status == "Failed").length > 0){
                        console.log('Test(s) failed.');
                        return process.exit(1);
                    }
                    else if(testResults.results.filter(c => c.status == "Queued" || c.status == "Running").length > 0){
                        console.log("Waiting for the tests to be completed.");
                    }
                    else{
                        console.log("Tests successfully completed.");
                        break;
                    }
                    await delay(5000);
                }
            }
            else{
                console.log("Tests successfully queued.")
            }    
        }
        catch (err) {
            console.log(err);
            return process.exit(1);
        }
    }
}