EDITOR.control = EDITOR.control || {};
EDITOR.Control = function() {};
EDITOR.Control.prototype = {
    element: null,
    owner: null,
    controlName: null,

    execute: null,

    initControl: function() {
        this.element = document.createElement('div');
        this.element.addClassName('tool-btn');
        if (this.controlName) {
            this.element.addClassName(this.controlName + '-tool-btn');
        }
    },
    initClickEvent: function() {
        this.element.addEventListener('click', EDITOR.bind(this, this.click));
    },
    initActivateEvent: function() {
        this.element.addEventListener('click', EDITOR.bind(this, this.activateClick));
    },
    initMouseEvent: function() {
        this.element.addEventListener('mouseover', EDITOR.bind(this, function(){
            this.element.addClassName('tool-btn-hover');
        }));
        this.element.addEventListener('mouseout', EDITOR.bind(this, function(){
            this.element.removeClassName('tool-btn-hover');
        }));
    },
    click: function(e) {
        var clickEvent = document.createEvent('Events');
        clickEvent.initEvent('controlclick',true,false);
        clickEvent.controlName = this.controlName;
        clickEvent.control = this;
        this.element.dispatchEvent(clickEvent);
    },
    activateClick: function(e) {
        var clickEvent = document.createEvent('Events');
        clickEvent.initEvent('controlactivate',true,false);
        clickEvent.controlName = this.controlName;
        clickEvent.control = this;
        clickEvent.sourceObject = null;
        this.element.dispatchEvent(clickEvent);
    },
    activate: function() {
        if (this.element && this.element instanceof Element) {
            this.element.addClassName('tool-btn-active');
        }
    },
    deactivate: function() {
        this.reset();
        if (this.element && this.element instanceof Element) {
            this.element.removeClassName('tool-btn-active');
        }
    },
    execute: function() {console.log('empty execute!')},
    reset: function() {console.log('empty reset!')}
};