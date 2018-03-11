/// <reference path="../../typings/phaser.d.ts"/>

interface Togglable {
    toggle?: Function;
}

export class MenuCursor extends Phaser.Text {
    private buttons: Phaser.Group;
    private currentButton = 0;
    waitUntil: number = -1;

    constructor(game: Phaser.Game, buttons: Phaser.Group) {
        super(game, 0, 0, '👉', { font: "64px monospace", fontWeight: 'bold', fill: 'white' });
        this.buttons = buttons;
        this.visible = false;
        game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(() => this.moveToButton(-1), null);
        game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(() => this.moveToButton(1), null);
        game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(() => this.activateButton(), null);
    }

    firstPadConnected(): Phaser.SinglePad {
        const gamepad = this.game.input.gamepad;
        if (gamepad.pad1.connected) {
            return gamepad.pad1;
        } else if (gamepad.pad2.connected) {
            return gamepad.pad2;
        } else if (gamepad.pad3.connected) {
            return gamepad.pad3;
        } else if (gamepad.pad4.connected) {
            return gamepad.pad4;
        } else {
            return null;
        }
    }

    update() {
        super.update();
        if (this.parent.visible && this.game.time.time > this.waitUntil && this.processPad()) {
            this.waitUntil = this.game.time.time + 230;
        }
    }

    processPad(): boolean {
        const pad = this.firstPadConnected();
        if (pad) {
            for (let b = 0; b < 4; ++b) {
                let button = pad.getButton(b);
                if (button && button.isDown) {
                    this.activateButton();
                    return true;
                }
            }
            for (let a = 0; a < 2; ++a) {
                const axis = pad.axis(a);
                if (axis > pad.deadZone) {
                    this.moveToButton(1);
                    return true;
                } else if (axis < -pad.deadZone) {
                    this.moveToButton(-1);
                    return true;
                }
            }
        }
        return false;
    }

    moveToButton(direction: number) {
        if (this.parent.visible && this.buttons.children.length > 0) {
            if (!this.visible) {
                this.visible = true;
            } else {
                this.currentButton += direction;
            }
            if (this.currentButton >= this.buttons.length) {
                this.currentButton = 0;
            }
            if (this.currentButton < 0) {
                this.currentButton = this.buttons.length - 1;
            }
            const button = this.buttons.children[this.currentButton];
            this.x = button.x;
            this.y = button.y;
        }
    }
    activateButton() {
        if (this.parent.visible) {
            if (!this.visible) {
                this.moveToButton(0);
            } else if (this.buttons.children.length > 0) {
                const button = <Togglable>this.buttons.children[this.currentButton];
                if (button.toggle) {
                    button.toggle();
                }
            }
        }
    }
}