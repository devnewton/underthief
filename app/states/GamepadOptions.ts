/// <reference path="../../typings/phaser.d.ts"/>
import {AbstractState} from "./AbstractState";
import {Menu} from "../ui/Menu";
import {MenuButton} from "../ui/MenuButton";

export class GamepadOptions extends AbstractState {

    constructor() {
        super();
    }

    preload() {
        Menu.preload(this.game);
    }

    create() {
        super.create();
        let title = this.game.add.text(this.game.world.centerX, 0, 'Choose gamepad', { font: "42px monospace", fill: 'white' });
        title.scale.x = 2;
        title.scale.y = 2;
        title.anchor.setTo(0.5, 0);

        let subtitle = this.game.add.text(0, 0, 'Move stick or press button to show gamepad number', { font: "32px monospace", fill: 'white' });
        subtitle.y = this.game.world.height - subtitle.height;

        const menu = new Menu(this.game);
        menu.addButton(new GamepadMenuButton(this.input.gamepad.pad1, 0xFF6666, "Gamepad 1", 200, 100, () => {
            this.game.state.start('GamepadOptionsLayout', true, false, 1);
        }));
        menu.addButton(new GamepadMenuButton(this.input.gamepad.pad2, 0x66FF66, "Gamepad 2", 200, 200, () => {
            this.game.state.start('GamepadOptionsLayout', true, false, 2);
        }));
        menu.addButton(new GamepadMenuButton(this.input.gamepad.pad3, 0x6666FF, "Gamepad 3", 200, 300, () => {
            this.game.state.start('GamepadOptionsLayout', true, false, 3);
        }));
        menu.addButton(new GamepadMenuButton(this.input.gamepad.pad4, 0xFFFF66, "Gamepad 4", 200, 400, () => {
            this.game.state.start('GamepadOptionsLayout', true, false, 4);
        }));
        menu.button("Back", 200, 550, () => this.game.state.start('Options'));
    }
}

class GamepadMenuButton extends MenuButton {
    pad: Phaser.SinglePad;
    activePadTint: number;
    constructor(pad: Phaser.SinglePad, activePadTint: number, label: string, x: number, y: number, callback: Function) {
        super(pad.game, label, x, y, callback);
        this.pad = pad;
        this.activePadTint = activePadTint;
    }

    update() {
        super.update();

        if (this.isPadActive()) {
            this.tint = this.activePadTint;
        } else {
            this.tint = 0xFFFFFF;
        }
    }

    isPadActive(): boolean {
        for (let b = 0; b < 16; ++b) {
            let button = this.pad.getButton(b);
            if (button && button.isDown) {
                return true;
            }
        }
        for (let a = 0; a < 16; ++a) {
            if (Math.abs(this.pad.axis(a)) > this.pad.deadZone) {
                return true;
            }
        }
        return false;
    }

}
