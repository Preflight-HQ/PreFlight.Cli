"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRunResult = exports.TestRun = void 0;
class TestRun {
    constructor() {
        this.id = '';
        this.results = [];
    }
}
exports.TestRun = TestRun;
class TestRunResult {
    constructor() {
        this.status = '';
        this.platform = '';
        this.browser = '';
        this.width = 0;
        this.height = 0;
        this.videoUrl = '';
    }
}
exports.TestRunResult = TestRunResult;
