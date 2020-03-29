const ProcessStatus = require('./ProcessStatus')

class Process {
    constructor(invoker) {
        if (invoker instanceof Function) {
            this._promise = new Promise(invoker);
        } else if (invoker instanceof Promise) {
            this._promise = invoker;
        } else {
            throw new TypeError('Invalid invoker passed for Process constructor');
        }

        this._status = ProcessStatus.INPROGRESS;
        this._promise.then(function () {
            this._status = ProcessStatus.SUCCESS;
        }.bind(this), function () {
            this._status = ProcessStatus.FAILED;
        }.bind(this));

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

module.exports = Process;