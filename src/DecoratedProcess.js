const Process = require('./Process');

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