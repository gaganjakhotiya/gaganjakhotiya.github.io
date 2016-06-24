(function(){
	var REAL_NAME = 'Alexander Supertramp';
	var ALIAS = 'Gagan Jakhotiya';
	var HANDLE = '@gaganjakhotiya';
	var HEADING_NODE = document.getElementsByClassName("heading")[0];
	var USER_HANDLE_NODE = document.getElementsByClassName("user-handle")[0];
	var TEXT_CURSOR_NODE = HEADING_NODE.children[0];
	
	var type = (function(){
		function Type(text, cursorNode, onComplete){
			this.text = text;
			this.cursorNode = cursorNode;
			this.onComplete = onComplete;
			this.callRecursive();
		}

		Type.prototype.callRecursive = function(index, pause){
			index = index || 0;
			if(this.text.charAt(index) === ""){
				this.onComplete();
				return;
			}

			var newNode = document.createElement("span");
			var whitespace = this.text.charAt(index) === " ";
			newNode.innerHTML = whitespace ? "&nbsp;" : this.text[index];
			this.cursorNode.parentNode.insertBefore(newNode, this.cursorNode);
			
			var timeout = pause ? 200 : (80 + ((index % 10) * 7));
			setTimeout(this.callRecursive.bind(this, index + 1, whitespace), timeout);
		};

		return function(text, cursorNode, onComplete){
			var temp = new Type(text, cursorNode, function(){
				onComplete && onComplete()
				delete temp;
			});
		}
	}());

	var backspace = (function(){
		var SNCN = ' text-selected';
		var TIMEOUT = 200;

		function Backspace(counter, cursorNode, onComplete){
			this.lastNode = cursorNode.previousElementSibling;
			this.parent = cursorNode.parentNode;
			this.cursorNode = cursorNode;
			this.onComplete = onComplete;
			this.counter = counter;
			this.allNodes = [];
			this.factor = 0;
			this.process();
		}

		Backspace.prototype.setAsSelected = function(nodeList){
			for(var index = 0; index < nodeList.length; index++){
				nodeList[index].className += SNCN;
			}
		};
		
		Backspace.prototype.removeNodes = function(){
			for(var i = 0; i < this.allNodes.length; i++ ){
				this.allNodes[i].parentNode.removeChild(this.allNodes[i]);
			}
			this.onComplete();
		};

		Backspace.prototype.processBreak = function(nodes){
			this.allNodes.push.apply(this.allNodes, nodes);
			this.factor = this.factor > 2 ? this.factor : this.factor + 1;
			this.parent.insertBefore(this.cursorNode, this.lastNode.previousElementSibling ? this.lastNode.nextElementSibling : this.lastNode);
			this.setAsSelected(nodes);
		};
		
		Backspace.prototype.process = function(initIndex){
			initIndex = initIndex || 0;
			var nodes = [];
			for(var index = initIndex; index < this.counter; index++){
				if(nodes.length !== 0 && this.lastNode.innerHTML === '&nbsp;'){
					this.processBreak(nodes);
					setTimeout(this.process.bind(this, index), (TIMEOUT - (this.factor * 50)));
					break;
				}
				nodes.push(this.lastNode);
				if(!this.lastNode.previousElementSibling) break;
				this.lastNode = this.lastNode.previousElementSibling;
			}
			if(this.counter === index || !this.lastNode.previousElementSibling){
				this.processBreak(nodes);
				setTimeout(this.removeNodes.bind(this), 500);
			}
		};

		return function(counter, cursorNode, onComplete){
			var temp = new Backspace(counter, cursorNode, function(){
				onComplete && onComplete()
				delete temp;
			});
		};
	}())

	setTimeout(function() {
		type(REAL_NAME, TEXT_CURSOR_NODE,
			backspace.bind(null, REAL_NAME.length, TEXT_CURSOR_NODE,
				type.bind(null, ALIAS, TEXT_CURSOR_NODE, function(){
					USER_HANDLE_NODE.appendChild(TEXT_CURSOR_NODE);
					type(HANDLE, TEXT_CURSOR_NODE, function(){
						document.getElementsByClassName('tags')[0].className += ' fadeIn';
					})
				})))
	}, 1500);
}());