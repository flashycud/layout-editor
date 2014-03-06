EDITOR.object = EDITOR.object || {};
EDITOR.object.Image = function(src, width, height, left, top) {
    this.element = document.createElement('div');
    this.element.style.position = 'absolute';
    this.element.style.width = width + 'px';
    this.element.style.height = height + 'px';
    this.image = document.createElement('img');
    this.image.src = src;
    this.image.style.width = width + 'px';
    this.image.style.height = height + 'px';
    
    if (left)
        this.left = left;
    if (top)
        this.top = top;   
    if (width)
        this.width = width;
    if (height)
        this.height = height;    
        
    this.element.appendChild(this.image);
    // this.image.style.left = this.left + 'px';
    // this.image.style.top = this.top + 'px';
    // this.image.style.paddingLeft = 5 + 'px';
    // this.image.style.paddingRight = 5 + 'px';

    this.initMoveControl();
    this.initResizeControl();
    this.initObjectControl();
    var onMove = EDITOR.bind(this, this.onMove);
    var onResize = EDITOR.bind(this, this.onResize);
    this.element.addEventListener('move', onMove);
    this.element.addEventListener('resize', onResize);
};
EDITOR.object.Image.prototype = EDITOR.extends(new EDITOR.Object(), {

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
    },
    onResize: function(e) {
        console.log(this.image);
        this.image.style.width = this.element.offsetWidth + 'px';
        this.image.style.height = this.element.offsetHeight + 'px';
        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;
        this.left = this.element.offsetLeft;
        this.top = this.element.offsetTop;
    }
});
