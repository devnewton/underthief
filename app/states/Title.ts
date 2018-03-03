/// <reference path="../../typings/phaser.d.ts"/>
import { AbstractState } from "./AbstractState";
import { MenuButton } from "../ui/MenuButton";

export class Title extends AbstractState {

    constructor() {
        super();
    }

    preload() {
        this.game.load.image('school', 'title/school.jpg');
        this.game.load.image('logo', 'title/logo.png');
        this.game.load.audio('main-music', 'musics/opengameart/hungry-dino-9-chiptune-tracks-10-sfx/main.mp3')
        MenuButton.preload(this.game);
    }

    create() {
        super.create();
        this.game.sound.stopAll();
        this.game.sound.play('main-music', 1, true);
        this.game.add.image(0, 0, 'school');
        let logo = this.game.add.sprite(this.game.world.centerX, 10, 'logo');
        logo.scale.x = 1.4;
        logo.scale.y = 1.4;
        logo.anchor.setTo(0.5, 0);

        new MenuButton(this.game, "Start", 200, 250, () => this.game.state.start('TeamSelectScreen'));
        new MenuButton(this.game, "Options", 200, 400, () => this.game.state.start('Options'));
        new MenuButton(this.game, "Help", 200, 550, () => this.game.state.start('Help1'));
    }
}
