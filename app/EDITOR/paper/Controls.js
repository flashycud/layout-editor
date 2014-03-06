EDITOR.paper = EDITOR.paper || {};
EDITOR.paper.Controls = function(paper) {
	this.paper = paper;
	var element = this.element = document.createElement('div'),
		holder = this.holderElement = document.createElement('div'),
		tag = this.tagElement = document.createElement('div');
		label = this.labelElement = document.createElement('div');
	element.appendChild(holder);
	holder.appendChild(tag);
	tag.appendChild(label);
	element.style.width = '230px';
	element.style.height = '250px';
	element.style.overflow = 'hidden';
	element.style.left = '-230px';
	element.style.position = 'absolute';
	holder.addClassName('papar-controls');
	holder.style.webkitTransition = 'width 0.3s ease-in-out';
	holder.style.mozTransition = 'width 0.3s ease-in-out';
	holder.style.oTransition = 'width 0.3s ease-in-out';
	holder.style.transition = 'width 0.3s ease-in-out';
	holder.style.backgroundColor = '#EEE';
	holder.style.width = '0';
	holder.style.height = '230px';
	holder.style.top = '10px';
	holder.style.right = 0;
	tag.style.border = '1px solid rgba(0,0,0,0.1)';
	tag.style.boxShadow = 'inset -2px 0 0 rgba(0,0,0,0.1), inset 0 -1px 0 rgba(0,0,0,0.1)'
	tag.style.backgroundColor = '#BBB'
	tag.style.top = 0;
	tag.style.left = '-32px';
	tag.style.height= '100px';
	tag.style.width= '30px';
	tag.style.position = 'absolute';
	tag.style.cursor = 'pointer';
	label.style.webkitTransform = 'rotate(-90deg)';
	label.style.mozTransform = 'rotate(-90deg)';
	label.style.oTransform = 'rotate(-90deg)';
	label.style.whiteSpace = 'nowrap';
	label.style.position = 'absolute';
	label.style.display = 'block';
	label.style.bottom = '10px';
	label.style.width = '30px';
	label.style.height = '30px';
	label.style.lineHeight = '30px';
	label.style.color = '#EEE';
	label.innerText = 'Page Setup'
	// holder.style.overflow = 'hidden';
	holder.style.position = 'absolute';
	holder.style.boxShadow = 'rgba(0, 0, 0, 0.496094) 0px 0px 7px, rgba(0, 0, 0, 0.1) -1px 0px 0px inset';
	this.paper.element.appendChild(element);
	this.controls = {};

	this.add(new EDITOR.paper.control.LoadTemplate);

	tag.addEventListener('mouseover', EDITOR.bind(this, function(e){
		if (this.collapseTimeout) {
			clearTimeout(this.collapseTimeout);
		}
		tag.style.border = '1px solid rgba(0,0,0,0.4)';
		tag.style.backgroundColor = '#777';
		tag.style.color = '#FFF';
		this.expandTimeout = setTimeout(function(){
			holder.style.width = '190px';
		},100);
	}));
	tag.addEventListener('mouseout', EDITOR.bind(this, function(e){
		tag.style.border = '1px solid rgba(0,0,0,0.1)';
		if (this.expandTimeout) {
			clearTimeout(this.expandTimeout);
		}
	}));
	holder.addEventListener('mouseover', EDITOR.bind(this, function(e){
		if (this.collapseTimeout) {
			clearTimeout(this.collapseTimeout);
		}
	}));
	holder.addEventListener('mouseout', EDITOR.bind(this, function(e){
		if (!EDITOR.isDescendant(element,e.toElement)) {
			if (this.collapseTimeout) {
				clearTimeout(this.collapseTimeout);
			}
			if (this.expandTimeout) {
				clearTimeout(this.expandTimeout);
			}
			tag.style.backgroundColor = '#BBB';
			tag.style.color = '#EEE';
			this.collapseTimeout = setTimeout(function(){
				holder.style.width = 0;	
			}, 1000);
		}
	}));
}
EDITOR.paper.Controls.prototype = {
	add: function(control) {
		this.controls[control.controlName] = control;
		this.holderElement.appendChild(control.element);
	}
}