EDITOR.paper.control = EDITOR.paper.control || {};
EDITOR.paper.control.LoadTemplate = function() {
	this.element = document.createElement('div');
	this.element.style.width = '180px';
	this.element.style.height = '25px';
	this.element.style.backgroundColor = '#555';
	this.element.style.color = '#EEE';
	this.element.style.marginLeft = 'auto';
	this.element.style.marginRight = 'auto';
	this.element.style.lineHeight = '25px';
	this.element.style.textAlign = 'center';
	this.element.style.marginTop = '5px';
	this.element.style.cursor = 'pointer';
	this.element.innerText = 'Load Template';

	this.element.addEventListener('mouseover', EDITOR.bind(this, function(e){
		if (!this.isLoaded) {
			this.element.style.backgroundColor = '#EC6352';
		}
	}));
	this.element.addEventListener('mouseout', EDITOR.bind(this, function(e){
		if (!this.isLoaded) {
			this.element.style.backgroundColor = '#555';
		}
	}));
	this.element.addEventListener('click', EDITOR.bind(this, function(e){
        var clickEvent = document.createEvent('Events');
        clickEvent.initEvent('controlclick',true,false);
        clickEvent.controlName = this.controlName;
        clickEvent.control = this;
        this.element.dispatchEvent(clickEvent);
		EDITOR.cancelBubble(e);
	}));
}
EDITOR.paper.control.LoadTemplate.prototype = {
	controlName: 'loadtemplate',
	isLoaded: false,
	execute: function(e, workspace) {
		console.log(this);
		if (!this.isLoaded) {
			workspace.activeTab.paper.temporaryTemplate();
			workspace.activeTab.paper.refresh();
			this.element.innerText = "Remove Template";
			this.element.style.backgroundColor = "#EC6352";
			this.isLoaded = true;
		} else {
			workspace.activeTab.paper.removeTemplate();
			workspace.activeTab.paper.refresh();
			this.element.innerText = "Load Template";
			this.element.style.backgroundColor = "#555";
			this.isLoaded = false;
		}
	}
}