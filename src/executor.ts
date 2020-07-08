import { TestRunRequest } from './model/testrunrequest';
import { PreFlightService } from './service/preflight.service';
const keytar = require('keytar');

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export class Executor {
    private options:any

    constructor(options: any) {
        this.options = options
    }

    public async login(){
        try {
            var request = new TestRunRequest()
            request.clientId = this.options.clientId;
            request.clientSecret = this.options.clientSecret;

            var service = new PreFlightService(request);
            var response = await service.getToken();
            keytar.setPassword("PreFlight", "AccessToken", response.access_token)   
        }
        catch (err) {
            throw err;
        }
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

            var accessToken = '';
            if(request.clientId && request.clientSecret){
                accessToken = (await service.getToken()).access_token;
            }
            else{
                accessToken = await keytar.getPassword("PreFlight", "AccessToken") ?? "";
            }
            if(!accessToken){
                throw new Error("Please provide client id and client secret or call login function.");
            }
            var response = await service.runTest(accessToken);

            if (response.testRunId == '') {
                var error = new Error('Error occured while queuing test group')
                throw error;
            }

            if(request.waitResults){
                while(true){
                    var testResults = await service.checkStatus(response.testRunId, accessToken);
                    console.log(testResults);
                    
                    if(testResults.results == null || testResults.results.length == 0)
                        break;
                    
                    if(testResults.results.filter(c => c.status == "Failed").length > 0){
                        var error = new Error('Test(s) failed.')
                        throw error;
                    }
                    else if(testResults.results.filter(c => c.status == "Queued" || c.status == "Running").length > 0){
                        console.log("Waiting for the tests to be completed.");
                    }
                    else{
                        console.log("Tests successfully completed.")
                        break;
                    }
                    await delay(5000)
                }
            }
            else{
                console.log("Tests successfully queued.")
            }    
        }
        catch (err) {
            throw err;
        }
    }
}