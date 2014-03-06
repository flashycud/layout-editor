EDITOR.Tab = function(tabId) {
    this.id = tabId
    this.element = document.createElement('div');
    this.element.addClassName('paper-holder');
    this.element.addClassName(this.id);
    this.element.style.zIndex = -1;
    this.tab = document.createElement('div');
    this.tab.addClassName('tab-label');
    this.tab.addClassName("label-" + this.id);
    this.label = document.createElement('span');
    this.label.style.lineHeight = '35px';
    this.label.style.fontSize = '13px';
    this.label.style.color = '#555';
    this.label.style.textShadow = '0 1px 0 rgba(255, 255, 255, 0.8)';
    this.tab.appendChild(this.label);
    this.paper = new EDITOR.Paper();
    this.element.appendChild(this.paper.element);
    this.executeEvent = new EDITOR.event.Execute(this);
    this.selectEvent = new EDITOR.event.TabSelect(this, this.tab);
    this.initObjectControl();
    this.initCloseTab();
};
EDITOR.Tab.prototype = {
    id: null,
    element: null,
    label: null,
    paper: null,
    executeEvent: null,
    selectEvent: null,

    initObjectControl: function() {
        this.element.addEventListener('mouseover', EDITOR.bind(this, function(e){
            var objectEvent = document.createEvent('Events');
            objectEvent.initEvent('objectfocus', true, false);
            objectEvent.focusedObject = this;
            this.element.dispatchEvent(objectEvent);
            EDITOR.cancelBubble(e);
        }));
    },
    initCloseTab: function() {
        
        var closeBtn = this.closeBtn = document.createElement('div');
        // this.closeBtn.style.backgroundColor = '#000';
        this.closeBtn.innerText = 'x';
        this.closeBtn.style.width = '15px';
        this.closeBtn.style.height = '15px';
        this.closeBtn.style.position = 'absolute';
        this.closeBtn.style.top = '9px';
        this.closeBtn.style.right = '0';
        this.closeBtn.style.fontSize = '14px';
        this.closeBtn.style.textShadow = '0 1px 1px rgba(0, 0, 0, 0.5)';
        this.closeBtn.style.color = '#333';
        this.tab.appendChild(this.closeBtn);
        this.closeBtn.addEventListener('mouseover', function(){
            closeBtn.style.textShadow = 'rgba(255, 0, 0, 0.496094) 0px 1px 1px';
        });
        this.closeBtn.addEventListener('mouseout', function(){
            closeBtn.style.textShadow = '0 1px 1px rgba(0, 0, 0, 0.5)';
        });
    },
    initCloseEvent: function(closeFn) {
        this.closeBtn.addEventListener('click',function(e){
            closeFn();
            EDITOR.cancelBubble(e);
        });
    },
    hide: function() {
        this.tab.removeClassName('tab-active');
    this.element.style.zIndex = -1;
    },
    show: function() {
        this.tab.addClassName('tab-active');
    this.element.style.zIndex = 1;
    },
    setLabelText: function(text) {
        this.label.innerText = text;
    }
};