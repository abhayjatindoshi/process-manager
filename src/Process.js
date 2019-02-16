class Process {
    constructor(invoker,title){
        this._ = {};
        if(invoker instanceof Function){
            this._.promise = new Promise(invoker);
        } else if (invoker instanceof Promise){
            this._.promise = invoker;
        } else {
            throw new TypeError('Invalid invoker passed for Process constructor');
        }

        this._.component = (function(){
            var div = document.createElement('div');
            
            var statusIcon = document.createElement('span');
            statusIcon.setAttribute('uk-spinner','ratio: .7');
			div.appendChild(statusIcon);
            
            var processTitle = document.createElement('span');
            if(title){
                processTitle.innerText = ' '+title;
            }
			div.appendChild(processTitle);

            return {
                success: function(){
                    statusIcon.removeAttribute('uk-spinner');
                    statusIcon.classList.remove('uk-spinner');
                    statusIcon.setAttribute('uk-icon','icon: check');
                    div.classList.add('uk-text-success');
                },
                failure: function(){
                    statusIcon.removeAttribute('uk-spinner');
                    statusIcon.classList.remove('uk-spinner');
                    statusIcon.setAttribute('uk-icon','icon: close');
                    div.classList.add('uk-text-danger');
                },
                updateTitle: function(title){
                    processTitle.innerText = ' '+title
                },
                getElement: function(){
                    return div;
                }
            };
        })();

        var parent = this._;
        this._.status = ProcessStatus.INPROGRESS;
        this._.promise.then(function(){
            parent.status = ProcessStatus.SUCCESS;
            parent.component.success();
        },function(){
            parent.status = ProcessStatus.FAILED;
            parent.component.failure();
        });

    }

    updateTitle(title){
        this._.component.updateTitle(title);
    }

    then(resolve, reject){
        this._.promise.then(resolve, reject);
    }

    catch(reject){
        this._.promise.catch(reject);
    }

    appendToElement(element){
        element.appendChild(this._.component.getElement());
    }

    getStatus(){
        return this._.status;
    }
}