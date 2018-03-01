/// <reference path="../../typings/phaser.d.ts"/>
import {AbstractState} from "./AbstractState";
import {MenuButton} from "../ui/MenuButton";

export class Help1 extends AbstractState {

    constructor() {
        super();
    }

    preload() {
        this.game.load.image('help1', 'help/help1.png');
        MenuButton.preload(this.game);
    }

    create() {
        super.create();
        this.game.add.image(0, 0, 'help1');
        new MenuButton(this.game, "Continue", 200, 600, () => this.game.state.start('Help2'));
    }
}
