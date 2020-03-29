let ProcessStatus = Object.freeze({
    'INPROGRESS': 'INPROGRESS',
    'SUCCESS': 'SUCCESS',
    'FAILED': 'FAILED'
});



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



class DecoratedProcess extends Process {
    constructor(invoker, title){
        super(invoker);

        this._div = document.createElement('div');
        
        let statusIcon = document.createElement('span');
        statusIcon.setAttribute('uk-spinner', 'ratio: .7');
        this._div.appendChild(statusIcon);

        this._processTitle = document.createElement('span');
        if (title) {
            this._processTitle.innerText = ' ' + title;
        }
        this._div.appendChild(this._processTitle);

        this._promise.then(function(){
            statusIcon.removeAttribute('uk-spinner');
            statusIcon.classList.remove('uk-spinner');
            statusIcon.setAttribute('uk-icon', 'icon: check');
            this._div.classList.add('uk-text-success');
        }.bind(this));

        this._promise.catch(function(){
            statusIcon.removeAttribute('uk-spinner');
            statusIcon.classList.remove('uk-spinner');
            statusIcon.setAttribute('uk-icon', 'icon: close');
            this._div.classList.add('uk-text-danger');
        }.bind(this));
    }

    updateTitle(title){
        this._processTitle.innerText = ' ' + title;
    }

    appendToElement(element){
        element.appendChild(this._div);
    }
    
}


class DecoratedProcessQueue extends ProcessQueue {
    constructor(title){
        super();
        this._div = document.createElement('div');

        let subDiv = document.createElement('div');
        this._div.appendChild(subDiv);

        let statusIcon = document.createElement('span');
        statusIcon.setAttribute('uk-spinner', 'ratio: .7');
        subDiv.appendChild(statusIcon);

        this._processTitle = document.createElement('span');
        if (title) {
            this._processTitle.innerText = ' ' + title;
        }
        subDiv.appendChild(this._processTitle);

        this._processElements = document.createElement('div');
        this._processElements.classList.add('uk-margin-medium-left');
        this._div.appendChild(this._processElements);

        this._promise.then(function(){
            statusIcon.removeAttribute('uk-spinner');
            statusIcon.classList.remove('uk-spinner');
            statusIcon.setAttribute('uk-icon', 'icon: check');
            this._div.classList.add('uk-text-success');
        }.bind(this));

        this._promise.catch(function(){
            statusIcon.removeAttribute('uk-spinner');
            statusIcon.classList.remove('uk-spinner');
            statusIcon.setAttribute('uk-icon', 'icon: close');
            this._div.classList.add('uk-text-danger');
        }.bind(this));
    }

    updateTitle(title){
        this._processTitle = ' ' + title;
    }

    appendToElement(element){
        element.appendChild(this._div);
    }

    push(process){
        super.push(process);
        process.appendToElement(this._processElements);
    }
}

