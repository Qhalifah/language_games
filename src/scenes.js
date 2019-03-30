//================SOME CONSTANTS AND PROPERTIES

var cardNum = 0;


var numOfCols = Math.floor(Game.width()/(CARD_WIDTH));
var numOfMemoryCols = Math.floor((Game.width())/(CARD_WIDTH));
var numOfRows = 0;

var cardFieldHeight = 0;
var memoryCardFieldHeight = 0;
var canvasCentre = Game.width()/2;

//the dialect chosen

var curDialect;

var curDialectLabelChosen;
var curLanguageChosen;


var curLevelChosen = 0;

//the game type chosen
var curGameType;
var curGameTopic;
var curGameTopicCode;



var curSceneTitle = null;
var prevSceneTitle = null;


var isJustRestarted = true;


var alreadyLoaded = [];
var alreadyLoadedPictures = [];

var prevSceneStack = Array();


var LEVEL_NUMBER = 3;

var CUR_LEVEL_DESCRIPTIONS = null;





var MAX_LEVEL_WIDTH = 0;


var PAUSE_START_GAME = 500;
var PAUSE_SAME_SOUND = 200;
var PAUSE_NEW_SOUND = 1500;
var PAUSE_ERROR = 70;
var PAUSE_SUCCESS = 70;
var PAUSE_POPUP = 70;
var PAUSE_POPUP_LABEL = 3580;

var WRONG_SOUND_KEY  = 'wrongSound'
var SUCCESS_SOUND_KEY  = 'successSound'
var GAMEFINAL_SOUND_KEY  = 'gameFinal'

var WRONG_SOUND_VALUE = ['assets/technical/error.wav', 'assets/technical/error.mp3', 'assets/technical/error.ogg']
var SUCCESS_SOUND_VALUE = ['assets/technical/success.wav', 'assets/technical/success.mp3', 'assets/technical/success.ogg']
var GAMEFINAL_SOUND_VALUE = ['assets/technical/applause.wav', 'assets/technical/applause.mp3', 'assets/technical/applause.ogg']



var isWrongSoundLoaded = false;
var isSuccessSoundLoaded = false;
var isFinalSoundLoaded = false;


var CARD_COORDS = new Array();

//======displaying various elements

function displayCardsRandomly(cardClass, numOfCardsToDisplay, isToMakeOffset, colSpecificNum, additionalOffset){	
	CARD_COORDS = new Array();
	var curNumOfCols = numOfCols;
	if(colSpecificNum > 0){
		curNumOfCols = colSpecificNum;
	}
	var shuffledArray = createShuffledCardArray(); 	
	var cardFieldWidth = curNumOfCols * (CARD_WIDTH + PADDING_H) + OFFSET;
	
	if(cardClass=='CardAudio'){ 
		var arrToShuffle = generateArray(numOfCardsToDisplay);
		var shuffledLabelArray = shuffleArray(arrToShuffle); 
	}
    for(var curCardNum=1;curCardNum <= numOfCardsToDisplay; ++curCardNum){  
   		var rowIndex = Math.ceil(curCardNum/curNumOfCols)-1;
   		var divResidue = (curCardNum % curNumOfCols);

   		if(divResidue ==0){
   			var colIndex = curNumOfCols - 1;	
   		}
   		else{
   			var colIndex = divResidue - 1;	
   		}
   		
   		var curCardName = 'spr_card'+(shuffledArray[curCardNum-1]);
   		var curCard = createCardByIndex(curCardName, colIndex, rowIndex, false, isToMakeOffset, additionalOffset);
        curCard.addComponent(cardClass); 
        /**if the goal is to match the label with the card
        show the label separately and place it randomly*/
       
       var maxLevelWidth = (LEVEL_BUTTON_WIDTH + LEFT_OFFSET_ALL_ELEMENTS) * LEVEL_NUMBER;
       
        if(cardClass=='CardAudio'){
        	var labelX =  cardFieldWidth;
        	if(isToMakeOffset){
        		labelX += OFFSET_CENTER + OFFSET_PIC_WORDS;
        	}       	
        	displayLabelCard(curCard,
        		labelX, 

        		shuffledLabelArray[curCardNum-1]*(LABEL_HEIGHT + PADDING_V_AUDIO) + 
        										TOP_OFFSET + PADDING_V + CARD_AUDIO_LABEL_OFFSET)
        }
   }
  	
   
   
   return shuffledArray.slice(0, numOfCardsToDisplay);
   	
}


function displayMemoryCardsRandomly(numberOfCardsToDisplay, additionalOffset){
	CARD_COORDS = new Array();
	var numberOfMemoryCards = numberOfCardsToDisplay*2;
	var shuffledArray = createMemoryArray(numberOfCardsToDisplay); 
	var rowIndex= 0;
	
	
	
    for(var curCardNum=1; curCardNum<=numberOfMemoryCards; ++curCardNum){
      	    
   		rowIndex = Math.ceil(curCardNum/numOfMemoryCols)-1;
   		var divResidue = (curCardNum % numOfMemoryCols);
   		if(divResidue ==0){
   			var colIndex = numOfMemoryCols - 1;	
   		}
   		else{
   			var colIndex = divResidue - 1;	
   		}
   		
   		var curCardDefinition = shuffledArray[curCardNum-1];
   		
   		
   		
   		var curCardName = 'spr_card' + curCardDefinition['cardName'];
   		var curCardType = curCardDefinition['cardType'];

   		if(curCardType == 'card'){
   			var curCard = createCardByIndex(curCardName, colIndex, rowIndex, true, false, additionalOffset);
   			curCard.addComponent('CardMemory'); 
	    }
	    else{
	    	var curCard = createLabelCardByIndex(curCardName, colIndex, rowIndex, true, additionalOffset);
	    }
	    
   }
   memoryCardFieldHeight = (rowIndex+1)*(CARD_HEIGHT+PADDING_V);
}

function displayBackToMainMenuButton(buttonY){
	displayButton('К выбору темы', 'TopicMenu', BUTTON_PADDING_H, buttonY);  
}

function displayBackToMenuButton(buttonY){
	displayButton('В меню', 'Menu', BUTTON_WIDTH+BUTTON_PADDING_H, buttonY);  
}

function displayBackwardButton(sceneTitle){ 
	displayButton('<<Назад', sceneTitle, 0, Game.height() - 2 * BUTTON_HEIGHT); 
}

function displayForwardButton(sceneTitle, buttonY){
	displayButton('Вперед>>', sceneTitle, 3*(BUTTON_WIDTH+BUTTON_PADDING_H), buttonY);  
}

function displayStartGameButton(sceneTitle, buttonY){
	displayButton('Начать', sceneTitle, 3*(BUTTON_WIDTH+BUTTON_PADDING_H), buttonY);  
}


function displayButtonArray(titleArray, totalPadding){
	for(var i=0;i<titleArray.length;++i){
		displayButton(titleArray[i]['title'], titleArray[i]['scene'], 
									totalPadding + PADDING_H, BUTTON_PADDING_V+ (BUTTON_HEIGHT+BUTTON_PADDING_V)*i); 
	}
}

function displayButton(buttonLabel, sceneTitle, buttonX, buttonY){
	Crafty.e('Button').attr({x:buttonX, y:buttonY}).bind('Click', 
								function(e){
								
									curSceneTitle = sceneTitle;
									Crafty.scene(sceneTitle);
								}
							).setText(buttonLabel);
}

function displayGameSelectors(titleArray, labelText, selectorClass, titleKeyToChoose){
	var selector = Crafty.e('game-form');
	
	
	selector.setId(selectorClass);
	selector.setOptions(selectorClass, labelText, titleArray, titleKeyToChoose);
	
	
	
}



function displayGameLevelButtons(additionalSpace){
	
	var totalNumOfCards = getDictLength(curGameTopic);
	
	for(var i=0; i< LEVEL_NUMBER; ++i){
		if(totalNumOfCards >= getCardNumberByLevel(i)){
			displayGameLevelButton(i);
		}
		else{
			displayDisabledGameLevelButton(i);
		}
		$('.level').eq(i).css({ height: 90, width: LEVEL_BUTTON_WIDTH })
		$('.level').eq(i).offset({ top: 192 + additionalSpace, left: LEFT_OFFSET_ALL_ELEMENTS + (LEVEL_BUTTON_WIDTH + LEVEL_PADDING_H) *i })
	}
	
	MAX_LEVEL_WIDTH =  243*(LEVEL_NUMBER - 1) + 233;
	
	$('.level:not(.disabledLevel) .button').click(function(event){
								var levelNumber = parseInt(event.target.text.split("Уровень ")[1]) - 1
								curLevelChosen = levelNumber;
								restartCurGame();
								}
	);
	
	
	
	$('.other-words:not(.disabledOtherWords)').click(function(event){
								event.stopPropagation();
								var curElement = event.target;
								var curElementSibling = $(curElement).siblings('.button')[0];
								var levelNumber = parseInt(curElementSibling.text.split("Уровень ")[1]) - 1
								curLevelChosen = levelNumber;
								restartCurGame();
								}
	);
	
	
}

function displayGameLevelButton(levelNumber){
	var curLevelButton = Crafty.e('level');
	curLevelButton.setLevel(levelNumber);
	if(levelNumber == curLevelChosen){
		curLevelButton.addComponent('active');
	}
}

function displayDisabledGameLevelButton(levelNumber){
	var curLevelButton = Crafty.e('disabledLevel');
	curLevelButton.setDisabledLevel(levelNumber);
}


function processGameTopic(cardsType){
	curGameTopic = cardsType;
	cardNum = getDictLength(curGameTopic);
	calculateSizes();
	curLevelChosen = 0;
	Crafty.scene('ShowAssets');
}


function restartCurGame(){
	isJustRestarted = true;
	Crafty.scene(curGameType);
}



function displayCustomText(text, textX, textY){
	textObj = Crafty.e('Description')
        .append(text)
        .attr({ x: textX, y: textY, w:500});
}

//utils

function createShuffledCardArray(){
	var arrayToShuffle = Array();
	
	for(var i=0; i<cardNum; ++i){
		arrayToShuffle[i] = i+1;	
	}

	
	return shuffleArray(arrayToShuffle);	
}


function createMemoryArray(numberOfCardsToDisplay){
	var shuffledArray = Array();
	var j=0;
	for(var i=0; i<cardNum; ++i){
		shuffledArray[j] = Array();
		shuffledArray[j]['cardName'] = i+1;	
		shuffledArray[j]['cardType']  = 'card';	
		++j;
		/*shuffledArray[j] = Array();
		shuffledArray[j]['cardName']  = i+1;	
		shuffledArray[j]['cardType']  = 'label';	
		++j;*/
		
	}
	shuffledArray.sort(function(a, b){
			return 0.5-Math.random();
		});
		
	
	shuffledArray = shuffledArray.slice(0, numberOfCardsToDisplay);
	for(var i=0; i<numberOfCardsToDisplay; ++i){
		curCardName = shuffledArray[i]['cardName']
		newLabelElement = Array();
		newLabelElement['cardName'] = curCardName;
		newLabelElement['cardType']  = 'label'
		shuffledArray.push(newLabelElement);
	}
		
	shuffledArray.sort(function(a, b){
			return 0.5-Math.random();
		});
	return shuffledArray;	
}

function createCardByIndex(curCardName, colIndex, rowIndex, isMemory, isToMakeOffset, additionalVerticalOffset){
	
	var paddingV = LABEL_HEIGHT + LABEL_OFFSET;
	var topOffset = TOP_OFFSET;
	var paddingH = OFFSET;
	if (isMemory){
		paddingV = PADDING_V_MEMORY;
		topOffset = TOP_OFFSET_MEMORY;
		
	}
	if (isToMakeOffset){
		paddingH = OFFSET_CENTER;
	}
	
	
	var curX = colIndex*(CARD_WIDTH + PADDING_H) + paddingH;
	var curY = rowIndex*(CARD_HEIGHT + paddingV) + topOffset + paddingV + additionalVerticalOffset;
	
	var endX = curX + CARD_WIDTH;
	var endY = curY + CARD_HEIGHT;
	
	var curCardLabel = curGameTopic[curCardName]['label'];
	
	if(!(curCardLabel in CARD_COORDS)){
		CARD_COORDS[curCardLabel] = new Array();
	}
	
	CARD_COORDS[curCardLabel].push([curX ,curY , endX , endY]);
	
	return Crafty.e(curCardName+', 2D, DOM, Mouse')
                .setName(curCardName)
                .attr({x: curX, 
                	y:curY,
                	w:CARD_WIDTH, 
                	h: CARD_HEIGHT});
}


function createLabelCardByIndex(curCardName, colIndex, rowIndex, isMemory, additionalOffset){
	var paddingV = PADDING_V;
	var topOffset = TOP_OFFSET;
	if(isMemory){
		paddingV = PADDING_V_MEMORY;
		topOffset  = TOP_OFFSET_MEMORY;
	}
	var labelCard =  Crafty.e('2D,DOM');
	labelCard.attr({x: colIndex*(CARD_WIDTH + PADDING_H) + OFFSET, 
                	y: rowIndex*(CARD_HEIGHT + paddingV) + topOffset + paddingV + additionalOffset,
                	w:CARD_WIDTH, 
                	h: CARD_HEIGHT});
	labelCard.addComponent('CardMemoryLabel'); 
    labelCard.setMemoryLabel(curCardName);
    return labelCard;
}

function displayLabelCard(curCard, labelX, labelY){
	var curLabel = curGameTopic[curCard.getName()]['label'];
    
    Crafty.e('DraggableCardLabel')
                .CardLabel(curCard.x, curCard.y, curLabel, CARD_WIDTH - BORDER_WIDTH, CARD_HEIGHT,
	             labelX, labelY, curCard.getName())	;
	
}
function initScene(additionalSpace){
	PopUpHide();
	PopUpDownloadHide();
	
	if(Crafty.audio){
		Crafty.audio.stop();
	}
	if(curDialectLabelChosen!=null){
		displayCurrentDialectDetails();
	}
	if(curGameTopic!=null && curGameType!=null){
		displayTypeTopicDetails();
		displayCurGameDescription(additionalSpace);
		
	}
	
	if(curDialectLabelChosen!=null && curGameTopic!=null && curGameType!=null){
		displayGameLevelButtons(additionalSpace);
	}
	prevSceneTitle = prevSceneStack[prevSceneStack.length - 1];
	if(prevSceneTitle!=curSceneTitle){
		prevSceneStack.push(curSceneTitle);
	}
}





function displayGameTopics(){
	displayGameSelectors(GAME_TOPICS, CHOOSE_GAME_TOPIC_LABEL, 'game-subject', curGameTopicCode);
}

function displayGameTypes(){
    displayGameSelectors(GAME_TYPES, CHOOSE_GAME_TYPE_LABEL, 'game-type', curGameType);
}

function displayChooseGameButton(){
					
					
	var craftyButton = Crafty.e('StartGameButton');	
	craftyButton.setText('Начать игру');
	$(".StartGameButton").click(function(e){
									curGameType = document.getElementById("game-type").value;
									curGameTopicCode = document.getElementById("game-subject").value;
									curGameTopic = curDialect[curGameTopicCode];
									processGameTopic(curGameTopic);
									
								});	
							
	
	$('.StartGameButton').offset({ top: MAX_MENU_HEIGHT + FILTER_OFFSET  ,
									left: MAX_MENU_WIDTH - 115
							})
		
}




//==========SCENES



Crafty.scene('MainMenu', function() {
	curSceneTitle = 'MainMenu';
	initScene(0);
	Crafty.e('info')
	        .append(CHOOSE_TOPIC_TYPE_DESCRIPTION);	
	//TODO: change to relative again!
	//$('.info').css('position', 'relative');    
	
	$(".info").css({height: MAX_MENU_HEIGHT, width : MAX_MENU_WIDTH});
	$(".info").offset({top: 45, left : LEFT_OFFSET_ALL_ELEMENTS});
	        
	
	displayGameTypes();
	displayGameTopics(); 
	
	
	//TODO: change to relative again!
	//$('.game-form').css('position', 'relative');  
	
	
	$('.game-form').eq(0).css({ height: 24, width: GAME_SELECTOR_WIDTH })
	$('.game-form').eq(0).offset({ top: MAX_MENU_HEIGHT + FILTER_OFFSET, left: LEFT_OFFSET_ALL_ELEMENTS})
	
	
	$('.game-form').eq(1).css({ height: 24, width: GAME_SELECTOR_WIDTH })
	$('.game-form').eq(1).offset({ top: MAX_MENU_HEIGHT + FILTER_OFFSET, 
							left: LEFT_OFFSET_ALL_ELEMENTS + GAME_SELECTOR_WIDTH + 15})
	
	
	
	
	
	
	displayChooseGameButton();	
});


/**
 * ShowCardsDescription
 */

Crafty.scene('ShowCardsDescription', function() {	
	curGameType = 'ShowCardsDescription';
	if(curGameTopic == null){
		Crafty.scene('TopicMenu');
	}
	else{
		Crafty.scene('ShowCards');
	}
});


/**
 *shows the cards and adds their labels on click 
 */

Crafty.scene('ShowCards', function() {
	this.unbind('AudioEnded'); 
	this.unbind('CardClicked');
	this.unbind('CardAudioLabelClicked'); 
    initScene(0);    
        
    var cardNumberByLevel = getRealCardNumberByLevel();    
    var cardIdsDisplayedArray = displayCardsRandomly('CardAudioLabel', cardNumberByLevel, false, 0, 0);  
    cardIsDisplayedMarked = Array();
    for(var i=0; i<cardNumberByLevel;++i){
    	cardIsDisplayedMarked['spr_card' + cardIdsDisplayedArray[i]] = false;
    }
    var cardsNotShown = cardNumberByLevel;
    
    this.bind('CardAudioLabelClicked', function(curCard){
    	var cardName = curCard._entityName; 
    	if(!cardIsDisplayedMarked[cardName]){
    		cardIsDisplayedMarked[cardName] = true;
    		--cardsNotShown;
    		if(cardsNotShown <= 0){
    			this.unbind('CardAudioLabelClicked'); 
    		}
    	}
    });	   
    
    
    this.bind('AudioEnded', function(){
    	if(cardsNotShown <= 0){
    		this.unbind('AudioEnded'); 
    		showGameFinalSuccess(PAUSE_POPUP);
    	}
    });
});

/**
 * AddLabelDescription
 */

Crafty.scene('AddLabelDescription', function() {
   
   curGameType = 'AddLabelDescription';
	if(curGameTopic == null){
		Crafty.scene('TopicMenu');
	}
	else{
		Crafty.scene('AddLabel');
	}
});


/**
 *the player should match a label with a card 
 */


Crafty.scene('AddLabel', function() {   
	this.unbind('AudioEnded');  
	this.unbind('CardClicked');  
	this.unbind('LabelFound');
	var additionalSpace = 25;
    initScene(additionalSpace);  
    
    
    
    
    //cards 
    
    var totalCardNum = getRealCardNumberByLevel();
    var isToMakeOffset = false; 
    var specificNum = 0;
    if(curLevelChosen == 0){
    	isToMakeOffset = true;
    	specificNum = 2;
    }
    else{
    	specificNum = 3;
    }
    
    displayCardsRandomly('CardAudio', totalCardNum, isToMakeOffset, specificNum, additionalSpace);
    
      
    
    //game logic
    this.labelsNotFound = totalCardNum;
    
    this.bind('LabelFound', function(){
    	--this.labelsNotFound;
    	if(this.labelsNotFound<=0){
    		this.unbind('LabelFound');
    	}	
    });	
    
    
    this.bind('AudioEnded', function(){
    	if(this.labelsNotFound<=0){
    		this.unbind('AudioEnded'); 
    		showGameFinalSuccess(PAUSE_POPUP);
    	}
    });
    
    
    
});

/**
 * ClickCardDescription
 */

Crafty.scene('ClickCardDescription', function() {   
   curGameType = 'ClickCardDescription';
	if(curGameTopic == null){
		Crafty.scene('TopicMenu');
	}
	else{
		Crafty.scene('ClickCard');
	}
});



/**
 *the player should match the word being pronounced with a card 
 */



Crafty.scene('ClickCard', function() {
	this.unbind('AudioEnded'); 
	this.unbind('CardClicked');  
	
	var additionalOffset = 25;
	
	initScene(additionalOffset);
	
	Crafty.audio.stop();

	var totalCardNumber = getRealCardNumberByLevel();
	
	var displayedCardArray = displayCardsRandomly('CardClickBySound', totalCardNumber, false, 0, additionalOffset);
	
	
    var displayedCardArrayShuffled = shuffleArray(displayedCardArray);
    
    
    //play the first word
    
    var i=0;
    this.curCardName = 'spr_card' + displayedCardArrayShuffled[i];
    curAudio = this.curCardName+'_audio'
    pausecomp(curAudio, PAUSE_START_GAME, true);
    
   
    this.bind('CardClicked', function(curCard){
    	var cardName = curCard._entityName; 
    	var curLabelText = curGameTopic[cardName]['label'];
    	var curCardText = curGameTopic[this.curCardName]['label'];
 		Crafty.audio.stop();
    	
    	if(curLabelText == curCardText){
    		
    		pausecomp(SUCCESS_SOUND_KEY, PAUSE_SUCCESS, false);
    		
    		displayLabelCard(curCard, curCard.x, curCard.y+CARD_HEIGHT);
    		    		++i;
    		if(i == totalCardNumber){
    			this.unbind('CardClicked');
    			
    		}
    		else{
    			Crafty.trigger('CardClickBySoundPaused', this);
				this.curCardName = 'spr_card' + displayedCardArrayShuffled[i];
    			pausecomp(this.curCardName+'_audio', PAUSE_NEW_SOUND, true, 'CardClickBySoundResumed');
    			
    			
    		}
    	}
    	else{

    		pausecomp(WRONG_SOUND_KEY, PAUSE_ERROR, false);
    		Crafty.audio.stop();
    		pausecomp(this.curCardName+'_audio', PAUSE_ERROR + PAUSE_SAME_SOUND, true);
    	}
    });
    
    
    this.bind('AudioEnded', function(curCard){
    	if(i == totalCardNumber){
    		this.unbind('AudioEnded');
    		showGameFinalSuccess(PAUSE_POPUP);
    		Crafty.trigger('CardClickBySoundGameOver', this);
    	}
    });
});


/**
 * ClickCardDescription
 */

Crafty.scene('MemoryDescription', function() {
	curGameType = 'MemoryDescription';
	if(curGameTopic == null){
		Crafty.scene('TopicMenu');
	}
	else{
		Crafty.scene('Memory');
	}
});


/**
 *the Memory game 
 */


Crafty.scene('Memory', function() {
	this.unbind('AudioEnded');  
	this.unbind('CardClicked');  
	
	var additionalOffset = 25;
	
	initScene(additionalOffset);
	
	var cardNumberByLevel = getRealCardNumberByLevel();
	
	
    displayMemoryCardsRandomly(cardNumberByLevel, additionalOffset + 10);    
    this.cardsLeft = cardNumberByLevel;
    this.card1 = null;
    this.card2 = null;
    this.bind('CardClicked', function(curCard){
    	
    	//two cards are already shown
    	//close them
    	
    	if(this.card2){
    		this.card1.hide();
			this.card2.hide();
			
			this.card1 = null;
			this.card2 = null;
    	}
    	Crafty.audio.stop();
    	var curAudio = Crafty.audio.play(curCard._entityName+'_audio');
    	
    	
    	var onAudioEnd = function(event){       
        			Crafty.trigger('AudioEnded');
        			event.target.onended = null;
				}
		curAudio.onended = onAudioEnd;
    	
		

    	
    	//no cards shown
    	if(!this.card1){
    		this.card1  = curCard;
    		this.card1.reveal();
    	}
    	//one card is shown and its name is the same as the new card's name
    	else if(this.card1._entityName == curCard._entityName){
    		
	    	if(this.card1!=curCard){
	    		Crafty.audio.stop();
	    		pausecomp(SUCCESS_SOUND_KEY, PAUSE_SUCCESS);
	    		//it's not the same card
		    	this.card1.showForever();
		    	curCard.showForever();
		    	this.card1 = null;
		    	--this.cardsLeft;
		    	if(this.cardsLeft<=0){
    				this.unbind('CardClicked');
    				
		    	}
	    	}
		}
		//one card is shown, but it's different
		else{
			this.card2 = curCard;
			this.card1.reveal();
			this.card2.reveal();
			this.card1.hideAfterSoundEnds(this.card2);
		}
    });
    
    
    this.bind('AudioEnded', function(){
    	if(this.cardsLeft<=0){
    		this.unbind('AudioEnded');
    		showGameFinalSuccess(PAUSE_POPUP);
    		Crafty.trigger('MemoryGameOver', this);
    	}
    });
});


Crafty.scene('ShowAssets', function(){
	var audioArr={};
	
	for (var key in curGameTopic){
		var curCard={};
		curCard[key]=[0, 0, 1, 1];
		Crafty.sprite(CARD_WIDTH, CARD_HEIGHT,'assets/'+curGameTopic[key]['pict'], curCard, 0, 0);
		var curCardAudio=Array();

		for(var i=0;i<curGameTopic[key]['audio'].length;++i){
			curCardAudio[i]='assets/'+curGameTopic[key]['audio'][i];
		}
		audioArr[key+'_audio'] = curCardAudio;
		
    }
    
    audioArr[WRONG_SOUND_KEY] = WRONG_SOUND_VALUE;
    audioArr[SUCCESS_SOUND_KEY] = SUCCESS_SOUND_VALUE;
    audioArr[GAMEFINAL_SOUND_KEY] = GAMEFINAL_SOUND_VALUE;
  
    Crafty.audio.add(audioArr);
	if(curGameType==null){
		Crafty.scene('GameTypeMenu');
	}
    else{
    	Crafty.scene(curGameType);
    }
 }
);



/*Crafty.scene('ChooseGameType', function(){
	initScene();
    displayButtonArray(GAME_TYPES);
    displayBackToMainMenuButton(GAME_TYPES.length*(BUTTON_HEIGHT+BUTTON_PADDING_V)+BUTTON_PADDING_V);
   
 }
);*/





Crafty.scene('Loading', function(){
    	Crafty.e('Message')
        .append('Пожалуйста, подождите...')
        .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() });
		

		curDialect = ALL_LABELS[curDialectLabelChosen];
		
		
			
		if(!isAlreadyLoaded(curDialect)){
			var toLoadArr=Array();
			var i =0;
			
			
			for(var cardType in curDialect){
				
				
				
				var curDict = curDialect[cardType];
				for (var key in curDict){
					
				   if (!isAlreadyLoadedPicture(curDict[key]['pict'])){
				   	toLoadArr[i]='assets/'+curDict[key]['pict'];
				   	markAlreadyLoadedPicture(curDict[key]['pict'])
				   	++i;
				   }
				   
				   
				                
				   for(var j=0;j<curDict[key]['audio'].length;++j){
				       toLoadArr[i]='assets/'+curDict[key]['audio'][j];
				        ++i;
				   }
				 }
			}
		
		if(!isWrongSoundLoaded){
			
			isWrongSoundLoaded = true;
			for(var i = 0; i < WRONG_SOUND_VALUE.length; ++i){
				toLoadArr[toLoadArr.length] = WRONG_SOUND_VALUE[i];
			}
		}	
		
		if(!isSuccessSoundLoaded){
			
			isSuccessSoundLoaded = true;
			for(var i = 0; i < SUCCESS_SOUND_VALUE.length; ++i){
				toLoadArr[toLoadArr.length] = SUCCESS_SOUND_VALUE[i];
			}
		}
		
		if(!isFinalSoundLoaded){
			
			isFinalSoundLoaded = true;
			for(var i = 0; i < GAMEFINAL_SOUND_VALUE.length; ++i){
				toLoadArr[toLoadArr.length] = GAMEFINAL_SOUND_VALUE[i];
			}
		}		
		
		
	
	    markAlreadyLoaded(curDialect);
           
        Crafty.load(toLoadArr, function(){
        	
        		Crafty.scene('MainMenu');
    		}
	     
	    	);
	   }
	   else{
	   		Crafty.scene('MainMenu');
	   }
	}
);


Crafty.scene('ChooseLanguage', function(){
	curDialectLabelChosen = null;
	initScene(0);
	this.unbind('MinorDialectChosen');		
	
	curDialectLabelChosen = null;
	
	var info = Crafty.e('info');

	info.setId("chooseLanguageInfo");
	info.setText(CHOOSE_LANGUAGE_DESCRIPTION);
	info.attr({'w':MAX_LANG_MENU_WIDTH, 'h': 195});
	
	
	var evLang = Crafty.e('game-lang');
	evLang.setFirst(true);
	var selkLang = Crafty.e('game-lang');
	var ketLang = Crafty.e('game-lang');
	$('.game-lang').css('position', 'relative');
	$('.info').css('position', 'relative');        
										
	evLang.setProperties(EVENKI_HIERARCHY);
	selkLang.setProperties(SELKUP_HIERARCHY); 
	ketLang.setProperties(KET_HIERARCHY); 
														
										
	this.bind('MinorDialectChosen', function(dialectCodes){
		var dialectCodesSplit = dialectCodes.split(INNER_DELIMITER);
		curLanguageChosen = dialectCodesSplit[0] + INNER_DELIMITER + dialectCodesSplit[1];
		curDialectLabelChosen = dialectCodesSplit[2];
		Crafty.scene('Loading');
    });	
    
    
    var downloadInfo = Crafty.e('infoDownloading');
    

	downloadInfo.setId("downloadInfo");
	downloadInfo.setText(DOWNLOAD_DESCRIPTION);
	var DOWNLOAD_LINK_Y = 270;
	var browserName = guessBrowser();
	if(browserName.indexOf("IE")!=-1){
		DOWNLOAD_LINK_Y = 500;
	}
	downloadInfo.attr({'w':MAX_MENU_WIDTH + DOWNLOAD_OFFSET, 'h': 125, 'y': DOWNLOAD_LINK_Y});
	
	 
	 $("#downloadButton").bind("click", function(){
        		PopUpDownloadShow();
        	});        
	
}
);

function guessBrowser(){
    var ua= navigator.userAgent, tem, 
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\bOPR\/(\d+)/)
        if(tem!= null) return 'Opera '+tem[1];
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
}

///BUTTONS

function displayCurrentDialectDetails(){	
	var craftyButton = Crafty.e('breadcrumbs');
	var languageDetailArray = curLanguageChosen.split(INNER_DELIMITER);
	var lastLanguageItem = MINOR_DIALECTS_RUS[curDialectLabelChosen]['title'];	
	var speakerInfo = MINOR_DIALECTS_RUS[curDialectLabelChosen]['speakers'];
	craftyButton.setContent(languageDetailArray, lastLanguageItem, speakerInfo);
	$(".breadcrumbs").click(function(e){
									curGameType = null;
									curGameTopicCode = null;
									curGameTopic = null;
									Crafty.scene('ChooseLanguage');
									
								});	
								
		
	 //TODO: change to relative!
   //$(".breadcrumbs").css('position', 'relative');	
								
	//TODO: remove this
	
	
	$(".breadcrumbs").css({height: 20, width:MAX_WIDTH_ELEMENTS + 10});
	//$(".breadcrumbs").offset({top: 20, left:LEFT_OFFSET_ALL_ELEMENTS});
	$(".breadcrumbs").offset({top: 5, left:LEFT_OFFSET_ALL_ELEMENTS});
	
	
	

}


function displayTypeTopicDetails(){
	var craftyButton = Crafty.e('paramets');
	craftyButton.setTypeTopic({'Тип': GAME_TYPES[curGameType]['title'], 'Тема': GAME_TOPICS[curGameTopicCode]['title']});
	$(".paramets").click(function(e){
									Crafty.scene('MainMenu');
									
								});	
	//TODO: change to relative again!
	//$(".paramets").css('position', 'relative');

	
	
	$(".paramets").css({height: 20, width : MAX_WIDTH_PARAMS});
	$(".paramets").offset({top: 55, left : LEFT_OFFSET_ALL_ELEMENTS});
	
	

}

function displayCurGameDescription(additionalSpace){
	var craftyInfo = Crafty.e('infoGameDesc');
	craftyInfo.append(GAME_TYPES[curGameType]['description']);
	//TODO: change to relative again!
	
	//$('.info').css('position', 'relative');   
	
	
	//$(".infoGameDesc").css({height: 75, width : MAX_DESC_WIDTH});
	$(".infoGameDesc").css({height: MAX_DESC_HEIGHT + additionalSpace, width : MAX_DESC_WIDTH});
	$(".infoGameDesc").offset({top: 80, left : LEFT_OFFSET_ALL_ELEMENTS});

	

}


function isAlreadyLoaded(dialectName){
	for(var i=0; i < alreadyLoaded.length; ++i){
		if(alreadyLoaded[i]==dialectName){
			return true;
		}
	}
	return false;
}

function isAlreadyLoadedPicture(picture){
	for(var i=0; i < alreadyLoadedPictures.length; ++i){
		if(alreadyLoadedPictures[i]==picture){
			return true;
		}
	}
	return false;
}

function markAlreadyLoaded(dialectName){
	alreadyLoaded.push(dialectName);
	
}

function markAlreadyLoadedPicture(picture){
	alreadyLoadedPictures.push(picture);
	
}

///SIZES
function calculateSizes(){
	numOfRows = Math.ceil(cardNum/numOfCols);
	cardFieldHeight = numOfRows*(CARD_HEIGHT+LABEL_HEIGHT)+PADDING_V;
}

///LEVELS
function getRealCardNumberByLevel(){
	return Math.min(getCardNumberByLevel(curLevelChosen), getDictLength(curGameTopic));
}

function getCardNumberByLevel(levelNum){
	CUR_LEVEL_DESCRIPTIONS = LEVELS_CARDNUMS[curGameType];
	if(CUR_LEVEL_DESCRIPTIONS == null){
		CUR_LEVEL_DESCRIPTIONS = DEFAULT_LEVELS_CARDNUMS;
	}
	
	
	return CUR_LEVEL_DESCRIPTIONS[levelNum];
}


/////UTILS
function getDictLength(dictToMeasure){
	var dictLen = 0;
	for(var obj in dictToMeasure){
		++dictLen;
	}
	return dictLen;
}

function shuffleArray(arrayToShuffle){
	arrayToShuffle.sort(function(a, b){
			return 0.5-Math.random();
		});
	return arrayToShuffle;
}

function generateArray(arrayLength){
	var arrToFillIn = new Array(arrayLength);
	for(var i=0; i<arrayLength; ++i){
		arrToFillIn[i] = i;
	}
	return arrToFillIn;
}


function pausecomp(craftyAudio, pauseDuration, isToMarkEnd, eventName) {
    setTimeout(
    	function() { 
    		
    		var curAudio = Crafty.audio.play(craftyAudio);
    		if(eventName != null){
        		Crafty.trigger(eventName);
        	}
    		if(isToMarkEnd){
    			var onAudioEnd = function(event){       
        			Crafty.trigger('AudioEnded');
        			
        			
        			event.target.onended = null;
				}
				curAudio.onended = onAudioEnd;
    		} 
    		}, 
    	pauseDuration);
    	
    	
   

} 

function showGameFinalSuccess(pausePopup){
	setTimeout(
			    	function() { 
			    		Crafty.audio.stop();
			    		Crafty.audio.play(GAMEFINAL_SOUND_KEY);
			    		PopUpShow();
			    		}, 
			    	pausePopup);
}


function PopUpShow(){
		$("#popup").css('z-index', 9999);
        $("#popup").show();
    }
function PopUpHide(){
        $("#popup").hide();
    }
    
    
function PopUpDownloadShow(){
		$("#popupDownload").css('z-index', 9999);
        $("#popupDownload").show();
    }
function PopUpDownloadHide(){
        $("#popupDownload").hide();
    }
    






