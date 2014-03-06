EDITOR.control = EDITOR.control || {};
EDITOR.control.DrawBlock = function(holder){
    this.initControl();
    this.initActivateEvent();
    this.element.title = 'New Block';
    if (typeof holder == 'object' && holder instanceof Element) {
        holder.appendChild(this.element);
        this.owner = holder;
    }
};
EDITOR.control.DrawBlock.prototype = EDITOR.extends(new EDITOR.Control(), {
    controlName: 'drawblock',
    activeObject: null,
    execute: function(e, target) {
        var block = new EDITOR.object.Block(),
            paper = target.paper;
        block.setLeft(e.pageX - target.element.offsetLeft - paper.element.offsetLeft);
        block.setTop(e.pageY - target.element.offsetTop - paper.element.offsetTop);
        paper.add(block);
        block.resizeControl.enable = true;
        block.resizeControl.activeScaler = block.resizeControl.bottomRight;

        block.resizeControl.dragged = true;
        block.resizeControl.lastX = e.pageX;
        block.resizeControl.lastY = e.pageY;
        block.resizeControl.lastWidth = block.element.offsetWidth;
        block.resizeControl.lastHeight = block.element.offsetHeight;
        block.resizeControl.lastTop = block.element.offsetTop;
        block.resizeControl.lastLeft = block.element.offsetLeft;
        var clear = function(e) {
            block.resizeControl.deactivate();
            document.removeEventListener('mouseup', clear);
        };
        document.addEventListener('mouseup', clear);
    }
});