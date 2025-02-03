
Hooks.once("init", async function () {
    console.log('Pocket Sand init - Registrering Settings')
    game.PocketSand = {overlay:null}

    game.settings.register("pocket-sand", "show-overlay", {
        name: "SETTINGS.BossSplashPermission.Title",
        hint: "SETTINGS.BossSplashPermission.TitleHint",
        scope: "world",
        default: false,
        config: false,
        type: Boolean,
        onChange: value => { // value is the new value of the setting
            console.log(value)
            if (value) { 
                let overlay = new PocketSandOverlay();
                game.PocketSand.overlay = overlay
                overlay.render(true);
            } else { 
                if(game.PocketSand.overlay) game.PocketSand.overlay.close()
            }
          }
    });

    game.settings.register("pocket-sand", "img", {
        name: "SETTINGS.PocketSand.Img",
        hint: "SETTINGS.PocketSand.ImgHint",
        scope: "world",
        default: null,
        config: true,
        type: String,
        filePicker: "imagevideo",
    });


});




// Prevent reloading to remove the overlay
Hooks.on("setup",() =>{
    if(game.settings.get("pocket-sand", "show-overlay")) {
        let overlay = new PocketSandOverlay();
        game.PocketSand.overlay = overlay
        overlay.render(true);
    }
  });


Hooks.on('renderSettingsConfig', (app, el, data) => {
    
});


Hooks.on('renderHotbar', (app, html, context) => {
    if (game.user.isGM) { 

        let show = game.settings.get("pocket-sand", "show-overlay");
        let color = '';
        if (show) color = '-red';

        let hourglass = 'modules/pocket-sand/media/hourglass' + color + '.svg';

            const button = $(`<div id="hotbar-lock" class="bar-controls flexcol" data-tooltip-direction="UP">
                <ol class="pocket-sand-list flexrow">
                <li class="macro" role="button" aria-label="Pocket Sand">
                    <img id="pocket-sand-hourglass" class="macro-icon" src="${hourglass}" alt="" draggable="true">
                </li>
                </ol>
            </div>
        `);

        button.on('mouseup', (e) => { 
            //Set setting on
            if(game.settings.get("pocket-sand", "show-overlay")) {
                e.target.src = 'modules/pocket-sand/media/hourglass.svg';
                game.settings.set("pocket-sand", "show-overlay", 0) 
            } else {
                e.target.src = 'modules/pocket-sand/media/hourglass-red.svg';
                game.settings.set("pocket-sand", "show-overlay", 1) 
            }
            
        } );

        html.find('nav').append(button);
    }

});

export class PocketSandOverlay extends Application {
    constructor(...args) {
        super(...args); 
    }

    refresh = foundry.utils.debounce(this.render, 100);

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            ...super.defaultOptions,
            id: "pocket-sand-overlay",
            popOut: false,
            classes: ["pocket-sand"],
            template: 'modules/pocket-sand/templates/overlay.hbs',
            isGM: null
        });
    }

    async getData(options={}) {
        const context = super.getData(options);
        context.isGM = game.user.isGM;
        let file = game.settings.get("pocket-sand", "img");
        if ( VideoHelper.hasVideoExtension(file) ){
            context.video = file
        } else { 
            context.img = file
        }
        return context;
    }

    async refresh(force) {
        return foundry.utils.debounce(this.render.bind(this, force), 100)();
    }

    async close(options) { 
        super.close(options);
    }

}