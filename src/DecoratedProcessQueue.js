const ProcessQueue = require('./ProcessQueue');

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