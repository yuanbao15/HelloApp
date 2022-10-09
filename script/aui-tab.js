/**
 * aui-tab.js
 * @author 流浪男
 * @todo more things to abstract, e.g. Loading css etc.
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
(function( window, undefined ) {
    "use strict";
    var auiTab = function(params,callback) {
      var __params = {
          element: false,
          index: 1, //默认选中
          repeatClick: false //是否允许重复点击
      }
      params.callback = callback;
      this.params = this.extend(__params, params);
      this._init(callback);
    };
    //var tabItems;
    auiTab.prototype = {
        tabItems:null,
        _init: function(callback) {
        	var self = this;
        	if(!self.params.element || self.params.element.nodeType!=1){
        		return;
        	}
        	this.tabItems = self.params.element.children;
        	if(this.tabItems){
        		self.setActive();
        		for(var i=0; i<this.tabItems.length; i++){
        			this.tabItems[i].setAttribute("tapmode","");
        			this.tabItems[i].setAttribute("data-item-order",i);
        			this.tabItems[i].onclick = function(e){
                        if(!self.params.repeatClick){
                            if(this.className.indexOf("aui-active") > -1)return;
                        }
        				if(callback){
                            callback({
                                index: parseInt(this.getAttribute("data-item-order"))+1,
                                dom:this
                            })
                        };
        				this.parentNode.querySelector(".aui-active").classList.remove("aui-active");
            			this.classList.add("aui-active");
        			}
        		}
        	}
        },
        setRepeat:function(value){
            var self = this;
            self.params.repeatClick = value ? value : false;
        },
        setActive: function(index){
        	var self = this;
        	index = index ? index : self.params.index;
        	var _tab = this.tabItems[index-1];
        	if(_tab.parentNode.querySelector(".aui-active")){_tab.parentNode.querySelector(".aui-active").classList.remove("aui-active")};
        	_tab.classList.add("aui-active");
          self.params.callback && self.params.callback.call(_tab,{index:index,dom:_tab})
        },
        extend: function(a, b) {
			for (var key in b) {
			  	if (b.hasOwnProperty(key)) {
			  		a[key] = b[key];
			  	}
		  	}
		  	return a;
		}
    };
	window.auiTab = auiTab;
})(window);
