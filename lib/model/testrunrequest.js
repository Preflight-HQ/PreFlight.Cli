"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRunRequest = void 0;
class TestRunRequest {
    constructor() {
        this.clientId = '';
        this.clientSecret = '';
        this.testId = '';
        this.groupId = '';
        this.environmentId = '';
        this.platforms = '';
        this.sizes = '';
        this.captureScreenshots = false;
        this.waitResults = true;
    }
}
exports.TestRunRequest = TestRunRequest;
