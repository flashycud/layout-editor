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
    selectedObject: null,
    activeSourceObject: null,

    activeControl: null,

    initControlHandler: function() {
        document.addEventListener('controlclick', EDITOR.bind(this, function(e){
            if (typeof e.control == 'object' && typeof e.control.execute == 'function'){
                e.control.execute(e, this);
            }
        }));
        document.addEventListener('controlactivate', EDITOR.bind(this, function(e){
            if (this.activeControl == e.control && (!e.sourceObject || e.sourceObject == this.activeSourceObject)){
                if (this.activeControl && typeof this.activeControl.deactivate == 'function') {
                    this.activeControl.deactivate();
                }
                this.activeControl = null;
            } else {
                if (this.activeControl && typeof this.activeControl.deactivate == 'function') {
                    this.activeControl.deactivate();
                }
                this.activeControl = e.control; 
                if (typeof this.activeControl.activate == 'function') {
                    this.activeControl.activate();
                }
            }
            if (e.sourceObject) {
                this.activeSourceObject = e.sourceObject;
            } else {
                this.activeSourceObject = null;
            }
        })); 
        document.addEventListener('controldeactivate', EDITOR.bind(this, function(e){
            if (this.activeControl && typeof this.activeControl.deactivate == 'function') {
                this.activeControl.deactivate();
            }
            this.activeControl = null;
            this.activeSourceObject = null;
        }));
        document.addEventListener('execute', EDITOR.bind(this, function(e){
            var control = this.activeControl;
            if (control && typeof control.execute == 'function') {
                control.execute(e, e.targetObject, this.activeObject, this.activeSourceObject);
            }
        }));
        document.addEventListener('objectfocus', EDITOR.bind(this, function(e){
            if (e.focusedObject
                && e.focusedObject != this.activeObject 
                && e.focusedObject instanceof EDITOR.Object) {
                if (this.activeObject && this.activeObject.controls) {
                    this.activeObject.controls.clearObject();
                }
                this.activeObject = e.focusedObject;
                if (this.activeObject.controls && !this.activeControl) {
                    var controls = this.activeObject.controls;
                    controls.setObject(this.activeObject);
                }                
            } else if (!(e.focusedObject && e.focusedObject instanceof EDITOR.Object)) {
                if (this.activeObject && this.activeObject.controls) {
                    this.activeObject.controls.clearObject();
                }
                this.activeObject = null;
            }
        }));
        document.addEventListener('objectselect', EDITOR.bind(this, function(e){
            // if (!this.activeControl) {
                // if (e.selectedObject
                //     && e.selectedObject != this.selectedObject) {
                // console.log(this.selectedObject);
                if (this.activeObject) {
                    if (this.selectedObject && this.selectedObject.controls) {
                        this.selectedObject.controls.unfocusObject();
                    }
                    this.selectedObject = this.activeObject;
                    if (this.selectedObject && this.selectedObject.controls) {
                        this.selectedObject.controls.focusObject(this.selectedObject);
                    }                
                } else {
                    if (this.selectedObject && this.selectedObject.controls) {
                        this.selectedObject.controls.unfocusObject();
                    }
                    this.selectedObject = null;
                }
            // } else {
            //     this.selectedObject = null;
            // }
        }));
        document.addEventListener('tabselect', EDITOR.bind(this, function(e){
            if (this.activeTab) {
               this.activeTab.hide(); 
            }
            if (e.tab instanceof EDITOR.Tab) {
                this.activeTab = e.tab;
                this.activeTab.show();
                this.activeTab.paper.refresh();
            }
        }));

        document.addEventListener('keydown', EDITOR.bind(this, function(e) {
            if (e.keyCode == 46) { // delete
                if (this.selectedObject) {
                    this.activeTab.paper.remove(this.selectedObject);
                    this.selectedObject = null;
                } 
            }
        }));
        document.addEventListener('mousedown', EDITOR.bind(this, function(e) {
            // console.log('fire!');
            var objectEvent = document.createEvent('Events');
            objectEvent.initEvent('objectselect', true, false);
            objectEvent.selectedObject = null;
            this.element.dispatchEvent(objectEvent);
        }));
    }  
};

