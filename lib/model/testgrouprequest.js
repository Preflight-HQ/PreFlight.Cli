"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestGroupRequest = void 0;
class TestGroupRequest {
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
exports.TestGroupRequest = TestGroupRequest;
