
/* Game namespace */
var game = {

    // an object where to store game information
    data : {
        // score
        score : 0,
        noOfLives : 10,
        noOfShots : 0
    },


    // Run on page load.
    "onload" : function () {
        //console.log("****game.js*** fn: onload***");
        // Initialize the video.
        if (!me.video.init(640, 480, {wrapper : "screen", scale : "auto", scaleMethod : "flex-width"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // add "#debug" to the URL to enable the debug Panel
        if (me.game.HASH.debug === true) {
            window.onReady(function () {
                me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
            });
        }

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        // set and load all resources.
        // (this will also automatically switch to the loading screen)
        me.loader.preload(game.resources, this.loaded.bind(this));

        //Initiate melonjs and display a loading screen
        me.state.change(me.state.LOADING);
    },

    // Run on game resources loaded.
    "loaded" : function () {
        //console.log("***game.js*** fn: loaded***")

        //Set the title screen object
        me.state.set(me.state.MENU, new game.TitleScreen());

        //Set the play sceen object
        me.state.set(me.state.PLAY, new game.PlayScreen());

        //Set a global fading transition for the screens
        me.state.transition("fade", "#FFFFFF", 250);

        // add our player entity in the entity pool
        me.pool.register("mainPlayer", game.PlayerEntity);
        me.pool.register("CoinEntity",  game.CoinEntity); // add coin entity to entity pool
        me.pool.register("EnemyEntity", game.EnemyEntity);// add enemy entity to entity pool

        // enable the keyboard
        me.input.bindKey(me.input.KEY.LEFT,  "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.SPACE,  "jump", true);

        // Start the game.
        me.state.change(me.state.MENU);
    }
};



