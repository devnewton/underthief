/// <reference path="../../typings/phaser.d.ts"/>
import { AbstractState } from "./AbstractState";
import { Menu } from "../ui/Menu";
import { MenuMiniButton } from "../ui/MenuMiniButton";
import { UnderthiefGame } from "../UnderthiefGame";
import { GamepadUtils } from "../utils/GamepadUtils";

export class GamepadOptionsBindAxisOrButton extends AbstractState {

    bindings = [
        { label: 'Pull move X axis', localStorageKeySuffix: 'moveXAxis' },
        { label: 'Pull move Y axis', localStorageKeySuffix: 'moveYAxis' },
        { label: 'Press hammer button', localStorageKeySuffix: 'hammerButton' },
        { label: 'Press dash button', localStorageKeySuffix: 'dashButton' },
        { label: 'Press menu button', localStorageKeySuffix: 'menuButton' }
    ];

    currentBinding: number = 0;
    pad: Phaser.SinglePad;
    padIndex = 1;
    axisButtons: Phaser.Group;
    buttonsButtons: Phaser.Group;

    constructor() {
        super();
    }

    preload() {
        Menu.preload(this.game);
        MenuMiniButton.preload(this.game);
    }

    init(padIndex: number, binding: number = 0) {
        padIndex = padIndex || 1;
        this.padIndex = 1;
        this.pad = this.input.gamepad['pad' + this.padIndex];
        if (binding >= this.bindings.length) {
            this.currentBinding = 0;
            (this.game as UnderthiefGame).controllers.getPad(this.padIndex).useCustomGamepadLayout(padIndex);
            this.game.state.start('GamepadOptions');
        } else {
            this.currentBinding = binding;
        }
    }

    create() {
        super.create();
        let logo = this.game.add.text(this.game.world.centerX, 0, this.bindings[this.currentBinding].label, { font: "42px monospace", fill: 'white' });
        logo.scale.x = 2;
        logo.scale.y = 2;
        logo.anchor.setTo(0.5, 0);
        const menu = new Menu(this.game, false);
        menu.button("Back", 200, 600, () => this.game.state.start('GamepadOptions'));
        this.createAxisButtons();
        this.createButtonsButtons();

    }

    createAxisButtons() {
        this.axisButtons = this.game.add.group();
        this.axisButtons.visible = false;
        const nbButtonsPerColumn = Math.ceil(Math.sqrt(GamepadUtils.NB_AXIS));
        for (let y = 0, axisCode =0; axisCode< GamepadUtils.NB_AXIS; ++y) {
            for (let x = 0; x < nbButtonsPerColumn; ++x) {
                const buttonAxisCode = axisCode++;
                let miniButton = new AxisButton(this.game, this.pad, buttonAxisCode, 250 + x * 200, 100 + y * 120, () => this.bindAxis(buttonAxisCode));
                this.axisButtons.add(miniButton);
            }
        }
    }

    createButtonsButtons() {
        this.buttonsButtons = this.game.add.group();
        this.buttonsButtons.visible = false;
        const nbButtonsPerColumn = Math.ceil(Math.sqrt(GamepadUtils.NB_BUTTONS));
        for (let y = 0, buttonCode =0; buttonCode< GamepadUtils.NB_BUTTONS; ++y) {
            for (let x = 0; x < nbButtonsPerColumn; ++x) {
                const buttonButtonCode = buttonCode++;
                let miniButton = new ButtonButton(this.game, this.pad, buttonButtonCode, 250 + x * 200, 100 + y * 120, () => this.bindButton(buttonButtonCode));
                this.buttonsButtons.add(miniButton);
            }
        }
    }

    update() {
        super.update();
        if (this.bindings[this.currentBinding].localStorageKeySuffix.match(/axis/gi)) {
            this.axisButtons.visible = true;
            this.buttonsButtons.visible = false;
        } else {
            this.axisButtons.visible = false;
            this.buttonsButtons.visible = true;
        }
    }

    bindAxis(axisCode: number) {
        localStorage.setItem('gamepad' + this.padIndex + '.layout.custom.' + this.bindings[this.currentBinding].localStorageKeySuffix, '' + axisCode);
        this.game.state.start('GamepadOptionsBindAxis', true, false, this.padIndex, this.currentBinding + 1);
    }

    bindButton(buttonCode: number) {
        localStorage.setItem('gamepad' + this.padIndex + '.layout.custom.' + this.bindings[this.currentBinding].localStorageKeySuffix, '' + buttonCode);
        this.game.state.start('GamepadOptionsBindAxis', true, false, this.padIndex, this.currentBinding + 1);
    }
}

class AxisButton extends MenuMiniButton {
    pad: Phaser.SinglePad;
    axisCode: number;
    constructor(game: Phaser.Game, pad: Phaser.SinglePad, axisCode: number, x: number, y: number, callback: Function) {
        super(game, axisCode.toString(), x, y, callback);
        this.pad = pad;
        this.axisCode = axisCode;
    }
    update() {
        super.update();

        if (Math.abs(this.pad.axis(this.axisCode)) > this.pad.deadZone) {
            this.tint = 0xFF6666;
        } else {
            this.tint = 0xFFFFFF;
        }
    }

}

class ButtonButton extends MenuMiniButton {
    pad: Phaser.SinglePad;
    buttonCode: number;
    constructor(game: Phaser.Game, pad: Phaser.SinglePad, buttonCode: number, x: number, y: number, callback: Function) {
        super(game, buttonCode.toString(), x, y, callback);
        this.pad = pad;
        this.buttonCode = buttonCode;
    }
    update() {
        super.update();

        if (this.pad.isDown(this.buttonCode)) {
            this.tint = 0xFF6666;
        } else {
            this.tint = 0xFFFFFF;
        }
    }

}