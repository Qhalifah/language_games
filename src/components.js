

Crafty.c('CardLabelBorder', {
	    CardLabelBorder: function(imgX, imgY, imgWidth, imgHeight, initX, initY) {
	    	this.requires('2D, DOM, span');
	    	this.locateMe(imgWidth, initX, initY);
	    },
	    locateMe: function(imgWidth, initX, initY){
	    	this.x = initX;
	    	this.y = initY;
	    	
	    	this.h = LABEL_HEIGHT;
	    	this.w = LABEL_WIDTH;
	    },
   }
);


Crafty.c('CardLabel', {
    CardLabel: function(imgX, imgY, newText, imgWidth, imgHeight, initX, initY, cardId) {
    	if(newText.length < 10){
    		this.requires('2D, DOM, HTML, img-desc');
    	}
    	else{
    		this.requires('2D, DOM, HTML, img-desc-long');
    	}
    	this.saveInitialParameters(imgX, imgY, imgWidth, imgHeight, initX, initY);
    	this.locateMe(imgWidth);
    	this.addTextLabel(newText);
    	this.cardId = cardId;
    	this.labelText = newText;
    	
    },
    
    
    saveInitialParameters: function(imgX, imgY, imgWidth, imgHeight, initX, initY){
    	this._imgStartX = imgX;
    	this._imgStartY = imgY;
    	this._imgEndX= imgX + imgWidth;
    	this._imgEndY = imgY +imgHeight + LABEL_HEIGHT;
    	this._imgHeight = imgHeight;
    	this._initX = initX;
    	this._initY = initY;
    	
    },
    
    locateMe: function(imgWidth){
    	this.x = this._initX;
    	this.y = this._initY;
    	
    	this.h = LABEL_HEIGHT;
    	this.w = imgWidth;
    },
    
    addTextLabel: function(newText){
    	//this.attach(Crafty.e('CardLabelText').attr({ x: this.x, y: this.y}).text(newText));
    	this.append(newText);		
    },
    //the x-coordinate of the left side of the picture
    _imgStartX:0,
    //the y-coordinate of the upper side of the picture
    _imgStartY:0,
    //the x-coordinate of the right side of the picture
    _imgEndX:0,
    //the x-coordinate of the lower side of the picture
	_imgEndY:0,
	//the height of the picture
	_imgHeight:0,
	//my initial x
	_initX:0,
	//my initial y
	_initY:0,
});

Crafty.c('DraggableCardLabel', {
	
	
	

    init: function() {
        this.requires('CardLabel, Mouse, Draggable, draggable-word');

		
        this.enableDrag();       
        this.bind('StopDrag', function(){
        	var foundCoords = this.isRightPicture()
        	if(foundCoords!=null){
        		this.disableDrag();
        		this.placeOnPicture(foundCoords);
        		Crafty.audio.stop();
        		var curAudio = Crafty.audio.play(this.cardId+'_audio');
        		Crafty.trigger('LabelFound');
        		var onAudioEnd = function(event){       
        			Crafty.trigger('AudioEnded');
        			event.target.onended = null;
				}
				curAudio.onended = onAudioEnd;
        		
        	}
        	else{
        		this.placeInitialLocation();	
        	}
        });
       
       
        
    },
    
    isRightPicture: function(){
    	var thisNameCoords = CARD_COORDS[this.labelText];
    	for(var i in thisNameCoords){
    		var curCoords = thisNameCoords[i];
    		if(this.isInCoords(curCoords)){
    			delete CARD_COORDS[this.labelText][i];
    			return curCoords;
    		}
    	}
    	return null;
    },
    
    isInCoords: function(curCoords){
    	myStartX = this.x;
    	myStartY = this.y;
    	myEndX = this.x + this.w;
    	myEndY = this.y + this.h;
    	
    	myMiddleX = this.x + this.w*0.5;
    	myMiddleY = this.y + this.h*0.5;
    	
    
    	var startX = parseInt(curCoords[0]);
    	var startY = parseInt(curCoords[1]);
    	var endX = parseInt(curCoords[2]);
    	var endY = parseInt(curCoords[3]);
    	
    	return (myMiddleX >= startX && myMiddleX <= endX)
   				&&
    			(myMiddleY >= startY && myMiddleY <=endY)
    	
    },
    
    placeOnPicture: function(foundCoords){
    	/*this.x = this._imgStartX;
    	this.y = this._imgStartY + this._imgHeight;*/
    	this.x = foundCoords[0];
    	this.y = foundCoords[3];
    	
    },
    
    placeInitialLocation: function(){
    	this.x = this._initX;
    	this.y = this._initY;
    },
    
    setCardId: function(cardId){
    }
    
    
});



Crafty.c('CardLabelText', {
    init: function() {
        this.requires('2D, DOM, Text');
        this.textColor('#FF0000');
        this.textFont({family:'Cambria', size: '40px'});
        this.css({
            "display":"inline-block"
        });        
        this.attr({h: LABEL_HEIGHT, w: LABEL_WIDTH});
    }
});



Crafty.c('Card', {
    init: function() {
    	this.requires('Mouse');
    },
    
    getName: function(){
    	return this._entityName;
    }

});





Crafty.c('CardAudio', {
    init: function() {
    	this.requires('Card');
    	this.showLabelBorder();
        this.bind('Click', function(e){
            this.playAudio();
        });
    },
    
    showLabelBorder: function(){
    	Crafty.e('CardLabelBorder')
	                .CardLabelBorder(this.x, this.y, this.w, this.h,
	                this.x + (CARD_WIDTH-LABEL_WIDTH)/2, this.y + this.h);
    },

    

    playAudio:function(){
        Crafty.audio.stop();
        var curAudio = Crafty.audio.play(this._entityName+'_audio');
        var onAudioEnd = function(event){
        	Crafty.trigger('AudioEnded');
        	event.target.onended = null;
		}
		curAudio.onended = onAudioEnd;
    },
    
    z:-1

});



Crafty.c('CardAudioLabel', {
	
	
    init: function() {
    	this.requires('CardAudio');
        this.bind('Click', function(e){
            this.showLabel();
            Crafty.trigger('CardAudioLabelClicked', this);
        })
    },
    
    
	
   

    showLabel:function(){

    	
        try{
            if(!this.isLabelShown){
                Crafty.e('CardLabel')
	                .CardLabel(this.x, this.y, curGameTopic[this._entityName]['label'], this.w - BORDER_WIDTH, this.h,
	                this.x, this.y + this.h, this._entityName);
                this.isLabelShown = true
            }

        }
        catch(e){
        }

    },
    
    isLabelShown:false

});

Crafty.c('CardClickBySound', {
	init: function() {
		this.requires('Card');
		this.lastClickTime = null;
		this.isGamePaused = false;

        this.bind('Click', function(e){
        	if(this.isGamePaused){
        		return;
        	}
        	var currentClickTime = new Date().getTime();
        	if(this.lastClickTime != null && (currentClickTime - this.lastClickTime) < 300){
        		return;
        	}
        	this.lastClickTime = currentClickTime;
        	Crafty.trigger('CardClicked', this);
        });
        
        
        this.bind('CardClickBySoundGameOver', function(e){
        	this.unbind('Click');
        	this.bind('Click', function(e){
        		this.playAudio();
        	});
        });
        
        this.bind('CardClickBySoundPaused', function(e){
        	this.isGamePaused = true;
        });
        
         this.bind('CardClickBySoundResumed', function(e){
        	this.isGamePaused = false;
        });
  },
  
  
  playAudio:function(){
        Crafty.audio.stop();
        var curAudio = Crafty.audio.play(this._entityName+'_audio');
        var onAudioEnd = function(event){
        	Crafty.trigger('AudioEnded');
        	event.target.onended = null;
		}
		curAudio.onended = onAudioEnd;
    },
  
  
  
    
    
});


Crafty.sprite(100, 'assets/card_back.jpg', {FlippedCard: [0, 0]});


Crafty.c('CardMemory', {
    init: function() {
        this.requires('Card');
        this.setMemoryProps();
        this.otherCard = null;
    },
    
    setMemoryProps: function(){
    	
    	this.flippedCardEn = Crafty.e('2D, DOM, FlippedCard')
			.attr({x: this._x, y: this._y, w: this._w, h: this._h, z: this._z+1})
		;
        this.bind('Click', function(e){
            Crafty.trigger('CardClicked', this);
        });
        
        
        this.bind('AudioEnded', function(e){
            if(this.otherCard!=null){
            	this.hide();
  				this.otherCard.hide();
  				this.otherCard = null;
            }
        });
        
        
        this.bind('MemoryGameOver', function(e){
        	this.unbind('Click');
        	this.bind('Click', function(e){
        		this.playAudio();
        	});
        });
    },
    
    reveal: function() {
    	this.flippedCardEn.visible = false;
  	},
  	hide: function() {
    	this.flippedCardEn.visible = true;
  	},
  	showForever: function(){
  		this.flippedCardEn.visible = false;
  		this.unbind('Click');
  		this.hide = function(){}
  	},
  	hideAfterSoundEnds: function(card2){
  		this.otherCard = card2;
  	},
  	
  	
  	playAudio:function(){
        Crafty.audio.stop();
        var curAudio = Crafty.audio.play(this._entityName+'_audio');
        var onAudioEnd = function(event){
        	Crafty.trigger('AudioEnded');
        	event.target.onended = null;
		}
		curAudio.onended = onAudioEnd;
    },
});


Crafty.c('CardMemoryLabel', {
	init: function() {
        this.requires('Card,HTML');
        this.setMemoryProps();
        this.otherCard = null;
    },
    
    setMemoryProps: function(){

    	this.flippedCardEn = Crafty.e('2D, DOM, FlippedCard')
			.attr({x: this._x, y: this._y, w: this._w, h: this._h, z: this._z+1})
		;
        this.bind('Click', function(e){
            Crafty.trigger('CardClicked', this);
        });
        
        this.bind('AudioEnded', function(e){
            if(this.otherCard!=null){
            	this.hide();
  				this.otherCard.hide();
  				this.otherCard = null;
            }
        });
        
        this.bind('MemoryGameOver', function(e){
        	this.unbind('Click');
        	this.bind('Click', function(e){
        		this.playAudio();
        	});
        });
        
        
    },
 
  
  
	  setMemoryLabel: function(curMemoryLabel){
	  	this.curLabel = curGameTopic[curMemoryLabel]['label'];
	  	this._entityName = curMemoryLabel;
	  },
  
	  reveal: function() {
	    this.flippedCardEn.visible = false;
	    this.replace(this.curLabel);
	  },
	  
  	hide: function() {
    	this.flippedCardEn.visible = true;
    	this.replace('');
  	},
  	
  	showForever: function(){
  		this.flippedCardEn.visible = false;
  		this.replace(this.curLabel);
  		this.unbind('Click');
  		this.hide = function(){}
  	},
  	hideAfterSoundEnds: function(card2){
  		this.otherCard = card2;
  	},
  	
  	
  	playAudio:function(){
        Crafty.audio.stop();
        var curAudio = Crafty.audio.play(this._entityName+'_audio');
        var onAudioEnd = function(event){
        	Crafty.trigger('AudioEnded');
        	event.target.onended = null;
		}
		curAudio.onended = onAudioEnd;
    },
  	
    
    
});


//===================================CONTROLS
Crafty.c("Button", {
    init: function(){
        this.requires('2D, HTML, Mouse, Hoverable, Text');
        this.attr({h: BUTTON_HEIGHT, w: BUTTON_WIDTH});
        
        this.textFont({family:'Cambria', size: '30px'});
    },
    setText: function(buttonLabel){
    	this.append(buttonLabel);
    },

});






Crafty.c("StartGameButton", {
    init: function(){
        this.requires('2D, HTML, Mouse, Hoverable');
        //this.attr({h: START_BUTTON_HEIGHT, w: START_BUTTON_WIDTH});
      
    },
    setText: function(buttonLabel){
    	this.append(buttonLabel);
    },
});


Crafty.c("level", {
    init: function(){
        this.requires('2D, HTML, Mouse, Hoverable');
        //this.attr({h: START_BUTTON_HEIGHT, w: START_BUTTON_WIDTH});
      
    },
    setLevel: function(level){
    	this.level = level;
    	this.updateText();
    },
    updateText: function(){
    	var levelDesc = this.getLevelDesc();
    	var htmlToAppend = this.createButtonHtml();
    	htmlToAppend += this.createLevelDesc(levelDesc);
    	htmlToAppend += this.createShuffleHTML();
    	this.append(htmlToAppend);
    },
    
    createButtonHtml: function(){
    	return "<a class='button'>Уровень " + (this.level  + 1) + "</a>";
    },
    
    createLevelDesc: function(levelDesc){
    	return "<div class='desc'>" + levelDesc + "</div>";
    },
    
    
    createShuffleHTML: function(){
    	return "<a class='other-words'>сыграть еще раз</a>";
    },
    
    getLevelDesc: function(){
    	var levelWordNum = CUR_LEVEL_DESCRIPTIONS[this.level].toString();
    	var descWordPart = this.conjugateWord(levelWordNum);    	
    	return levelWordNum + " " + descWordPart;
    },
    
    conjugateWord: function(levelWordNum){
    	var levelWordNumLast = levelWordNum.slice(-1);
    	if(levelWordNum.length > 1){
    		var levelWordNumBeforeLast = levelWordNum.slice(-2, -1);
    	}
    	else{
    		var levelWordNumBeforeLast = 0;
    	}
    	if(levelWordNumLast == "1" && levelWordNumBeforeLast != "1"){
    		return "слово";
    	}
    	if((levelWordNumLast == "2" || levelWordNumLast == "3" || levelWordNumLast == "4") 
    				 && levelWordNumBeforeLast != "1"){
    		return "слова";
    	}
    	return "слов";
    }
});


Crafty.c("disabledLevel", {
    init: function(){
        this.requires('2D, HTML, Mouse, Hoverable, level');
      
    },
    
    setDisabledLevel: function(level){
    	this.level = level;
    	this.updateDisabledText();
    },
    
    updateDisabledText: function(){
    	var levelDesc = this.getLevelDesc();
    	var htmlToAppend = this.createButtonHtml();
    	htmlToAppend += this.createLevelDesc(levelDesc);
    	htmlToAppend += this.createDisabledShuffleHTML();
    	this.append(htmlToAppend);
    },
    
    
    createDisabledShuffleHTML: function(){
    	return "<a class='other-words disabledOtherWords'>сыграть еще раз</a>";
    },
    
});


Crafty.c("breadcrumbs", {
    init: function(){
        this.requires('2D, HTML, Mouse, Hoverable');
        //this.attr({h: START_BUTTON_HEIGHT, w: START_BUTTON_WIDTH});
      
    },
    setContent: function(languageDetailArray, lastLanguageItem, speakerInfo){
    	for(var i=0; i<languageDetailArray.length; ++i){
    		this.append("<a>" + languageDetailArray[i] + "</a>");
    	}
    	this.append("<span class='languageDetail'>" + lastLanguageItem + "</span>");
    	
    	var speakerInfoBox = this.constructSpeakerInfoBox(speakerInfo);
    	this.append(speakerInfoBox);
    },
    constructSpeakerInfoBox: function(speakerInfo){
    	var getSpeakerTitle = this.getSpeakerInfoTitle(speakerInfo);
    	var speakerList = this.constructSpeakerList(speakerInfo);
    	var speakerInfoBox = "<span class='speakerInfo'>" + 
    							getSpeakerTitle +
    							": " +
    							speakerList +
    							"</span>";
    	return speakerInfoBox;
    },
    
    getSpeakerInfoTitle: function(speakerInfo){
    	if(speakerInfo.length > 1){
    		return "Дикторы"
    	}
    	return "Диктор"
    },
    constructSpeakerList: function(speakerInfo){
    	var speakerList = "<span class='speakerList'>";
    	speakerList += speakerInfo.join(", ")
    	speakerList += "</span>"
    	return speakerList;
    }
});


Crafty.c("paramets", {
    init: function(){
        this.requires('2D, HTML, Mouse, Hoverable');
    },
    setTypeTopic: function(parametersDict){
    	for(var parameterName in parametersDict){
    		this.append("<span>" + parameterName + ": </span><a>" + parametersDict[parameterName] + "</a>");
    	}
    },
});






//=====================================LANGUAGE CHOOSERS

Crafty.c("LanguageCommon", {
    init: function(){
    	this.requires('2D, HTML');
    },
});


/*Crafty.c("game-lang-old", {
    init: function(){
    	this.requires('LanguageCommon');
        this.attr({h: BUTTON_HEIGHT, w: BUTTON_WIDTH});
        this.dialects = Array();
    },
    setProperties: function(dialectDescription){
    	this.nodeName = dialectDescription.nodeName;
    	this.setDialectName(dialectDescription.nodeName);
    	childrenLabels = dialectDescription.children;
    	if(dialectDescription.isLanguage){
    		this.curLanguage = this.nodeName;
    		this.curDescendantNumber = 1;
    		this.higherDialects = ''; 
    	}
    	
    	if(childrenLabels && childrenLabels.length > 0){
    		this.createChildren(childrenLabels);
    	}
    	
    },
    setDialectName: function(dialectName){
    	if(this.isSub){
    		this.append(dialectName);
    	}
    	else{
    		this.append("<h2>" + dialectName + "</h2>");
    	}
    },
    createChildren: function(childrenLabels){
    	if(this.higherDialects==''){
    		var newPrevious = this.nodeName;
 		}
    	else{
    		var newPrevious = this.higherDialects + INNER_DELIMITER +this.nodeName;
    	}

    	for(var i=0; i < childrenLabels.length; ++i){
    		
    
    		
    		
    		if(childrenLabels[i].isLeaf){
    			this.append("<ul>");
    			
    			this.dialects[i] = Crafty.e('MinorDialect');
    			//this.attach(this.dialects[i]);
    			this.append("</ul>");
    		}
    		else{
    			this.append("<ul>");
    		
    			this.dialects[i] = Crafty.e('game-lang-sub');
    			//this.attach(this.dialects[i]);
    			this.append("</ul>");
    		}

    		this.dialects[i].setPrevious(newPrevious);

    		this.dialects[i].setLanguage(this.curLanguage);
    		this.dialects[i].curDescendantNumber = this.curDescendantNumber + 1;
    		this.dialects[i].setProperties(childrenLabels[i]);
    		this.curDescendantNumber = this.dialects[i].curDescendantNumber;
    		
    	}
    	

    },

    makeInactiveNotChosen: function(curLabel){
    	for(var i=0; i < this.minorDialects.length; ++i){
    		this.minorDialects[i].makeInactiveNotChosen(curLabel);
    	}
    },
    
    
    toggleDialects: function(isVisible){
    	this.visible = isVisible;
    	for(var i=0; i < this.minorDialects.length; ++i){
    		this.minorDialects[i].visible = isVisible;
    	}
    },
    
    
    
    setDisabled: function(){
    	this.requires('LanguageDialectDisabled');
    },
    
    setLanguage: function(languageName){
    	this.curLanguage = languageName;
    },
    
    setPrevious: function(higherDialects){
    	this.higherDialects = higherDialects;
    }
});

*/
Crafty.c("game-lang", {
    init: function(){
    	this.requires('2D, HTML');
    },
    setProperties: function(dialectDescription){
    	var languageInnerStructure = Crafty.e('game-lang-inner');
    	languageInnerStructure.setProperties(dialectDescription);
    	this.append(languageInnerStructure.gameLangText);    	
    },
    setFirst: function(isFirst){
    	if(isFirst){
    		this.addComponent('first');
    	}
    }
});




Crafty.c("game-lang-inner", {
    init: function(){
    	this.requires('HTML');
    	
        this.dialects = Array();
        this.gameLangText = "";
    },
    setProperties: function(dialectDescription){
    	this.nodeName = dialectDescription.nodeName;
    	this.setDialectName(dialectDescription.nodeName);
    	childrenLabels = dialectDescription.children;
    	if(dialectDescription.isLanguage){
    		this.curLanguage = this.nodeName;
    		this.curDescendantNumber = 1;
    		this.higherDialects = ''; 
    	}
    	
    	if(childrenLabels && childrenLabels.length > 0){
    		this.createChildren(childrenLabels);
    	}
    	
    },
    setDialectName: function(dialectName){
    	if(this.isSub){
    		this.gameLangText += dialectName;
    	}
    	else{
    		this.gameLangText += ("<h2>" + dialectName + "</h2>");
    	}
    },
    createChildren: function(childrenLabels){
    	if(this.higherDialects==''){
    		var newPrevious = this.nodeName;
 		}
    	else{
    		var newPrevious = this.higherDialects + INNER_DELIMITER +this.nodeName;
    	}
    	
    	this.gameLangText +=  "<ul>";

    	for(var i=0; i < childrenLabels.length; ++i){
    		if(childrenLabels[i].isLeaf){
    			this.dialects[i] = Crafty.e('MinorDialect');
    		}
    		else{									
    			this.dialects[i] = Crafty.e('game-lang-sub');
    			
    		}

    		this.dialects[i].setPrevious(newPrevious);

    		this.dialects[i].setLanguage(this.curLanguage);
    		this.dialects[i].curDescendantNumber = this.curDescendantNumber + 1;
    		this.dialects[i].setProperties(childrenLabels[i]);
    		this.curDescendantNumber = this.dialects[i].curDescendantNumber;
    		var startTag = "";
    		if(childrenLabels[i].isLeaf){
    			startTag = "<li class='MinorDialect'>"
    		}
    		else{
    			startTag = "<li class='MajorDialect'>"
    		}
    		this.gameLangText += (startTag + this.dialects[i].gameLangText + "</li>"); 
    	}
    	this.gameLangText +=  "</ul>";
    },
    
    setLanguage: function(languageName){
    	this.curLanguage = languageName;
    },
    
    setPrevious: function(higherDialects){
    	this.higherDialects = higherDialects;
    }
});


Crafty.c("game-lang-sub", {
    init: function(){
    	this.requires('game-lang-inner');
    	this.isSub = true;
    },
    
});


Crafty.c('MinorDialect', {
    init: function(){
        this.requires('HTML, Mouse');
        this.isSub = true;
    },
    
 	setProperties: function(dialectDescription){
    	this.nodeName = dialectDescription.nodeName;
    	this.dialectCode = dialectDescription.dialectCode;
    	this.setEnabled(dialectDescription.enabled);
    },
    
    setEnabled: function(isEnabled){
    	if(isEnabled){
    		this.createEnabled();	
    	}
    	else{
    		this.gameLangText =  this.nodeName;
    	}
    },
    
    
    createEnabled: function(){  
		this.gameLangText = 
       			("<a onclick = \"Crafty.trigger('MinorDialectChosen', '" + 
       			// this.nodeName + "', '" +
       			this.higherDialects + INNER_DELIMITER + this.dialectCode + "')\">" + 
       				this.nodeName +
       			"</a>");
    },
    
    
    setLanguage: function(languageName){
    	this.curLanguage = languageName;
    },
    
    setPrevious: function(higherDialects){
    	this.higherDialects = higherDialects;
    }
});




//===================================TEXT ELEMENTS
Crafty.c("Description", {
	
	init: function(){
		this.requires('2D, DOM, HTML');
	}
}	
)

Crafty.c("GameDescription", {
	
	init: function(){
		this.requires('2D, DOM, HTML');
	}
}	
)


Crafty.c("Message", {
	
	init: function(){
		this.requires('2D, DOM, HTML');
	}
}	
)


Crafty.c("Credits", {
    init: function(){
		this.requires('2D, DOM, HTML');
	}
})

Crafty.c("ButtonDisabled", {
    init: function(){
    	this.requires('2D, DOM, HTML, Button');
        this.attr({h: BUTTON_HEIGHT, w: BUTTON_WIDTH});
    },
    setText: function(label){
    	this.append(label);
    }
});



Crafty.c("info", {
	init: function(){
		this.requires('2D, DOM, HTML, view-header');
		//this.attr({x: 0, h: ANNOTATION_HEIGHT, w: ANNOTATION_WIDTH});
	},
	setId: function(elementId){
		this.attr({id : elementId});
	},
    setText: function(label){
    	this.append(label);
    }
});


Crafty.c("infoDownloading", {
	init: function(){
		this.requires('2D, DOM, HTML');
	},
	setId: function(elementId){
		this.attr({id : elementId});
	},
    setText: function(label){
    	this.append(label);
    }
});


Crafty.c("infoGameDesc", {
	init: function(){
		this.requires('2D, DOM, HTML, infoGameDesc');
		//this.attr({x: 0, h: ANNOTATION_HEIGHT, w: ANNOTATION_WIDTH});
	},
	setId: function(elementId){
		this.attr({id : elementId});
	},
    setText: function(label){
    	this.append(label);
    }
});




Crafty.c("game-form", {
	init: function(){
		this.requires('2D, DOM, HTML');		
	},
	
	setPosition: function(elemX, elemY){
		this.attr({x: elemX, y: elemY});
	},
	
	setId: function(elementId){
		this.attr({id : elementId});
	},
	
    setOptions: function(selectorClass, labelText, titleArray, titleKeyToChoose){
    	var htmlToAppend = this.formHtmlToAppend(selectorClass, labelText, titleArray, titleKeyToChoose);
		this.append(htmlToAppend);
    },
    
    formHtmlToAppend: function(selectorClass, labelText, titleArray, titleKeyToChoose){
    	var labelHtml = this.createLabel(labelText);
    	var htmlToAppend = labelHtml + "<select id='" + this.id + "' class='form-select'>";
    	for(var titleKey in titleArray){
    		var curTitleArrayPart = titleArray[titleKey];
    		var optionIsSelected = "";
    		if (titleKey == titleKeyToChoose){
    			optionIsSelected = " selected ";
    		}
    		var optionEntry = "<option" + optionIsSelected +" value='" +  titleKey + "'>"+curTitleArrayPart['title'];			
			htmlToAppend += optionEntry;   
    	}
    	
    		    

		htmlToAppend += "</select>";
		return htmlToAppend;
    },
    
    createLabel: function(labelText){
    	return "<label>" + labelText + "</label>";
    }
});

