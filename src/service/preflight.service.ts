import axios from 'axios';
import querystring from 'querystring';
import { TokenResponse } from '../model/tokenresponse';
import { TestRunRequest } from '../model/testrunrequest';
import { TestRun } from '../model/testrunresponse';

export class PreFlightService {

    private tokenUrl: string = 'https://auth.preflight.com/connect/token';
    private apiUrl: string = 'https://api.preflight.com/v1/Tests';

    private request: TestRunRequest

    constructor(request: TestRunRequest) {
        this.request = request
    }

    public async getToken(): Promise<TokenResponse> {
        try{
            var response = await axios.post<TokenResponse>(this.tokenUrl,
                querystring.stringify({
                    client_id: this.request.clientId,
                    client_secret: this.request.clientSecret,
                    grant_type: 'client_credentials',
                    scope: 'tests_run'
                }), {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).catch((error) => { console.log(error); throw error; });
            return response.data;
        }
        catch(err){
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
            throw new Error();
        }
    }

    public async runTest(accessToken:any): Promise<any> {
        try{
            var config = {
                headers: {
                    "Authorization": "bearer " + accessToken.replace(/\r?\n|\r/g, ''),
                    "Content-Type": "application/json"
                }
            };

            var platforms:any = [];
            if (this.request.platforms) {
                var platformBrowserList = this.request.platforms.split(',');
                platformBrowserList.forEach(platformBrowser => {
                    platforms.push(this.getPlatformAndBrowser(platformBrowser));
                });
            }

            var sizes:any = [];
            if (this.request.sizes) {
                var sizeList = this.request.sizes.split(",");
                sizeList.forEach(size => {
                    sizes.push(this.getSize(size));
                });
            }

            var body:any = {
                "captureScreenshots": this.request.captureScreenshots,
                "environmentId": this.request.environmentId,
                "platforms": platforms,
                "sizes": sizes
            }

            var requestPath = "/Run";
            if(this.request.testId){
                requestPath = "/"+ this.request.testId +"/Run";
            }
            else if(this.request.groupId){
                body.groupId = this.request.groupId;
            }
            
            var response = await axios.post(this.apiUrl + requestPath, body, config).catch((error) => { console.log(error); throw error; });
            return response.data;
        }
        catch(err){
            if(err.response.status == 401){
                console.log("Token expired or invalid client.");
            }
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
            throw new Error();
        }
    }

    private getPlatformAndBrowser(platformAndBrowser:string): any{
        var jsonItem:any = {};
        var platform = platformAndBrowser.toLowerCase().split('-')[0];
        switch (platform.trim()) {
            case "win":
                jsonItem.platform = "windows";
                break;
            default:
                throw new Error("Invalid platform.");
        }
        var browser = platformAndBrowser.toLowerCase().split('-')[1];
        switch (browser.trim()) {
            case "ie":
                jsonItem.browser= "internetexplorer";
                break;
            case "edge":
                jsonItem.browser= "edge";
                break;
            case "firefox":
                jsonItem.browser= "firefox";
                break;
            case "chrome":
                jsonItem.browser= "chrome";
                break;
            default:
                throw new Error("Invalid browser.");
        }

        return jsonItem;
    }

    private getSize(size:string): any{
        var jsonItem:any={};
        
        var width = size.toLocaleLowerCase().split("x")[0];
        jsonItem.width = width;
        var height = size.toLocaleLowerCase().split("x")[1];
        jsonItem.height = height; 
        
        return jsonItem;
    }

    public async checkStatus(testRunId:string, accessToken:string): Promise<TestRun> {
        try{
            var config = {
                headers: {
                    'Authorization': "bearer " + accessToken.replace(/\r?\n|\r/g, ''),
                    "Content-Type": "application/json"
                }
            };
    
            var response = await axios.get<TestRun>(this.apiUrl + "/Run/" + testRunId, config).catch((error) => { console.log(error); throw error; });
            return response.data;
        }
        catch (err){
            if(err.response.status == 401){
                console.log("Token expired or invalid client.");
            }
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
            throw new Error();
        }
    }
}

