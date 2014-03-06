EDITOR.Paper = function(width, height) {
    this.width = width || this.width;
    this.height = width || this.height;
    this.element = document.createElement('div');
    this.element.addClassName('paper');
    this.element.style.width = this.width + 'px';
    this.element.style.height = this.height + 'px';
    this.items = [];
    this.templateItems = [];
    this.controls = new EDITOR.paper.Controls(this);
    // this.initObjectControl();

    var refresh = EDITOR.bind(this, this.refresh);
    this.element.addEventListener('move', refresh);
    this.element.addEventListener('resize', refresh); // TO-DO

};
EDITOR.Paper.prototype = {
    items: null,
    templateItems: null,
    count: 0,
    width: 500,
    height: 600,

    initObjectControl: function() {
        this.element.addEventListener('mouseover', EDITOR.bind(this, function(e){
            var objectEvent = document.createEvent('Events');
            objectEvent.initEvent('objectfocus', true, false);
            objectEvent.focusedObject = this;
            this.element.dispatchEvent(objectEvent);
            EDITOR.cancelBubble(e);
        }));
    },
    refresh: function() {
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].refresh(this.items);
        }
    },
    setWidth: function(width) {
        if (typeof width == 'number') {
            this.width = width;
        } else if (typeof width == 'string') {
            var value = parseInt(width);
            if(value)
                this.width = value
        }
        this.element.style.width = this.width + 'px';
    },
    setHeight: function(height) {
        if (typeof height == 'number') {
            this.height = height;
        } else if (typeof height == 'string') {
            var value = parseInt(height);
            if(value)
                this.height = value
        }
        this.element.style.height = this.height + 'px';
    },
    add: function(item) {
        this.items.push(item);
        this.element.appendChild(item.element);
    },
    addToTemplate: function(item) {
        this.items.push(item);
        this.templateItems.push(item);
        this.element.appendChild(item.element);
    },
    remove: function(item) {
        if (item.delete) item.delete();
        for (var i = 0; i < this.items.length; i++) {
            if (item == this.items[i]) {
                this.items.splice(i,1);
                break;
            }
        }
        this.element.removeChild(item.element);
    },
    removeTemplate: function() {
        var items = this.templateItems;
        for(var i = 0; i < items.length; i++) {
            var item = items[i];
            this.remove(item);
        }
        this.templateItems = [];
    },
    getLeft: function() {
        return this.element.offsetLeft;
    },
    getTop: function() {
        return this.element.offsetTop;  
    },

    temporaryTemplate: function() {
        var block;
        block = new EDITOR.object.Block();
        block.setColumn(1);
        block.setPermanent(true);
        block.setContent('14');
        block.setLeft(14);
        block.setTop(14);
        block.setWidth(25);
        block.setHeight(15);
        block.element.style.color='#555';
        this.addToTemplate(block);
        block = new EDITOR.object.Block();
        block.setColumn(1);
        block.setPermanent(true);
        block.setContent('Demo layout');
        block.setLeft(45);
        block.setTop(14);
        block.setWidth(100);
        block.setHeight(15);
        block.element.style.color='#555';
        this.addToTemplate(block);
        block = new EDITOR.object.Block();
        block.setColumn(1);
        block.setPermanent(true);
        block.setContent('18 June, 2012');
        block.setLeft(291);
        block.setTop(14);
        block.setWidth(195);
        block.setHeight(15);
        block.element.style.color='#555';
        block.element.style.textAlign='right';
        this.addToTemplate(block);
    }
};