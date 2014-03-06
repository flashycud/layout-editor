EDITOR.object = EDITOR.object || {};
EDITOR.object.Block = function() {
    this.element = document.createElement('div');
    this.element.addClassName('block');
    this.initNotify();

    this.initMoveControl();
    this.initResizeControl();
    this.initObjectControl();

    this.items = [];

    //TO-DO
    var holder = new EDITOR.object.Holder(this, text);
    this.add(holder);
    this.element.addEventListener('resize', EDITOR.bind(this, function() {
        if (this.element.offsetWidth < 100) {
            this.element.style.width = '100px';
        }
        if (this.element.offsetHeight < 100) {
            this.element.style.height = '100px';
        }
        this.left = this.element.offsetLeft;
        this.top = this.element.offsetTop;
    }));
    this.element.addEventListener('move', EDITOR.bind(this, function() {
        this.left = this.element.offsetLeft;
        this.top = this.element.offsetTop;
    }));
};
EDITOR.object.Block.prototype = EDITOR.extends(new EDITOR.Object(), {
    items: null,
    linkHead:null,
    linkFrom:null,
    linkTo:null,
    linkHead:null,
    controls: new EDITOR.object.block.Controls(),

    initNotify: function() {
        this.notify = document.createElement('div');
        this.notify.addClassName('notify');
        this.notify.style.display = 'none';
        if (this.element) {
            this.element.appendChild(this.notify);
        }
    },
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
        this.left = left;
        this.element.style.left = left + 'px';
    },
    setTop: function(top) {
        this.top = top;
        this.element.style.top = top + 'px';
    },
    setWidth: function(val) {
        this.width = val;
        this.element.style.width = val + 'px'
    },
    setHeight: function(val) {
        this.height = val;
        this.element.style.height = val + 'px'
    },
    setWarning: function(text) {
        var me = this;
        me.notify.style.display = 'block';
        me.notify.addClassName('warning');
        me.notify.innerText = text;
        setTimeout(function() {
            me.notify.removeClassName('warning');
        },500);
        if (this.notifyTimeout) {
            clearTimeout(this.notifyTimeout);
        }
        this.notifyTimeout = setTimeout(function() {
            me.notify.style.display = 'none';
        },1500);
    },

    setContent: function(text) {
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            if (item instanceof EDITOR.object.Holder) {
                item.text = text;
            }
        }
    },
    setColumn: function(num) {
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            if (item instanceof EDITOR.object.Holder) {
                item.columnCount = num;
            }
        }
    }

});

// EDITOR.object.Holder = function(text, columnCount) {
//     this.text = text;
//     this.element = document.createElement('div');
//     this.element.addClassName('holder');
//     this.element.style.display = '-webkit-box';
//     this.element.style.position = 'relative';
// };
EDITOR.object.Holder = function(parent, text, width, height) {
    this.parent = parent;
    this.element = document.createElement('div');
    this.element.addClassName('holder');
    this.element.style.position = 'relative';
    this.element.style.width = width || '100%';
    this.element.style.height = height || '100%';
    this.element.style.display = '-webkit-box';
    this.element.style.display = '-moz-box';
    this.element.style.display = 'box';
    this.element.style.overflow = 'hidden';
    this.items = [];

    this.text = text || '';
    this.refresh();

    // var refreshHolder = EDITOR.bind(this, this.refreshHolder);
    // this.element.addEventListener('move', refreshHolder);
    // document.addEventListener('resize', refreshHolder); // TO-DO
};
EDITOR.object.Holder.prototype = EDITOR.extends(new EDITOR.Object(), {
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
        width = element.offsetWidth/columnCount + 'px';
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
                        top = t.getTop() - this.element.offsetTop - this.element.parentElement.offsetTop,
                        bottom = t.getBottom() - this.element.offsetTop - this.element.parentElement.offsetTop,
                        left = t.getLeft() - this.element.offsetLeft - this.element.parentElement.offsetLeft,
                        right = t.getRight() - this.element.offsetLeft - this.element.parentElement.offsetLeft;
                    if (((left < c.getRight() && left >= c.getLeft())
                            || (right <= c.getRight() && right > c.getLeft())
                            || (left < c.getLeft() && right > c.getRight()))
                        && ((top < c.getBottom() && top >= c.getTop())
                            || (bottom <= c.getBottom() && bottom > c.getTop()))
                            || (top < c.getTop() && bottom > c.getBottom())) {
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
                        bottom = Math.min((obstacles[i-1].getBottom() - this.element.offsetTop - this.element.parentElement.offsetTop), (obstacles[i].getBottom() - this.element.offsetTop - this.element.parentElement.offsetTop), c.getBottom());
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
                        height = Math.min(height, c.getBottom() - startTop - lineAdjust + lineCompensate);
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
        if (this.element.parentElement) {
            if (!this.parent.linkTo && textTail && textTail.length > 0 ) {
                this.element.parentElement.addClassName('text-overflow');
                this.parent.setWarning('Text Overflow');
            } else {
                this.element.parentElement.removeClassName('text-overflow');
            }
            if (this.parent.linkTo) {
                this.parent.linkTo.setContent(textTail);
            }
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
EDITOR.object.TextColumn.prototype = EDITOR.extends(new EDITOR.Object(), {
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
EDITOR.object.TextBlock.prototype = EDITOR.extends(new EDITOR.Object(), {
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