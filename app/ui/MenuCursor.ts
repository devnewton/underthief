/// <reference path="../../typings/phaser.d.ts"/>

interface Togglable {
    toggle?: Function;
}

export class MenuCursor extends Phaser.Text {
    private buttons: Phaser.Group;
    private currentButton = 0;

    constructor(game: Phaser.Game, buttons: Phaser.Group) {
        super(game, 0, 0, '☞', {font: "64px monospace", fill: 'white'});
        this.buttons = buttons;
        const previousKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        previousKey.onDown.add(() => this.moveToButton(-1), null);
        const nextKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        nextKey.onDown.add(() => this.moveToButton(1), null);
        const activateKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        activateKey.onDown.add(() => this.activateButton(), null);
        this.visible = false;
    }

    moveToButton(direction: number) {
        if (this.buttons.children.length > 0) {
            this.visible = true;
            this.currentButton += direction;
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
        if(!this.visible) {
            this.moveToButton(0);
        } else if (this.buttons.children.length > 0) {
            const button = <Togglable> this.buttons.children[this.currentButton];
            if(button.toggle) {
                button.toggle();
            }
        }
    }
}