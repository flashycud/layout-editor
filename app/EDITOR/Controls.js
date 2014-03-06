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
            // this.element.addEventListener('controlactivate', EDITOR.bind(this, this.controlActivate));
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