EDITOR.event = EDITOR.event || {};
EDITOR.event.Move = function(element, moveRange) {
    this.element = element;
    this.moveRange = moveRange || document;
    var mouseDown = EDITOR.bind(this, this.mouseDown);
    var mouseMove = EDITOR.bind(this, this.mouseMove);
    var mouseUp = EDITOR.bind(this, this.mouseUp);
    element.addEventListener('mousedown', mouseDown);
    this.moveRange.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
    // element.parentElement.addEventListener('mouseout', mouseUp);
};
EDITOR.event.Move.prototype = {
    element: null,
    moveRange: null,
    enable: false,
    // enable: false,
    dragged: false,
    lastX: 0,
    lastY: 0,
    lastTop: 0,
    lastLeft: 0,
    left: 0,
    top: 0,
    mouseDown: function(evt) {
        // console.log('mouse down!');console.log(evt);
        if (this.enable && evt.button == 0) {
            var top, left,
                x = evt.pageX,
                y = evt.pageY;
            top = this.element.offsetTop;
            left = this.element.offsetLeft;
            // console.log(x + ", " + y);
            this.dragged = true;
            this.lastX = x;
            this.lastY = y;
            this.top = this.lastTop = top;
            this.left = this.lastLeft = left;
            evt.stopPropagation();
        }
    },
    mouseMove: function(evt) {
        if (this.enable && this.dragged) {
            var x = this.lastX
                , y = this.lastY
                , top = this.lastTop
                , left = this.lastLeft
                , dx, dy;

            dx = evt.pageX - x;
            dy = evt.pageY - y;
            this.left = left + dx;
            this.top = top + dy;
            this.element.style.left = left + dx + 'px';
            this.element.style.top = top + dy + 'px';
        }
    },
    mouseUp: function(evt) {
        if (this.enable && this.dragged) {
            var moveEvent = document.createEvent('Events');
            moveEvent.initEvent('move',true,false);
            moveEvent.left = this.left;
            moveEvent.top = this.top;
            this.element.dispatchEvent(moveEvent); // Dispatch the resize event
            this.dragged = false;
        }
    },
    activate: function() {
        this.enable = true;
    },
    deactivate: function() {
        this.enable = false;
    }
};