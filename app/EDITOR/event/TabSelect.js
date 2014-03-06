EDITOR.event = EDITOR.event || {};
EDITOR.event.TabSelect = function(tabObj, triggerElem) {
    this.element = triggerElem || tabObj.label;
    this.object = tabObj;
    this.element.addEventListener('click', EDITOR.bind(this,this.fire));
}
EDITOR.event.TabSelect.prototype = {
    fire: function(e) {
        var selectEvent = document.createEvent('Events');
        selectEvent.initEvent('tabselect', true, false);
        selectEvent.tab = this.object;
        this.element.dispatchEvent(selectEvent);
    }  
};