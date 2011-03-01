/* LAYOUT CONTROLLER THINGY */

var LayoutController = function(popId) {

	this._popId = document.getElementById(popId);
	
	//Used to store the nodes that need to be highlighted on hover
	//Prob. doesn't need to be declared here, buuuttt I did
	this.highlight = [];

}

LayoutController.prototype.traverseAllChildren = function(node) {

	/* POSSIBLE OPTIMIZATIONS NEEDED:
  		1.) SKIP NON RELEVENT ELEMENTS (E.G. JAVASCRIPT)
  	*/
        
  	var next; 
  	
  	if (node.nodeType === 1) {
  	
  		if (node = node.firstChild) {
      		do {	
      			next = node.nextSibling;
      			this.traverseAllChildren(node);
      		
      		} while(node=next);
  		}
  	}
  	
  	else if (node.nodeType === 3) {
  	  	
  		if (/[^\x00-\x80]+/.test(node.data)) {
  			console.log("should be here");
    		this.wrapInSpan(node);
		}      	
  	}

}


LayoutController.prototype.wrapInSpan = function(textNode) {


  	var tmp = document.createElement('div');
  	
  	tmp.innerHTML = textNode.data.replace(/[^\x00-\x80]/g, '<span class="cn" onmouseover="DIC_CONTROLLER.checkChinese(this)" onmouseout="LAYOUT.hidePop()">$&</span>');
  	
  	while (tmp.firstChild) {
  	
  		textNode.parentNode.insertBefore(tmp.firstChild,textNode);
  		
  	}
  	
  	textNode.parentNode.removeChild(textNode);

}

LayoutController.prototype.showPop = function(o) {

	var lpos, tpos;

	//For the record, I think this is a bad solution
	
	this.highlight.reverse();
	this.highlight.forEach(function(node) {
	
		node.className = node.className + " CHINESE_HOVER_CLASS";
		lpos = node.offsetLeft;
		tpos = node.offsetTop + node.offsetHeight;
	
	});
	
	var text = 	"<span class='han'>" + o.han + " </span>";
	text +=		"<span class='pinyin'> " + o.pinyin + "</span>";
	text +=		"<br />";
	text +=		"<span class='translation'>" + o.translation + "</span>";
	
    this._popId.innerHTML = text;
    
    this._popId.style.left = lpos;
    this._popId.style.top = tpos;
    this._popId.style.display = "block";

}

LayoutController.prototype.hidePop = function() {

	this._popId.style.display = "none";
	this._popId.innerHTML = "";
	
	this.highlight.forEach(function(node) {
	
		var reg = new RegExp('(\\s|^)'+"CHINESE_HOVER_CLASS"+'(\\s|$)');
		node.className = node.className.replace(reg,'');
	
	});
	
	this.highlight = [];

}

LayoutController.prototype.pushToHighlight = function(node) {

	this.highlight.push(node);

}

/* DICTIONARY CONTROLLER THINGY */


var DicController = function(dictionary) {
	
	this._dic = dictionary._table;
	this._pop = document.getElementById("pop");

}

DicController.prototype.contains = function(value) {

	if (this._dic.hasOwnProperty(value))
	{
		return this._dic[value];
	}
	
}

DicController.prototype.checkChinese = function(node) {

	var han = tmp = tmp2 = pin = "";
	
	while (node && node.className === "cn")
	{
		tmp += node.firstChild.data;
	
		if (tmp2 = this.contains(tmp)) {
			LAYOUT.pushToHighlight(node);
			han += node.firstChild.data;
			pin = tmp2;
			node = node.nextSibling;
		}
		else {
			break;
		}
	
	}
	
	if (pin) {
		LAYOUT.showPop(this.normalize(han, pin));
	}

}

DicController.prototype.normalize = function(han, def) {

	var ret = {};
	var combined = def.split("|");
	
	ret.han = han;
	ret.pinyin = combined[0];
	ret.translation = combined[1];
	
	return ret;

}