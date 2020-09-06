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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreFlightService = void 0;
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
class PreFlightService {
    constructor(request) {
        this.tokenUrl = 'https://auth.preflight.com/connect/token';
        this.apiUrl = 'https://api.preflight.com/v1/Tests';
        this.request = request;
    }
    getToken() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var response = yield axios_1.default.post(this.tokenUrl, querystring_1.default.stringify({
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
            catch (err) {
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
                throw new Error();
            }
        });
    }
    runTest(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var config = {
                    headers: {
                        "Authorization": "bearer " + accessToken.replace(/\r?\n|\r/g, ''),
                        "Content-Type": "application/json"
                    }
                };
                var platforms = [];
                if (this.request.platforms) {
                    var platformBrowserList = this.request.platforms.split(',');
                    platformBrowserList.forEach(platformBrowser => {
                        platforms.push(this.getPlatformAndBrowser(platformBrowser));
                    });
                }
                var sizes = [];
                if (this.request.sizes) {
                    var sizeList = this.request.sizes.split(",");
                    sizeList.forEach(size => {
                        sizes.push(this.getSize(size));
                    });
                }
                var body = {
                    "captureScreenshots": this.request.captureScreenshots,
                    "environmentId": this.request.environmentId,
                    "platforms": platforms,
                    "sizes": sizes
                };
                var requestPath = "/Run";
                if (this.request.testId) {
                    requestPath = "/" + this.request.testId + "/Run";
                }
                else if (this.request.groupId) {
                    body.groupId = this.request.groupId;
                }
                var response = yield axios_1.default.post(this.apiUrl + requestPath, body, config).catch((error) => { console.log(error); throw error; });
                return response.data;
            }
            catch (err) {
                if (err.response.status == 401) {
                    console.log("Token expired or invalid client.");
                }
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
                throw new Error();
            }
        });
    }
    getPlatformAndBrowser(platformAndBrowser) {
        var jsonItem = {};
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
                jsonItem.browser = "internetexplorer";
                break;
            case "edge":
                jsonItem.browser = "edge";
                break;
            case "firefox":
                jsonItem.browser = "firefox";
                break;
            case "chrome":
                jsonItem.browser = "chrome";
                break;
            default:
                throw new Error("Invalid browser.");
        }
        return jsonItem;
    }
    getSize(size) {
        var jsonItem = {};
        var width = size.toLocaleLowerCase().split("x")[0];
        jsonItem.width = width;
        var height = size.toLocaleLowerCase().split("x")[1];
        jsonItem.height = height;
        return jsonItem;
    }
    checkStatus(testRunId, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var config = {
                    headers: {
                        'Authorization': "bearer " + accessToken.replace(/\r?\n|\r/g, ''),
                        "Content-Type": "application/json"
                    }
                };
                var response = yield axios_1.default.get(this.apiUrl + "/Run/" + testRunId, config).catch((error) => { console.log(error); throw error; });
                return response.data;
            }
            catch (err) {
                if (err.response.status == 401) {
                    console.log("Token expired or invalid client.");
                }
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
                throw new Error();
            }
        });
    }
}
exports.PreFlightService = PreFlightService;
