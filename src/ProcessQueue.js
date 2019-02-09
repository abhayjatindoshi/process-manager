class ProcessQueue {
    constructor(title){
        this._ = {};
        
        this._.component = (function(){
            var div = document.createElement('div');

            var subDiv = document.createElement('div');
            div.appendChild(subDiv);

            var statusIcon = document.createElement('span');
            statusIcon.setAttribute('uk-spinner','ratio: .7');
			subDiv.appendChild(statusIcon);

            var processTitle = document.createElement('span');
            if(title){
                processTitle.innerText = ' '+title;
            }
            subDiv.appendChild(processTitle);
            
            var processElements = document.createElement('div');
            processElements.classList.add('uk-margin-medium-left');
            div.appendChild(processElements);

            return {
                success: function(){
                    statusIcon.removeAttribute('uk-spinner');
                    statusIcon.classList.remove('uk-spinner');
                    statusIcon.setAttribute('uk-icon','icon: check');
                    subDiv.classList.add('uk-text-success');
                },
                failure: function(){
                    statusIcon.removeAttribute('uk-spinner');
                    statusIcon.classList.remove('uk-spinner');
                    statusIcon.setAttribute('uk-icon','icon: close');
                    subDiv.classList.add('uk-text-danger');
                },
                updateTitle: function(){
                    processTitle.innerText = ' '+title
                },
                getProcessElement: function(){
                    return processElements;
                },
                getElement: function(){
                    return div;
                }
            };

        })();

        var parentData = this._;
        this._.status = ProcessStatus.INPROGRESS;
        this._.promise = (function(){
            var resolve;
            var reject;
            var promise = new Promise(function(res,rej){
                resolve = res;
                reject = rej;
            });

            return {
                get: function(){
                    return promise;
                },
                resolve: function(){
                    resolve.apply(undefined,arguments);
                },
                reject: function(){
                    reject.apply(undefined,arguments);
                }
            };
        })();

        this._.processList = (function(){
            var processList = [];
            var resolvedCount = 0;
            var successCount = 0;
            var failureCount = 0;
            var parent = parentData;

            var successCallback = function(){
                resolvedCount++;
                successCount++;
                if(resolvedCount == processList.length){
                    if(failureCount == 0){
                        parent.status = ProcessStatus.SUCCESS;
                        parent.component.success();
                        parent.promise.resolve();
                    } else {
                        parent.status = ProcessStatus.FAILED;
                        parent.component.failure();
                        parent.promise.reject();
                    }
                }
            }

            var failureCallback = function(){
                resolvedCount++;
                failureCount++;
                if(resolvedCount == processList.length){
                    parent.status = ProcessStatus.FAILED;
                    parent.component.failure();
                    parent.promise.reject();
                }
            }

            return {
                push : function(process){
                    if(process instanceof Process || process instanceof ProcessQueue){
                        process.then(successCallback, failureCallback);
                    } else {
                        throw new TypeError('Invalid process type pushed to the queue');
                    }
                    processList.push(process);
                    process.appendToElement(parent.component.getProcessElement());
                }
            }
        })();

    }

    appendToElement(element){
        element.appendChild(this._.component.getElement());
    }

    push(process){
        this._.processList.push(process);
    }

    updateTitle(title){
        this._.component.updateTitle(title);
    }

    then(resolve, reject){
        this._.promise.get().then(resolve, reject);
    }

    catch(reject){
        this._.promise.get().catch(reject);
    }
}