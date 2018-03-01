/// <reference path="../../typings/phaser.d.ts"/>
import {AbstractState} from "./AbstractState";
import {MenuButton} from "../ui/MenuButton";

export class Help2 extends AbstractState {

    constructor() {
        super();
    }

    preload() {
        this.game.load.image('help2', 'help/help2.png');
        MenuButton.preload(this.game);
    }

    create() {
        super.create();
        this.game.add.image(0, 0, 'help2');
        new MenuButton(this.game, "Continue", 200, 610, () => this.game.state.start('Title'));
    }
}
