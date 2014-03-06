var EDITOR = EDITOR||{};

// Config
EDITOR.config = null;

// Class
EDITOR.Point = function() { };
EDITOR.Point.prototype = { x: 0, y: 0 };
EDITOR.Paper = function(width, height) {
    this.width = width || this.width;
    this.height = width || this.height;
    this.element = document.createElement('div');
    this.element.addClassName('paper');
    this.element.style.width = this.width + 'px';
    this.element.style.height = this.height + 'px';
    this.items = [];

    var refresh = bind(this, this.refresh);
    this.element.addEventListener('move', refresh);
    this.element.addEventListener('resize', refresh); // TO-DO
};
EDITOR.Paper.prototype = {
    items: null,
    count: 0,
    width: 500,
    height: 500,

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
    getLeft: function() {
        return this.element.offsetLeft;
    },
    getTop: function() {
        return this.element.offsetTop;  
    }
};

EDITOR.object = {}; // Object bundle

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

    moveControl: null,
    resizeControl: null,

    addElement: function(elem) {
        this.element.appendChild(elem);
    },
    initObjectControl: function() {
        this.element.addEventListener('mouseover', bind(this, function(){
            var objectEvent = document.createEvent('Events');
            objectEvent.initEvent('objectfocus', true, false);
            objectEvent.focusedObject = this;
            this.element.dispatchEvent(objectEvent); 
        }));
        this.element.addEventListener('mouseout', bind(this, function(){
            var objectEvent = document.createEvent('Events');
            objectEvent.initEvent('objectfocus', true, false);
            objectEvent.focusedObject = null;
            this.element.dispatchEvent(objectEvent); 
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
    refresh: function() {}
}
EDITOR.object.Block = function() {
    this.element = document.createElement('div');
    this.element.addClassName('block');
    this.initMoveControl();
    this.initResizeControl();
    this.initObjectControl();

    this.items = [];

    //TO-DO
    var holder = new EDITOR.object.Holder(text);
    this.add(holder);

};
EDITOR.object.Block.prototype = (new EDITOR.Object()).join({
    items: null,

    refresh: function(items) {
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].refresh(items);
        }
    },

    add: function(item) {
        this.items.push(item);
        this.element.appendChild(item.element);
    },
    setLeft: function(left) {
        this.element.style.left = left + 'px';
    },
    setTop: function(top) {
        this.element.style.top = top + 'px';
    }
    
});

// EDITOR.object.Holder = function(text, columnCount) {
//     this.text = text;
//     this.element = document.createElement('div');
//     this.element.addClassName('holder');
//     this.element.style.display = '-webkit-box';
//     this.element.style.position = 'relative';
// };
EDITOR.object.Holder = function(text, width, height) {
    this.element = document.createElement('div');
    this.element.addClassName('holder');
    this.element.style.position = 'relative';
    this.element.style.width = width || '100%';
    this.element.style.height = height || '100%';
    this.element.style.display = '-webkit-box';
    this.element.style.display = '-moz-box';
    this.element.style.display = 'box';

    this.items = [];

    this.text = text || '';
    this.refresh();

    // var refreshHolder = bind(this, this.refreshHolder);
    // this.element.addEventListener('move', refreshHolder);
    // document.addEventListener('resize', refreshHolder); // TO-DO
};
EDITOR.object.Holder.prototype = (new EDITOR.Object()).join({
    items: null,
    text: "",
    columnCount: 2,
    firstColumn: null,
    
    refresh: function(items){
        this.generateComponent(items);
        this.renderText();
    },
    generateComponent:function(items){
        items = items || this.items;
        var columnCount = this.columnCount,
            element = this.element,
            // items = this.items,
            prevColumn, currentColumn,
            width, c;
        this.clear();
        if (columnCount <= 0)
            columnCount = 1;
        width = 100/columnCount + '%';
        for (var i = 0; i < columnCount; i++) {
            currentColumn = new EDITOR.object.TextColumn(this, width);

            if (prevColumn) {
                prevColumn.after = currentColumn;
                currentColumn.before = prevColumn;
            } else {
                this.firstColumn = currentColumn;
            }

            prevColumn = currentColumn;
        }
        c = this.firstColumn;

        // TO-DO
        while (c) {
            var obstacles = []; // for each column
            for (var i = 0; i < items.length; i++) {
                if (items[i] instanceof EDITOR.object.Image) {
                    var t = items[i],
                        left = t.getLeft() - this.element.offsetLeft - this.element.parentElement.offsetLeft,
                        right = t.getRight() - this.element.offsetLeft - this.element.parentElement.offsetLeft;
                    if ((left < c.getRight() && left > c.getLeft())
                        || (right < c.getRight() && right > c.getLeft())) {
                        obstacles.push(items[i]);
                    } else if (left < c.getLeft() && right > c.getRight()) {
                        obstacles.push(items[i]);
                    }
                }
            } // Find obstacles
            obstacles.sort(EDITOR.object.sortTopAsc);
            if (obstacles.length > 0) {
                // console.log(obstacles);
                var startTop = 0, startLeft = 0, prevBlock = null, textBlock; 
                for (var i = 0; i < obstacles.length; i++) {
                    var leftGap = (obstacles[i].getLeft() - this.element.offsetLeft - this.element.parentElement.offsetLeft) - c.getLeft(),
                        rightGap = c.getRight() - (obstacles[i].getRight() - this.element.offsetLeft - this.element.parentElement.offsetLeft),
                        topGap = (obstacles[i].getTop() - this.element.offsetTop - this.element.parentElement.offsetTop) - startTop, 
                        lineAdjust = topGap % 13,
                        lineCompensate = 1, // Fix line height not filled
                        height = topGap - lineAdjust + lineCompensate, // TO-DO : line-height
                        maxWidth = c.getWidth() - c.columnRule,
                        width = maxWidth,
                        bottom, left, right;
                    textBlock = new EDITOR.object.TextBlock(c);
                    if (i-1 >= 0 && (obstacles[i-1].getBottom() - this.element.offsetTop - this.element.parentElement.offsetTop) > startTop) {
                        bottom = Math.min((obstacles[i-1].getBottom() - this.element.offsetTop - this.element.parentElement.offsetTop), (obstacles[i].getBottom() - this.element.offsetTop - this.element.parentElement.offsetTop));
                        lineAdjust = 13 - (bottom - startTop) % 13; // TO-DO : line-height
                        height = bottom - startTop + lineCompensate + lineAdjust;
                        left = Math.min((obstacles[i-1].getRight() - this.element.offsetLeft - this.element.parentElement.offsetLeft), (obstacles[i].getRight() - this.element.offsetLeft - this.element.parentElement.offsetLeft));
                        right = Math.max((obstacles[i-1].getLeft() - this.element.offsetLeft - this.element.parentElement.offsetLeft), (obstacles[i].getLeft() - this.element.offsetLeft - this.element.parentElement.offsetLeft));
                        width = (right - left >= 0)? right - left : 0;
                        textBlock.element.style.paddingLeft = left - c.getLeft() + 'px';
                    }
                    textBlock.element.style.top = startTop + 'px';
                    textBlock.element.style.height = height + 'px';
                    textBlock.element.style.width = width + 'px';
                    textBlock.element.style.paddingRight = c.columnRule + 'px';
                    if (prevBlock) {
                        textBlock.before = prevBlock;
                        prevBlock.after = textBlock;
                    } else {
                        c.firstBlock = textBlock;
                    }
                    prevBlock = textBlock;
                    startTop = textBlock.getBottom() - lineCompensate;
                    if (leftGap <= 0 && rightGap <= 0) {
                        startTop = (obstacles[i].getBottom() - this.element.offsetTop - this.element.parentElement.offsetTop);
                    } else {
                        textBlock = new EDITOR.object.TextBlock(c);
                        textBlock.element.style.top= startTop + 'px';
                        if (leftGap > rightGap) {
                            textBlock.element.style.width = leftGap + 'px';
                        } else {
                            textBlock.element.style.paddingLeft = (obstacles[i].getRight() - this.element.offsetLeft - this.element.parentElement.offsetLeft) - c.getLeft() + 'px';
                            textBlock.element.style.width = rightGap - c.columnRule + 'px';
                            textBlock.element.style.paddingRight = c.columnRule + 'px';
                        }

                        // TO-DO : fix overlap
                        if (i+1 < obstacles.length && (obstacles[i+1].getTop() - this.element.offsetTop - this.element.parentElement.offsetTop) < (obstacles[i].getBottom() - this.element.offsetTop - this.element.parentElement.offsetTop)) {
                            if (leftGap > rightGap) {
                                if (((obstacles[i+1].getLeft() - this.element.offsetLeft - this.element.parentElement.offsetLeft) >= c.getLeft() && (obstacles[i+1].getLeft() - this.element.offsetLeft - this.element.parentElement.offsetLeft) < c.getLeft() + leftGap)
                                    || ((obstacles[i+1].getRight() - this.element.offsetLeft - this.element.parentElement.offsetLeft) >= c.getLeft() && (obstacles[i+1].getLeft() - this.element.offsetLeft - this.element.parentElement.offsetLeft) < c.getLeft() + leftGap)
                                    || ((obstacles[i+1].getLeft() - this.element.offsetLeft - this.element.parentElement.offsetLeft) < c.getLeft() && (obstacles[i+1].getRight() - this.element.offsetLeft - this.element.parentElement.offsetLeft) > c.getLeft() + leftGap)) {
                                    lineAdjust = ((obstacles[i+1].getTop() - this.element.offsetTop - this.element.parentElement.offsetTop) - startTop) % 13; //TO-DO : line-height
                                    height = (obstacles[i+1].getTop() - this.element.offsetTop - this.element.parentElement.offsetTop) - startTop -lineAdjust + lineCompensate;
                                } else {
                                    lineAdjust = 13 -((obstacles[i].getBottom() - this.element.offsetTop - this.element.parentElement.offsetTop) - startTop) % 13; //TO-DO : line-height
                                    height = (obstacles[i+1].getBottom() - this.element.offsetTop - this.element.parentElement.offsetTop) - startTop + lineAdjust + lineCompensate;
                                }
                            } else {
                                if (((obstacles[i+1].getLeft() - this.element.offsetLeft - this.element.parentElement.offsetLeft) >= (obstacles[i].getRight() - this.element.offsetLeft - this.element.parentElement.offsetLeft) && (obstacles[i+1].getLeft() - this.element.offsetLeft - this.element.parentElement.offsetLeft) < (obstacles[i].getRight() - this.element.offsetLeft - this.element.parentElement.offsetLeft) + rightGap)
                                    || ((obstacles[i+1].getRight() - this.element.offsetLeft - this.element.parentElement.offsetLeft) >= (obstacles[i].getRight() - this.element.offsetLeft - this.element.parentElement.offsetLeft) && (obstacles[i+1].getLeft() - this.element.offsetLeft - this.element.parentElement.offsetLeft) < (obstacles[i].getRight() - this.element.offsetLeft - this.element.parentElement.offsetLeft) + rightGap)
                                    || ((obstacles[i+1].getLeft() - this.element.offsetLeft - this.element.parentElement.offsetLeft) < (obstacles[i].getRight() - this.element.offsetLeft - this.element.parentElement.offsetLeft) && (obstacles[i+1].getRight() - this.element.offsetLeft - this.element.parentElement.offsetLeft) > (obstacles[i].getRight() - this.element.offsetLeft - this.element.parentElement.offsetLeft) + rightGap)) {
                                    lineAdjust = ((obstacles[i+1].getTop() - this.element.offsetTop - this.element.parentElement.offsetTop) - startTop) % 13; //TO-DO : line-height
                                    height = (obstacles[i+1].getTop() - this.element.offsetTop - this.element.parentElement.offsetTop) - startTop -lineAdjust + lineCompensate;
                                } else {
                                    lineAdjust = 13 -((obstacles[i].getBottom() - this.element.offsetTop - this.element.parentElement.offsetTop) - startTop) % 13; //TO-DO : line-height
                                    height = (obstacles[i+1].getBottom() - this.element.offsetTop - this.element.parentElement.offsetTop) - startTop + lineAdjust + lineCompensate;
                                }
                            }
                        } else {
                            lineAdjust = 13 - ((obstacles[i].getBottom() - this.element.offsetTop - this.element.parentElement.offsetTop) - startTop) % 13; // TO-DO : line-height
                            height = (obstacles[i].getBottom() - this.element.offsetTop - this.element.parentElement.offsetTop) - startTop + lineAdjust + lineCompensate;
                        }
                        textBlock.element.style.height = height + 'px'; 

                        if (prevBlock) {
                            textBlock.before = prevBlock;
                            prevBlock.after = textBlock;
                        } else {
                            c.firstBlock = textBlock;
                        }
                        prevBlock = textBlock;
                        startTop = textBlock.getBottom() - lineCompensate;
                    }
                }
                if(startTop < c.getBottom()){
                    textBlock = new EDITOR.object.TextBlock(c);
                    textBlock.element.style.top = startTop + 'px';
                    textBlock.element.style.height = c.getBottom() - startTop + 'px';
                    textBlock.element.style.width = c.getWidth() - c.columnRule + 'px';
                    textBlock.element.style.paddingRight = c.columnRule + 'px';
                    if (prevBlock) {
                        textBlock.before = prevBlock;
                        prevBlock.after = textBlock;
                    } else {
                        c.firstBlock = textBlock;
                    }
                    prevBlock = textBlock;
                    startTop = textBlock.getBottom();
                }
            } else {
                var textBlock = new EDITOR.object.TextBlock(c);
                textBlock.element.style.width = c.getWidth() - c.columnRule + 'px';
                textBlock.element.style.height = c.getHeight()+'px';
                textBlock.element.style.paddingRight = c.columnRule+'px';
                c.firstBlock = textBlock;
            }
            c = c.after;
        }
    },
    renderText: function(){
        var column = this.firstColumn,
            textTail = this.text;
        while (column && textTail && textTail.length > 0) {
            textTail = column.setText(textTail);
            column = column.after;
        }
    },

    add: function(obj) {
        if(typeof obj == 'object' && obj instanceof EDITOR.Object) {
            this.items.push(obj);
            this.element.appendChild(obj.element);
            this.refreshHolder();
        }
    },
    remove: function(elem){
        if (elem && this.element.hasChildNodes()) {
            this.element.removeChild(elem);
        }
    },
    clear: function(){
        this.element.innerHTML = '';
    }
    
});
EDITOR.object.TextColumn = function(owner, width) {
    this.element = document.createElement('div');
    this.element.addClassName('text-column');
    // this.element.style.position = 'absolute';
    // this.element.style.top = 0;
    // this.element.style.bottom = 0;
    this.element.style.width = width;
    if (typeof owner == 'object') {
        owner.addElement(this.element);
        this.ownerHolder = owner;
    }
};
EDITOR.object.TextColumn.prototype = (new EDITOR.Object()).join({
    text: '',
    ownerHolder: null,
    before: null,
    after: null,
    firstBlock: null,
    columnRule: 10,

    setText: function(text) {
        var block = this.firstBlock,
            height, iter, wrapPoint, buffer = '';
        if (block) {
            while (block) {
                height = block.getScrollHeight();
                for (iter = 0; iter < text.length; iter++) {
                    if (text.charAt(iter) == '-' 
                        || text.charAt(iter) == '+'
                        || text.charAt(iter) == ' ')
                        wrapPoint = iter;
                    
                    // TO-DO : add style cases
                    buffer += text.charAt(iter);
                    block.setText(buffer);
                    if (block.getScrollHeight() > height) {
                        break;
                    }
                }
                if (iter < text.length) {
                    buffer = text.substr(0, (wrapPoint? wrapPoint:iter)) + " ";
                    do {
                        buffer += "&nbsp;";
                        block.setHtml(buffer);
                        this.text = buffer;
                    } while (block.getScrollHeight() <= height);
                } else {
                    block.setHtml(text);
                }
                text = text.substr((wrapPoint? wrapPoint:iter), text.length - iter);
                wrapPoint = null;
                block = block.after;
                buffer = '';
            }
        }
        // return (iter < text.length) ? text : '';
        return text;
    },

    getTop: function(){
        return this.element.offsetTop;
    },
    getRight: function(){
        return this.element.offsetLeft + this.element.offsetWidth;
    },
    getBottom: function(){
        return this.element.offsetTop + this.element.offsetHeight;
    },
    getLeft: function(){
        return this.element.offsetLeft;
    },
    getWidth: function(){
        return this.element.offsetWidth;
    },
    getHeight: function(){
        return this.element.offsetHeight;
    },

    add: function(obj) {
        if(typeof obj == 'object' && obj instanceof EDITOR.Object) {
            this.items.push(obj);
            this.element.appendChild(obj.element);
        }
    },
    remove: function(elem){
        if (elem && this.element.hasChildNodes()) {
            this.element.removeChild(elem);
        }
    },
    clear: function(){
        this.element.innerHTML = '';
    }
});
EDITOR.object.TextBlock = function(owner) {
    this.element = document.createElement('div');
    this.element.addClassName('text-block');
    this.element.style.position = 'absolute';
    if (typeof owner == 'object') {
        owner.addElement(this.element);
        this.ownerColumn = owner;
    }
};
EDITOR.object.TextBlock.prototype = (new EDITOR.Object()).join({
    ownerColumn: null,
    before: null,
    after: null,

    setText: function(c) {
        this.element.innerText = c;
    },
    setHtml: function(c) {
        this.element.innerHTML = c;
    },
    getScrollHeight: function() {
        return this.element.scrollHeight;
    },
    getScrollWidth: function() {
        return this.element.scrollWidth;
    },

    getTop: function(){
        return this.element.offsetTop;
    },
    getRight: function(){
        return this.element.offsetLeft + this.element.offsetWidth;
    },
    getBottom: function(){
        return this.element.offsetTop + this.element.offsetHeight;
    },
    getLeft: function(){
        return this.element.offsetLeft;
    },
    getWidth: function(){
        return this.element.offsetWidth;
    },
    getHeight: function(){
        return this.element.offsetHeight;
    },
});
EDITOR.object.Image = function(src, width, height, left, top) {
    this.element = document.createElement('img');
    this.element.src = src;
    this.element.style.position = 'absolute';
    this.element.style.width = width + 'px';
    this.element.style.height = height + 'px';
    
    if (left)
        this.left = left;
    if (top)
        this.top = top;   
    if (width)
        this.width = width;
    if (height)
        this.height = height;    
        
    this.element.style.left = this.left + 'px';
    this.element.style.top = this.top + 'px';
    this.element.style.paddingLeft = 5 + 'px';
    this.element.style.paddingRight = 5 + 'px';

    this.initMoveControl();
    this.initObjectControl();
    var onMove = bind(this, this.onMove);
    this.element.addEventListener('move', onMove);
};
EDITOR.object.Image.prototype = (new EDITOR.Object()).join({

    setLeft: function(val) {
        this.left = val;
        this.element.style.left = val + 'px';
    },
    setTop: function(val) {
        this.top = val;
        this.element.style.top = val + 'px';
    },
    getWidth: function(){
        return this.width + 10;
    },

    onMove: function(e) {
        this.setLeft(e.left);
        this.setTop(e.top);
    }
});



EDITOR.event = {}; // Event bundle for an element
EDITOR.event.Move = function(element, moveRange) {
    this.element = element;
    this.moveRange = moveRange || document;
    var mouseDown = bind(this, this.mouseDown);
    var mouseMove = bind(this, this.mouseMove);
    var mouseUp = bind(this, this.mouseUp);
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

        var mouseDown = bind(this,this.mouseDown);
        var scalerMove = bind(this,this.scalerMove);
        var mouseUp = bind(this,this.mouseUp);
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
EDITOR.event.TabSelect = function(tabObj, triggerElem) {
    this.element = triggerElem || tabObj.label;
    this.object = tabObj;
    this.element.addEventListener('click', bind(this,this.fire));
}
EDITOR.event.TabSelect.prototype = {
    fire: function(e) {
        var selectEvent = document.createEvent('Events');
        selectEvent.initEvent('tabselect', true, false);
        selectEvent.tab = this.object;
        this.element.dispatchEvent(selectEvent);
    }  
};
EDITOR.event.Execute = function(obj) {
    this.element = obj.element;
    this.object = obj;
    this.element.addEventListener('mousedown', bind(this, function(e) {
        if (e.button == 0)
            this.fire(e);
    }));
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

// Control

EDITOR.Controls = function(elem) {
    this.element = elem;
    this.controls = {};
    this.controlList = null;
    this.activeControlName = null;
}
EDITOR.Controls.prototype = {
    load: function(controlList) {
        if (this.element && this.element instanceof Element) {
            this.controlList = controlList;
            for (var i = 0; i < controlList.length; i++) {
                if (typeof controlList[i] == 'function') {
                    var control = new controlList[i](this.element);
                    this.controls[control.controlName] = control;
                }
            }
            this.element.addEventListener('controlactivate', bind(this, this.controlActivate));
        }
    },
    controlActivate: function(e) {
        if (e.controlName && this.activeControlName == e.controlName) {
            this.controls[this.activeControlName].deactivate();
            this.activeControlName = null;
            return;
        }
        if (this.activeControlName && this.controls[this.activeControlName]) {
            this.controls[this.activeControlName].deactivate();
        }
        if (e.controlName && this.controls[e.controlName]) {
            this.controls[e.controlName].activate();
            this.activeControlName = e.controlName;
        }
    }
    
};
EDITOR.control = EDITOR.control || {};
EDITOR.Control = function() {};
EDITOR.Control.prototype = {
    element: null,
    owner: null,
    controlName: null,

    execute: null,

    initControl: function() {
        this.element = document.createElement('div');
        this.element.addClassName('tool-btn');
        if (this.controlName) {
            this.element.addClassName(this.controlName + '-tool-btn');
        }
    },
    initClickEvent: function() {
        this.element.addEventListener('click', bind(this, this.click));
    },
    initActivateEvent: function() {
        this.element.addEventListener('click', bind(this, this.activateClick));
    },
    initMouseEvent: function() {
        this.element.addEventListener('mouseover', bind(this, function(){
            this.element.addClassName('tool-btn-hover');
        }));
        this.element.addEventListener('mouseout', bind(this, function(){
            this.element.removeClassName('tool-btn-hover');
        }));
    },
    click: function(e) {
        var clickEvent = document.createEvent('Events');
        clickEvent.initEvent('controlclick',true,false);
        clickEvent.controlName = this.controlName;
        clickEvent.execute = this.execute;
        this.element.dispatchEvent(clickEvent);
    },
    activateClick: function(e) {
        var clickEvent = document.createEvent('Events');
        clickEvent.initEvent('controlactivate',true,false);
        clickEvent.controlName = this.controlName;
        clickEvent.control = this;
        this.element.dispatchEvent(clickEvent);
    },
    activate: function() {
        if (this.element && this.element instanceof Element) {
            this.element.addClassName('tool-btn-active');
        }
    },
    deactivate: function() {
        this.reset();
        if (this.element && this.element instanceof Element) {
            this.element.removeClassName('tool-btn-active');
        }
    },
    execute: function() {console.log('empty execute!')},
    reset: function() {console.log('empty reset!')}
};
EDITOR.control.Pointer = function(holder){
    this.initControl();
    this.initActivateEvent();
    this.element.title = 'Pointer';
    if (typeof holder == 'object' && holder instanceof Element) {
        holder.appendChild(this.element);
        this.owner = holder;
    }
};
EDITOR.control.Pointer.prototype = (new EDITOR.Control()).join({
    controlName: 'pointer',
    activeObject: null,
    execute: function(e, target, object) {
        this.reset();
        if (target instanceof EDITOR.Tab 
            && object instanceof EDITOR.Object) {
            this.activeObject = object;
            if (this.activeObject.moveControl) {
                e.button = 0;
                this.activeObject.moveControl.activate();
                this.activeObject.moveControl.mouseDown(e);
            }
            if (this.activeObject.resizeControl)
                this.activeObject.resizeControl.activate();
        }
    },
    reset: function() {
        if (this.activeObject) {
            if (this.activeObject.moveControl)
                this.activeObject.moveControl.deactivate();
            if (this.activeObject.resizeControl)
                this.activeObject.resizeControl.deactivate();
            this.activeObject == null;
        }
    }
});
EDITOR.control.DrawBlock = function(holder){
    this.initControl();
    this.initActivateEvent();
    this.element.title = 'New Block';
    var inner = document.createElement('span');
    inner.style.fontSize = '40px';
    inner.style.lineHeight = '45px';
    inner.innerText = '+';
    this.element.appendChild(inner);
    if (typeof holder == 'object' && holder instanceof Element) {
        holder.appendChild(this.element);
        this.owner = holder;
    }
};
EDITOR.control.DrawBlock.prototype = (new EDITOR.Control()).join({
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
EDITOR.control.DrawImage = function(holder){
    this.initControl();
    this.initActivateEvent();
    this.element.title = 'New Image';
    var inner = document.createElement('span');
    inner.style.fontSize = '40px';
    inner.style.lineHeight = '45px';
    inner.innerText = '+';
    this.element.appendChild(inner);
    if (typeof holder == 'object' && holder instanceof Element) {
        holder.appendChild(this.element);
        this.owner = holder;
    }
};
EDITOR.control.DrawImage.prototype = (new EDITOR.Control()).join({
    controlName: 'drawimage',
    activeObject: null,
    execute: function(e, target) {
        var image = new EDITOR.object.Image('resources/img/beach.jpg', 100, 100),
            paper = target.paper;
        image.setLeft(e.pageX - target.element.offsetLeft - paper.element.offsetLeft);
        image.setTop(e.pageY - target.element.offsetTop - paper.element.offsetTop);
        paper.add(image);
        paper.refresh();
    }
});
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
EDITOR.control.AddPage.prototype = (new EDITOR.Control()).join({
    controlName: 'addpage',
    execute: function(e, workspace) {
        var element = workspace.element,
            header = workspace.headerControls,
            // tabs = workspace.tabs,
            tab = new EDITOR.Tab('tab-' + workspace.tabCount++);
        workspace.element.appendChild(tab.element);
        header.element.appendChild(tab.label);
        tab.selectEvent.fire();
    }
});

EDITOR.Tab = function(tabId) {
    this.id = tabId
    this.element = document.createElement('div');
    this.element.addClassName('paper-holder');
    this.element.addClassName(this.id);
    this.element.style.zIndex = -1;
    this.label = document.createElement('div');
    this.label.addClassName('tab-label');
    this.label.addClassName("label-" + this.id);
    this.paper = new EDITOR.Paper();
    this.element.appendChild(this.paper.element);
    this.executeEvent = new EDITOR.event.Execute(this);
    this.selectEvent = new EDITOR.event.TabSelect(this, this.label);
};
EDITOR.Tab.prototype = {
    id: null,
    element: null,
    label: null,
    paper: null,
    executeEvent: null,
    selectEvent: null,
    hide: function() {
        this.label.removeClassName('tab-active');
    this.element.style.zIndex = -1;
    },
    show: function() {
        this.label.addClassName('tab-active');
    this.element.style.zIndex = 1;
    }
};

EDITOR.Workspace = function(controlList) {
    this.controlList = controlList || [
        EDITOR.control.Pointer,
        EDITOR.control.DrawBlock,
        EDITOR.control.DrawImage,
    ];

    this.element = document.querySelector('.workspace');
    this.controls = new EDITOR.Controls(document.querySelector('.control-holder'));
    this.controls.load(this.controlList);

    this.headerControls = new EDITOR.Controls(document.querySelector('.header-control-holder'));
    this.headerControls.load([EDITOR.control.AddPage]);

    this.initControlHandler();
};
EDITOR.Workspace.prototype = {
    element: null,
    controlList: null,
    controls: null,
    headerControls: null,
    // listeners: {},

    // tabs: [],
    tabCount: 0,
    activeTab: null,
    activeObject: null,

    activeControl: null,

    initControlHandler: function() {
        document.addEventListener('controlclick', bind(this, function(e){
            if (typeof e.execute == 'function'){
                e.execute(e, this);
            }
        }));
        document.addEventListener('controlactivate', bind(this, function(e){
            if(this.activeControl == e.control){
                this.activeControl = null;
            } else {
                this.activeControl = e.control; 
            }
        })); 
        document.addEventListener('execute', bind(this, function(e){
            var control = this.activeControl;
            if (control && typeof control.execute == 'function') {
                control.execute(e, e.targetObject, this.activeObject);
            }
        }));
        document.addEventListener('objectfocus', bind(this, function(e){
            if (e.focusedObject && e.focusedObject instanceof EDITOR.Object) {
                this.activeObject = e.focusedObject;
            } else {
                this.activeObject = null;
            }
        }));
        document.addEventListener('tabselect', bind(this, function(e){
            if (this.activeTab) {
               this.activeTab.hide(); 
            }
            if (e.tab instanceof EDITOR.Tab) {
                this.activeTab = e.tab;
                this.activeTab.show();
            }
        }));
    }  
};

