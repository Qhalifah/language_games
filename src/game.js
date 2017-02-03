Game = {   
    width: function() {
    	return MAX_WIDTH_ELEMENTS;
    },
    
    height: function() {
    	//return window.innerHeight;
    	return 1075;
    },

    start: function() {
        Crafty.init(Game.width(), Game.height());
        Crafty.scene('ChooseLanguage');
    
    }
}

