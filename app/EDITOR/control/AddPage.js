EDITOR.control = EDITOR.control || {};
EDITOR.control.AddPage = function(holder){
    this.initControl();
    this.initMouseEvent();
    this.initClickEvent();
    this.element.innerText = 'New Page';
    if (typeof holder == 'object' && holder instanceof Element) {
        holder.appendChild(this.element);
        this.owner = holder;
    }
}
EDITOR.control.AddPage.prototype = EDITOR.extends(new EDITOR.Control(), {
    controlName: 'addpage',
    execute: function(e, workspace) {
        var element = workspace.element,
            header = workspace.headerControls,
            // tabs = workspace.tabs,
            tab = new EDITOR.Tab('tab-' + workspace.tabCount++);
        workspace.element.appendChild(tab.element);
        header.element.appendChild(tab.tab);
        tab.setLabelText('Untitled ' + workspace.tabCount);
        var closeFn = function() {
            element.removeChild(tab.element);
            header.element.removeChild(tab.tab);
        }
        tab.initCloseEvent(closeFn);
        tab.selectEvent.fire();
    }
});