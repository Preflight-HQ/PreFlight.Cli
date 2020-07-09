"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Executor = void 0;
const testrunrequest_1 = require("./model/testrunrequest");
const preflight_service_1 = require("./service/preflight.service");
const delay = (ms) => new Promise(res => setTimeout(res, ms));
class Executor {
    constructor(options) {
        this.options = options;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var request = new testrunrequest_1.TestRunRequest();
                request.clientId = this.options.clientId;
                request.clientSecret = this.options.clientSecret;
                request.testId = this.options.testId;
                request.groupId = this.options.groupId;
                request.environmentId = this.options.environmentId;
                request.sizes = this.options.sizes;
                request.platforms = this.options.browsers;
                request.captureScreenshots = this.options.noScreenshot ? false : true;
                request.waitResults = this.options.noWaitResult ? false : true;
                var service = new preflight_service_1.PreFlightService(request);
                if (!request.clientId && !request.clientSecret) {
                    console.log("Please provide client id and client secret");
                    return process.exit(1);
                }
                var accessToken = (yield service.getToken()).access_token;
                var response = yield service.runTest(accessToken);
                if (response.testRunId == '') {
                    console.log('Error occured while queuing test group');
                    return process.exit(1);
                }
                if (request.waitResults) {
                    while (true) {
                        var testResults = yield service.checkStatus(response.testRunId, accessToken);
                        console.log(JSON.stringify(testResults));
                        if (testResults.results == null || testResults.results.length == 0)
                            break;
                        if (testResults.results.filter(c => c.status == "Failed").length > 0) {
                            console.log('Test(s) failed.');
                            return process.exit(1);
                        }
                        else if (testResults.results.filter(c => c.status == "Queued" || c.status == "Running").length > 0) {
                            console.log("Waiting for the tests to be completed.");
                        }
                        else {
                            console.log("Tests successfully completed.");
                            break;
                        }
                        yield delay(5000);
                    }
                }
                else {
                    console.log("Tests successfully queued.");
                }
            }
            catch (err) {
                console.log(err);
                return process.exit(1);
            }
        });
    }
}
exports.Executor = Executor;
