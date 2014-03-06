EDITOR.object.block = EDITOR.object.block || {};
EDITOR.object.block.Controls = function() {
	this.element = document.createElement('div');
	this.element.style.position = 'absolute';
	this.element.style.zIndex = 9996;

	this.add(new EDITOR.object.block.control.LinkControl(this));
	this.add(new EDITOR.object.block.control.LinkTo(this));
	this.add(new EDITOR.object.block.control.LinkFrom(this));

	// this.initInterfaceEvent();
};
EDITOR.object.block.Controls.prototype = {
	object: null,
	paddingLeft: 10,
	paddingRight: 25,
	paddingTop: 10,
	paddingBottom: 10,

	permanentFlag: false, // For permanent show
	focusFlag: false, // For focus click
	activeFlag: false, // For check already unbound 

	focusObject: function(obj) {
		if (obj && obj instanceof EDITOR.Object) {
			if (!this.focusFlag) {
				this.setObject(obj);
				this.object.element.style.borderColor = 'black';
				this.object.element.style.borderWidth = '1px';
				this.object.element.style.borderStyle = 'dashed';
				this.object.element.style.left = this.object.element.offsetLeft - 1 + 'px';
				this.object.element.style.top = this.object.element.offsetTop - 1 + 'px';
				this.focusFlag = true;
				this.permanentFlag = true;
			}
		}
	},
	unfocusObject: function() {
		if (this.object && this.focusFlag) {
			this.object.element.style.borderColor = '';
			this.object.element.style.borderWidth = '';
			this.object.element.style.borderStyle = '';
			this.object.element.style.left = this.object.element.offsetLeft + 1 + 'px';
			this.object.element.style.top = this.object.element.offsetTop + 1 + 'px';
			this.focusFlag = false;
			this.permanentFlag = false;
			this.clearObject();
		}
	},
	setObject: function(obj) {
		if (!this.activeFlag && !this.permanentFlag) {
			this.object = obj;
			this.object.element.appendChild(this.element);
			this.element.style.width = this.object.element.offsetWidth + this.paddingLeft + this.paddingRight + 'px';
			this.element.style.height = this.object.element.offsetHeight + this.paddingTop + this.paddingBottom + 'px';
			this.element.style.left = -this.paddingLeft + 'px';
			this.element.style.top = -this.paddingTop + 'px';
			this.element.style.display = 'block';
			// this.object.element.style.width = this.object.element.offsetWidth + this.width + 'px';
			this.activeFlag = true;
		}
		if (this.linkto && this.object.linkTo) {
			this.linkto.element.style.display = 'block';
		} else {
			this.linkto.element.style.display = 'none';
		}
		if (this.linkfrom && this.object.linkHead) {
			this.linkfrom.element.style.display = 'block';
		} else {
			this.linkfrom.element.style.display = 'none';
		}
	},
	clearObject: function() {
		if (this.object && this.activeFlag && !this.permanentFlag) {
			// this.object.element.removeChild(this.element);
			this.element.style.display = 'none';
			// this.object.element.style.width = this.object.element.offsetWidth - this.width + 'px';
			this.object = null;
			this.activeFlag = false;
		}
	},
	add: function(control) {
		this[control.controlName] = control;
		this.element.appendChild(control.element);
	},
	togglePermanent: function() {
		this.permanentFlag = !this.permanentFlag;
	},

	initInterfaceEvent: function() {
		this.element.addEventListener('mousedown', EDITOR.bind(this, function(e) {
			this.togglePermanent();
		}));
	},
	clear: function(){
		this.unfocusObject();
		this.clearObject();
	}
};
EDITOR.object.block = EDITOR.object.block || {};
EDITOR.object.block.control = EDITOR.object.block.control || {};
EDITOR.object.block.control.LinkControl = function(controls){
	this.controls = controls;
	this.element = document.createElement('div');
	this.element.style.position = 'absolute';
	this.element.style.bottom = '12px';
	this.element.style.right = '7px';
	this.element.style.width = '18px';
	this.element.style.height = '18px';
	this.element.style.borderRadius = '2px';

	this.icon = document.createElement('div');
	this.icon.style.width = '14px';
	this.icon.style.height = '14px';
	this.icon.style.margin = 'auto';
	this.icon.style.marginTop = '2px';
	this.icon.style.webkitMaskImage = 'url(resources/css/icons/link.png)';
	this.icon.style.oMaskImage = 'url(resources/css/icons/link.png)';
	this.icon.style.mozMaskImage = 'url(resources/css/icons/link.png)';
	this.icon.style.maskImage = 'url(resources/css/icons/link.png)';
	this.icon.style.webkitMaskSize = '14px';
	this.icon.style.oMaskSize = '14px';
	this.icon.style.mozMaskSize = '14px';
	this.icon.style.maskSize = '14px';
	this.icon.style.webkitMaskPosition = '50%';
	this.icon.style.oMaskPosition = '50%';
	this.icon.style.mozMaskPosition = '50%';
	this.icon.style.maskPosition = '50%';
	this.icon.style.webkitMaskRepeat = 'no-repeat';
	this.icon.style.oMaskRepeat = 'no-repeat';
	this.icon.style.mozMaskRepeat = 'no-repeat';
	this.icon.style.maskRepeat = 'no-repeat';
	this.icon.style.backgroundColor = '#555';

	this.element.appendChild(this.icon);
	this.element.addEventListener('mousedown', EDITOR.bind(this, function(e) {
        var clickEvent = document.createEvent('Events'),
        	obj = this.controls.object;
        clickEvent.initEvent('controlactivate',true,false);
        clickEvent.controlName = this.controlName;
        clickEvent.control = this;
        clickEvent.sourceObject = obj;
        this.element.dispatchEvent(clickEvent);
        EDITOR.cancelBubble(e);
	}));
	this.element.addEventListener('mouseover', EDITOR.bind(this, this.mouseOver));
	this.element.addEventListener('mouseout', EDITOR.bind(this, this.mouseOut));
};
EDITOR.object.block.control.LinkControl.prototype = {
	controlName: 'link',
	activateFlag: false,
	execute: function(e, tab, target, source) {
		if (source != target) {
			if (!target){
				var me = this,
					target = new EDITOR.object.Block(),
		            paper = tab.paper;
	            if (source.linkTo) {
	        		source.linkTo.linkHead = null;
	        	}
		        source.linkTo = target;
		        target.linkHead = source.linkHead || source;
		        target.linkFrom = source;
		        target.setLeft(e.pageX - tab.element.offsetLeft - paper.element.offsetLeft);
		        target.setTop(e.pageY - tab.element.offsetTop - paper.element.offsetTop);
		        paper.add(target);
		        target.resizeControl.enable = true;
		        target.resizeControl.activeScaler = target.resizeControl.bottomRight;

		        target.resizeControl.dragged = true;
		        target.resizeControl.lastX = e.pageX;
		        target.resizeControl.lastY = e.pageY;
		        target.resizeControl.lastWidth = target.element.offsetWidth;
		        target.resizeControl.lastHeight = target.element.offsetHeight;
		        target.resizeControl.lastTop = target.element.offsetTop;
		        target.resizeControl.lastLeft = target.element.offsetLeft;
		        var clear = function(e) {
		            target.resizeControl.deactivate();
		            //me.controls.permanentFlag = false;
		            //me.controls.clearObject();
		            document.removeEventListener('mouseup', clear);
		        };
		        document.addEventListener('mouseup', clear);
		    } else if(!source.linkHead || source.linkHead != target.linkHead) {
	            if (source.linkTo) {
	        		source.linkTo.linkHead = null;
	        	}
	        	if (target.linkFrom) {
	        		target.linkFrom.linkTo = null;
	        	}
		    	source.linkTo = target;
		    	target.linkHead = source.linkHead || source;
		    	target.linkFrom = source;
		    	//this.controls.permanentFlag = false;
	            //this.controls.clearObject();
		    	tab.paper.remove(target);
		    	tab.paper.add(target);
		    	tab.paper.refresh();
		    }  else{
		    	//this.controls.permanentFlag = false;
	            //this.controls.clearObject();
		    }

		    var clickEvent = document.createEvent('Events'),
	        	obj = this.controls.object;
	        clickEvent.initEvent('controldeactivate',true,false);
	        clickEvent.controlName = this.controlName;
	        clickEvent.control = this;
	        this.element.dispatchEvent(clickEvent);
	        this.controls.unfocusObject();
	        // this.controls.focusObject(target);
		}
     //    this.activateFlag = false;
     //    this.mouseOut();
	},
	mouseOver: function(e) {
		if (!this.activateFlag) {
	        this.element.style.backgroundColor = "#555";
	        this.icon.style.backgroundColor = "#FFF";
			this.element.style.boxShadow = 'rgba(0, 0, 0, 0.796875) 0px 0px 1px inset';
	        // EDITOR.cancelBubble(e);
	    }
	},
	mouseOut: function(e) {
		if (!this.activateFlag) {
	        this.element.style.backgroundColor = "transparent";
	        this.icon.style.backgroundColor = "#555";
			this.element.style.boxShadow = 'none';
	        // EDITOR.cancelBubble(e);
	    }
	},
	activate: function() {
		this.controls.focusObject(this.controls.object);
        this.activateFlag = true;
        this.element.style.background = '#EC6352';
	},
	deactivate: function() {
		this.controls.unfocusObject();
		this.activateFlag = false;
        this.mouseOut();
	}
};

EDITOR.object.block.control.LinkFrom = function(controls){
	this.controls = controls;
	this.element = document.createElement('div');
	this.element.style.position = 'absolute';
	this.element.style.top = '4px';
	this.element.style.left = '10px';
	this.element.style.width = '20px';
	this.element.style.height = '7px';
	this.element.style.backgroundColor = 'red';

	this.element.addEventListener('mouseover', EDITOR.bind(this, function(e) {
		this.loadSubcontrols();
	}));
	this.element.addEventListener('mouseout', EDITOR.bind(this, function(e) {
		if (!EDITOR.isDescendant(this.element, e.toElement)) {
			this.clearSubcontrols();
		}
	}));
};
EDITOR.object.block.control.LinkFrom.prototype = {
	controlName: 'linkfrom',
	subcontrols: {},
	execute: function(e, workspace) {
		console.log('launch LinkFrom!');
	},
	loadSubcontrols: function() {
		if (!this.loadFlag) {
			var unlink = new EDITOR.object.block.control.UnlinkFrom(this.controls);
			this.subcontrols[EDITOR.object.block.control.UnlinkFrom.controlName] = unlink;
			this.element.appendChild(unlink.element); 
			this.loadFlag = true;
		}
	},
	clearSubcontrols: function() {
		if (this.loadFlag) {
			var unlink = this.subcontrols[EDITOR.object.block.control.UnlinkFrom.controlName];
			this.subcontrols[EDITOR.object.block.control.UnlinkFrom.controlName] = null;
			this.element.removeChild(unlink.element); 
			this.loadFlag = false;
		}
	}
};

EDITOR.object.block.control.LinkTo = function(controls){
	this.controls = controls;
	this.element = document.createElement('div');
	this.element.style.position = 'absolute';
	this.element.style.bottom = '5px';
	this.element.style.left = '10px';
	this.element.style.width = '20px';
	this.element.style.height = '6px';
	this.element.style.backgroundColor = 'red';

	this.element.addEventListener('mouseover', EDITOR.bind(this, function(e) {
		this.loadSubcontrols();
	}));
	this.element.addEventListener('mouseout', EDITOR.bind(this, function(e) {
		if (!EDITOR.isDescendant(this.element, e.toElement)) {
			this.clearSubcontrols();
		}
	}));
};
EDITOR.object.block.control.LinkTo.prototype = {
	controlName: 'linkto',
	subcontrols: {},
	execute: function(e, workspace) {
		console.log('launch LinkTo!');
	},
	loadSubcontrols: function() {
		if (!this.loadFlag) {
			var unlink = new EDITOR.object.block.control.UnlinkTo(this.controls);
			this.subcontrols[EDITOR.object.block.control.UnlinkTo.controlName] = unlink;
			this.element.appendChild(unlink.element); 
			this.loadFlag = true;
		}
	},
	clearSubcontrols: function() {
		if (this.loadFlag) {
			var unlink = this.subcontrols[EDITOR.object.block.control.UnlinkTo.controlName];
			this.subcontrols[EDITOR.object.block.control.UnlinkTo.controlName] = null;
			this.element.removeChild(unlink.element); 
			this.loadFlag = false;
		}
	}
};
EDITOR.object.block.control.UnlinkTo = function(controls){
	this.controls = controls;
	this.element = document.createElement('div');
	this.element.style.width = '50px';
	this.element.style.height = '20px';
	this.element.style.backgroundColor = '#555';
	// this.element.style.border = '1px solid #555';
	this.element.style.boxShadow = 'rgba(0, 0, 0, 0.796875) 0px 0px 1px inset';
	this.element.style.top = '6px';
	// this.element.style.left = '2px';
	this.element.style.position = 'absolute';
	this.element.style.textAlign = 'center';
	this.element.style.lineHeight = '20px';		
	this.element.style.color = '#FFF';
	this.element.style.cursor = 'pointer';
	this.element.innerText = 'Unlink';

	// this.element.addEventListener('mouseover', EDITOR.bind(this, function(e) {
	// 	this.element.style.backgroundColor = '#EEE';
	// 	this.element.style.color = '#555';
	// }));
	// this.element.addEventListener('mouseout', EDITOR.bind(this, function(e) {
	// 	this.element.style.backgroundColor = '#555';
	// 	this.element.style.color = '#FFF';
	// }));
	this.element.addEventListener('mousedown', EDITOR.bind(this, function(e) {
        var clickEvent = document.createEvent('Events'),
        	obj = this.controls.object;
        clickEvent.initEvent('controlclick',true,false);
        clickEvent.controlName = this.controlName;
        clickEvent.control = this;
        clickEvent.controls = this.controls;
        this.element.dispatchEvent(clickEvent);
        EDITOR.cancelBubble(e);
	}));
};
EDITOR.object.block.control.UnlinkTo.prototype = {
	controlName: 'unlinkto',
	execute: function(e, workspace) {
		if (e.controls.object && e.controls.object.linkTo) {
			e.controls.object.linkTo.linkHead = null;
			e.controls.object.linkTo.linkFrom = null;
			e.controls.object.linkTo = null;
			e.controls.setObject(e.controls.object);
		}
	}
};
EDITOR.object.block.control.UnlinkFrom = function(controls){
	this.controls = controls;
	this.element = document.createElement('div');
	this.element.style.width = '50px';
	this.element.style.height = '20px';
	this.element.style.backgroundColor = '#555';
	// this.element.style.border = '1px solid #555';
	this.element.style.boxShadow = 'rgba(0, 0, 0, 0.796875) 0px 0px 1px inset';
	this.element.style.top = '6px';
	// this.element.style.left = '2px';
	this.element.style.position = 'absolute';
	this.element.style.textAlign = 'center';
	this.element.style.lineHeight = '20px';		
	this.element.style.color = '#FFF';
	this.element.style.cursor = 'pointer';
	this.element.innerText = 'Unlink';

	// this.element.addEventListener('mouseover', EDITOR.bind(this, function(e) {
	// 	this.element.style.backgroundColor = '#EEE';
	// 	this.element.style.color = '#555';
	// }));
	// this.element.addEventListener('mouseout', EDITOR.bind(this, function(e) {
	// 	this.element.style.backgroundColor = '#555';
	// 	this.element.style.color = '#FFF';
	// }));
	this.element.addEventListener('mousedown', EDITOR.bind(this, function(e) {
        var clickEvent = document.createEvent('Events'),
        	obj = this.controls.object;
        clickEvent.initEvent('controlclick',true,false);
        clickEvent.controlName = this.controlName;
        clickEvent.control = this;
        clickEvent.controls = this.controls;
        this.element.dispatchEvent(clickEvent);
        EDITOR.cancelBubble(e);
	}));
};
EDITOR.object.block.control.UnlinkFrom.prototype = {
	controlName: 'unlinkfrom',
	execute: function(e, workspace) {
		if (e.controls.object && e.controls.object.linkFrom) {
			e.controls.object.linkHead = null;
			e.controls.object.linkFrom.linkTo = null;
			e.controls.object.linkFrom = null;
			e.controls.setObject(e.controls.object);
		}
	}
};
