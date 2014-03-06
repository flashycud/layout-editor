EDITOR.control = EDITOR.control || {};
EDITOR.control.DrawImage = function(holder){
    this.initControl();
    this.initActivateEvent();
    this.element.title = 'New Image';
    if (typeof holder == 'object' && holder instanceof Element) {
        holder.appendChild(this.element);
        this.owner = holder;
    }
};
EDITOR.control.DrawImage.prototype = EDITOR.extends(new EDITOR.Control(), {
    controlName: 'drawimage',
    activeObject: null,
    execute: function(e, target) {
        var image = new EDITOR.object.Image('resources/img/beach.jpg', 100, 100),
            paper = target.paper;
        image.setLeft(e.pageX - target.element.offsetLeft - paper.element.offsetLeft);
        image.setTop(e.pageY - target.element.offsetTop - paper.element.offsetTop);
        image.resizeControl.deactivate();
        paper.add(image);
        paper.refresh();
    }
});