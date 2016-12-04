/// <reference path="../../typings/phaser.d.ts"/>
import {AbstractState} from "./AbstractState";
import {MenuButton} from "../ui/MenuButton";

export class Title extends AbstractState {

    constructor() {
        super();
    }

    preload() {
        this.game.load.image('school', 'title/school.jpg');
        this.game.load.image('logo', 'title/logo.png');
        MenuButton.preload(this.game);
    }

    create() {
        super.create();
        this.game.add.image(0, 0, 'school');
        let logo = this.game.add.sprite(this.game.world.centerX, 10, 'logo');
        logo.scale.x = 2;
        logo.scale.y = 2;
        logo.anchor.setTo(0.5, 0);

        new MenuButton(this.game, "Start", 500, 450, () => this.game.state.start('Level'));
        new MenuButton(this.game, "Options", 500, 600, () => this.game.state.start('Options'));
        new MenuButton(this.game, "Help", 500, 750, () => this.game.state.start('Help'));
    }
}
