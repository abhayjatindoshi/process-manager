const ProcessStatus = require('./ProcessStatus');
const Process = require('./Process');

class ProcessQueue {
    constructor() {

        this._status = ProcessStatus.INPROGRESS;
        this._promise = new Promise(function (resolve, reject) {
            this._resolve = resolve;
            this._reject = reject;
        }.bind(this));

        this._processList = [];
        this._resolvedCount = 0;
        this._successCount = 0;
        this._failureCount = 0;

        this._successCallback = function() {
            this._resolvedCount++;
            this._successCount++;
            if (this._resolvedCount == this._processList.length) {
                if (this._failureCount == 0) {
                    this._status = ProcessStatus.SUCCESS;
                    this._resolve();
                } else {
                    this._status = ProcessStatus.FAILED;
                    this._reject();
                }
            }
        }.bind(this);

        this._failureCallback = function() {
            this._resolvedCount++;
            this._failureCount++;
            if (this._resolvedCount == this._processList.length) {
                this._status = ProcessStatus.FAILED;
                this._reject();
            }
        }.bind(this);
    }

    push(process) {
        if (process instanceof Process || process instanceof ProcessQueue) {
            process.then(this._successCallback, this._failureCallback);
        } else {
            throw new TypeError('Invalid process type pushed to the queue');
        }
        this._processList.push(process);
    }

    then(resolve, reject) {
        return this._promise.then(resolve, reject);
    }

    catch(reject) {
        return this._promise.catch(reject);
    }

    getStatus() {
        return this._status;
    }
}

module.exports = ProcessQueue;