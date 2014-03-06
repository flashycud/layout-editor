EDITOR.object = EDITOR.object || {}; // Object bundle

// Functions
EDITOR.object.sortTopDesc = function(a, b) {
    return a.getTop() < b.getTop();
};
EDITOR.object.sortTopAsc = function(a, b) {
    return a.getTop() > b.getTop();
};
// Superclass
EDITOR.Object = function() {};
EDITOR.Object.prototype = {
    element: null,
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    focusFlag: false,

    moveControl: null,
    resizeControl: null,

    controls: null,
    permanentFlag: false,

    addElement: function(elem) {
        this.element.appendChild(elem);
    },
    initObjectControl: function() {
        this.element.addEventListener('mouseover', EDITOR.bind(this, function(e){
            var objectEvent = document.createEvent('Events');
            objectEvent.initEvent('objectfocus', true, false);
            objectEvent.focusedObject = this;
            this.element.dispatchEvent(objectEvent);
            EDITOR.cancelBubble(e);
        }));
        this.element.addEventListener('mousedown', EDITOR.bind(this, function(e){
            var objectEvent = document.createEvent('Events');
            objectEvent.initEvent('objectselect', true, false);
            objectEvent.selectedObject = this;
            this.element.dispatchEvent(objectEvent);
            EDITOR.cancelBubble(e);
        }));
    },
    initMoveControl: function() {
        this.moveControl = new EDITOR.event.Move(this.element);
    },
    initResizeControl: function() {
        this.resizeControl = new EDITOR.event.Resize(this.element);
    },

    getLeft: function() {
        return this.left;
    },
    getRight: function() {
        return this.left + this.getWidth();
    },
    getTop: function() {
        return this.top;
    },
    getBottom: function() {
        return this.top + this.getHeight();
    },
    getWidth: function() {
        return this.width;
    },
    getHeight: function() {
        return this.height;
    },
    getMoveControl: function() {
        if (!this.permanentFlag) {
            return this.moveControl;
        }
        return null;
    },
    getResizeControl: function() {
        if (!this.permanentFlag) {
            return this.resizeControl;
        }
        return null;
    },
    setPermanent: function(flag) {
        if (flag) {
            this.moveControl.deactivate();   
            this.resizeControl.deactivate();   
        }
        this.permanentFlag = flag;
    },
    refresh: function() {},
    delete: function() {
        if (this.controls && this.controls.clear) {
            this.controls.clear();
        }
    }
}