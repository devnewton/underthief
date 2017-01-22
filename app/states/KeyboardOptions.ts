/// <reference path="../../typings/phaser.d.ts"/>
import {AbstractState} from "./AbstractState";
import {MenuButton} from "../ui/MenuButton";
import { UnderthiefGame } from "../UnderthiefGame";


export class KeyboardOptions extends AbstractState {

    constructor() {
        super();
    }

    preload() {
        MenuButton.preload(this.game);
    }

    create() {
        super.create();
        let logo = this.game.add.text(this.game.world.centerX, 0, 'Choose keyboard layout',{font: "42px monospace", fill: 'white'});
        logo.scale.x = 2;
        logo.scale.y = 2;
        logo.anchor.setTo(0.5, 0);

        new MenuButton(this.game, "Azerty zsqd hjk", 200, 100, () => {
            (<UnderthiefGame>this.game).controllers.getKeyboard().useAzertyLayout();
            this.game.state.start('Options');
        });
        new MenuButton(this.game, "Qwerty wsad hjk", 200, 200, () => {
            (<UnderthiefGame>this.game).controllers.getKeyboard().useQwertyLayout();
            this.game.state.start('Options');
        });
        new MenuButton(this.game, "Others ⬆⬇⬅➡ ⎇␣⎈", 200, 300, () => {
            (<UnderthiefGame>this.game).controllers.getKeyboard().useOtherKeyboardLayout();
            this.game.state.start('Options');
        });
        new MenuButton(this.game, "Custom", 200, 400, () => {
            (<UnderthiefGame>this.game).controllers.getKeyboard().useOtherKeyboardLayout();
            this.game.state.start('KeyboardOptionsBindKey', true, false);
        });
        new MenuButton(this.game, "Back", 200, 600, () => this.game.state.start('Options'));
    }
}
