var hugeApp = (function () {
	var self = {},
	privateVariable = 1;

	var menuCreator = function  (parent,jsonData) {
		var createMenuItem = function(itemData){
			var nodeli = document.createElement("li");
			var nodeA = document.createElement("a");
			var textNode = document.createTextNode(itemData.label);
			nodeA.appendChild(textNode);						
			nodeli.appendChild(nodeA);
			if (itemData.items && itemData.items.length>0){
				nodeA.setAttribute("href","#");
				nodeli.setAttribute("class","subnav");
				var nodeUl = document.createElement("ul");
				for (var i = itemData.items.length - 1; i >= 0; i--) {
					var item = itemData.items[i];
					var li = createMenuItem(item);					
					nodeUl.appendChild(li);
					nodeli.appendChild(nodeUl);
				};
			}else{
				nodeA.setAttribute("href",itemData.url);
			}
			return nodeli;
		};
		if (jsonData.items){
			for (var i = jsonData.items.length - 1; i >= 0; i--) {
				var item = jsonData.items[i];
				var li = createMenuItem(item);
				parent.appendChild(li);				
			};
		};
	};

	function jsonProcessor(el,jsonData){
		var ul = document.getElementById(el);
		menuCreator(ul,jsonData);		
	}

	function loadJsonData(el,url) {
		var sender = new XMLHttpRequest();
		sender.onreadystatechange = function() {
		    if (sender.readyState == 4 && sender.status == 200) {
		        var myArr = JSON.parse(sender.responseText);
		        jsonProcessor(el,myArr);
		    };
		};
		sender.open('GET', url);
		sender.send();
	};

	//Initialize events on UI
	function init(elMenu) {				
		var clearSubItems =function () {
			var allElements = document.querySelectorAll("#"+elMenu+" li");
			for (var i = allElements.length - 1; i >= 0; i--) {
				if(hasClass(allElements[i],"open") && hasClass(allElements[i],"subnav")){
					console.log(allElements[i].className);
					allElements[i].className="subnav";
				}
			};
		}

		var closeMenuMobile = function () {
			document.getElementById('logoContainer').className='navLogo';
			document.getElementById(elMenu).className="primary";
			document.getElementsByTagName("body")[0].className="";
		};
		//Close all Navigations
		document.getElementsByTagName("body")[0].addEventListener('click',function (e) {
			clearSubItems();
			closeMenuMobile();
		});

		function hasClass(element, cls) {
    		return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
		};
		//Open and Close Secondary Navigation 
		document.getElementById(elMenu).addEventListener("click",function (e) {						
			e.stopPropagation();
			if(e.target && e.target.nodeName=="A" && hasClass(e.target.parentElement,'subnav')){				
				var isOpen = hasClass(e.target.parentElement,"open");
				clearSubItems();
				e.target.parentElement.className = isOpen ? "subnav": e.target.parentElement.className+" open ";
				document.getElementsByTagName("body")[0].className="open";
			}else{
				clearSubItems();
				document.getElementsByTagName("body")[0].className="";
			}				
		});
		//Open Menu Mobile
		document.getElementById('logoContainer').addEventListener("click",function(e){
			e.stopPropagation();
			e.target.className="navLogoOpen";
			document.getElementById(elMenu).className=document.getElementById(elMenu).className+" open";
			document.getElementsByTagName("body")[0].className="open";
		});
		//Close Menu Mobile
		document.getElementById('navClose').addEventListener("click",function (e) {
			e.stopPropagation();
			clearSubItems();						
			closeMenuMobile();
			document.querySelector("nav > div");
		})
	};

	self.Start = function () {
		loadJsonData('menu','/api/nav.json');
		init('menu');
	};
	return self;
}());


document.addEventListener("DOMContentLoaded", function(event) { 
	hugeApp.Start();
});