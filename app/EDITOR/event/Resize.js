EDITOR.event = EDITOR.event || {};
EDITOR.event.Resize = function(element, resizeRange) {
    this.element = element;
    this.resizeRange = resizeRange || document;
    this.initScaler();
};
EDITOR.event.Resize.prototype = {
    element: null,
    resizeRange: null,
    enable: true,
    dragged:false,
    scalerWidth: 10,
    scalerHeight: 10,

    topLeft: null,
    topRight: null,
    bottomLeft: null,
    bottomRight: null,

    lastX: 0,
    lastY: 0,
    lastWidth: 0,
    lastHeight: 0,
    lastTop: 0,
    lastLeft: 0,
    activeScaler: null,

    initScaler: function() {
        var tl = document.createElement('div')
            , tr = document.createElement('div')
            , bl = document.createElement('div')
            , br = document.createElement('div');
        
        tl.style.backgroundColor = tr.style.backgroundColor = bl.style.backgroundColor = br.style.backgroundColor = '#000';
        tl.style.position = tr.style.position = bl.style.position = br.style.position = 'absolute';
        tl.style.zIndex = tr.style.zIndex = bl.style.zIndex = br.style.zIndex = '9997';
        tl.style.width = tr.style.width = bl.style.width = br.style.width = this.scalerWidth + 'px';
        tl.style.height = tr.style.height = bl.style.height = br.style.height = this.scalerHeight + 'px';
        tl.style.top = tl.style.left = '-1px';
        tr.style.top = tr.style.right = '-1px';
        bl.style.bottom = bl.style.left = '-1px';
        br.style.bottom = br.style.right = '-1px';
        tl.style.cursor = 'nw-resize';
        tr.style.cursor = 'ne-resize';
        bl.style.cursor = 'sw-resize';
        br.style.cursor = 'se-resize';

        var mouseDown = EDITOR.bind(this,this.mouseDown);
        var scalerMove = EDITOR.bind(this,this.scalerMove);
        var mouseUp = EDITOR.bind(this,this.mouseUp);
        tl.addEventListener('mousedown', mouseDown);
        tr.addEventListener('mousedown', mouseDown);
        bl.addEventListener('mousedown', mouseDown);
        br.addEventListener('mousedown', mouseDown);
        this.resizeRange.addEventListener('mousemove', scalerMove);
        document.addEventListener('mouseup', mouseUp);

        this.topLeft = tl;
        this.topRight = tr;
        this.bottomLeft = bl;
        this.bottomRight = br;

        if(this.enable){
            this.activate();
        }
    },
    mouseDown: function(evt) {
        // console.log(evt.srcElement === this.bottomRight);
        if (this.enable) {
            var x = evt.pageX,
                y = evt.pageY;

            this.dragged = true;
            this.lastX = x;
            this.lastY = y;
            this.lastWidth = this.element.offsetWidth;
            this.lastHeight = this.element.offsetHeight;
            this.lastTop = this.element.offsetTop;
            this.lastLeft = this.element.offsetLeft;
            this.activeScaler = evt.srcElement;
            evt.stopPropagation();
        }
    },
    mouseUp: function(evt) {
        if (this.enable && this.dragged) {
            var resizeEvent = document.createEvent('Events');
            resizeEvent.initEvent('resize',true,false);
            this.element.dispatchEvent(resizeEvent); // Dispatch the resize event
            this.dragged = false;
        }
    },
    scalerMove: function(evt) {
        if (this.enable && this.dragged) {
            var x = this.lastX
                , y = this.lastY
                , dx = evt.pageX - x
                , dy = evt.pageY - y;
            switch (this.activeScaler) {
                case this.topLeft:
                    // if (this.lastWidth - dx > this.scalerWidth * 2) {
                    if (this.lastWidth - dx > this.scalerWidth * 2) {
                        this.element.style.width = this.lastWidth - dx + 'px';
                        this.element.style.left = this.lastLeft + dx + 'px';
                    }
                    // if (this.lastHeight - dy > this.scalerHeight * 2) {
                    if (this.lastHeight - dy > this.scalerHeight * 2) {
                        this.element.style.height = this.lastHeight - dy + 'px';
                        this.element.style.top = this.lastTop + dy + 'px';
                    }
                    break;
                case this.topRight:
                    if (this.lastWidth + dx > this.scalerWidth * 2) {
                        this.element.style.width = this.lastWidth + dx + 'px';
                        this.element.style.left = this.lastLeft + 'px';
                    }
                    if (this.lastHeight - dy > this.scalerHeight * 2) {
                        this.element.style.height = this.lastHeight - dy + 'px';
                        this.element.style.top = this.lastTop + dy + 'px';
                    }
                    break;
                case this.bottomLeft:
                    if (this.lastWidth - dx > this.scalerWidth * 2) {
                        this.element.style.width = this.lastWidth - dx + 'px';
                        this.element.style.left = this.lastLeft + dx + 'px';
                    }
                    if (this.lastHeight + dy > this.scalerHeight * 2) {
                        this.element.style.height = this.lastHeight + dy + 'px';
                        this.element.style.top = this.lastTop +'px';
                    }
                    break;
                case this.bottomRight:
                    if (this.lastWidth + dx > this.scalerWidth * 2) {
                        this.element.style.width = this.lastWidth + dx + 'px';
                        this.element.style.left = this.lastLeft + 'px';
                    }
                    if (this.lastHeight + dy > this.scalerHeight * 2) {
                        this.element.style.height = this.lastHeight + dy + 'px';
                        this.element.style.top = this.lastTop +'px';
                    }
                    break;
            }
        }
    },

    activate: function(){
        this.element.appendChild(this.topLeft);
        this.element.appendChild(this.topRight);
        this.element.appendChild(this.bottomLeft);
        this.element.appendChild(this.bottomRight);
        this.enable = true;
    },
    deactivate: function(){
        if (this.enable) {
            this.element.removeChild(this.topLeft);
            this.element.removeChild(this.topRight);
            this.element.removeChild(this.bottomLeft);
            this.element.removeChild(this.bottomRight);
            this.enable = false;
        }
    }
};