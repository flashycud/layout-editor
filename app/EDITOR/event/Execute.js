EDITOR.event = EDITOR.event || {};
EDITOR.event.Execute = function(obj) {
    this.element = obj.element;
    this.object = obj;
    this.element.addEventListener('mousedown', EDITOR.bind(this, function(e) {
        if (e.button == 0)
            this.fire(e);
    }), true);
}
EDITOR.event.Execute.prototype = {
    fire: function(e) {
        var selectEvent = document.createEvent('Events');
        selectEvent.initEvent('execute', true, false);
        selectEvent.targetObject = this.object;
        selectEvent.pageX = e.pageX;
        selectEvent.pageY = e.pageY;
        this.element.dispatchEvent(selectEvent);
    }  
};