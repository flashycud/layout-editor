EDITOR.control = EDITOR.control || {};
EDITOR.control.Pointer = function(holder){
    this.initControl();
    this.initActivateEvent();
    this.element.title = 'Pointer';
    if (typeof holder == 'object' && holder instanceof Element) {
        holder.appendChild(this.element);
        this.owner = holder;
    }
};
EDITOR.control.Pointer.prototype = EDITOR.extends(new EDITOR.Control(), {
    controlName: 'pointer',
    activeObject: null,
    execute: function(e, target, object) {
        this.reset();
        if (target instanceof EDITOR.Tab 
            && object instanceof EDITOR.Object) {
            this.activeObject = object;
            if (this.activeObject.getMoveControl()) {
                e.button = 0;
                this.activeObject.getMoveControl().activate();
                this.activeObject.getMoveControl().mouseDown(e);
            }
            if (this.activeObject.getResizeControl())
                this.activeObject.getResizeControl().activate();
        }
    },
    reset: function() {
        if (this.activeObject) {
            if (this.activeObject.getMoveControl())
                this.activeObject.getMoveControl().deactivate();
            if (this.activeObject.getResizeControl())
                this.activeObject.getResizeControl().deactivate();
            this.activeObject == null;
        }
    }
});