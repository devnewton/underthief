/// <reference path="../../typings/phaser.d.ts"/>

export enum ControllerType {
    CPU = -1,
    KEYBOARD,
    PAD1,
    PAD2,
    PAD3,
    PAD4
}

export class Controllers {
    controllers: Array<AbstractControls>;

    constructor(game: Phaser.Game) {
        this.controllers = [
            new KeyboardControls(game),
            new PadControls(game, 1),
            new PadControls(game, 2),
            new PadControls(game, 3),
            new PadControls(game, 4),
        ];
    }

    getController(type: ControllerType): AbstractControls {
        switch (type) {
            case ControllerType.CPU:
                return null;
            default:
                return this.controllers[type];
        }
    }

    getKeyboard(): KeyboardControls {
        return this.controllers[0] as KeyboardControls;
    }

    getPad(padIndex: number): PadControls {
        return this.controllers[padIndex] as PadControls;
    }
}

export abstract class AbstractControls {

    abstract isGoingUp();
    abstract isGoingDown();
    abstract isGoingLeft();
    abstract isGoingRight();
    abstract shootingAngle(shooterX: number, shooterY: number): number;

    protected readNumberFromLocalStorage(key: string, defaultValue: number) {
        let i = parseInt(localStorage.getItem(key));
        if (isNaN(i)) {
            return defaultValue;
        } else {
            return i;
        }
    }
}

export class KeyboardControls extends AbstractControls {
    kb: Phaser.Keyboard;
    game: Phaser.Game;
    keyCodeMoveUp: number;
    keyCodeMoveDown: number;
    keyCodeMoveLeft: number;
    keyCodeMoveRight: number;
    keyCodeShoot: number;
    moveXAxis: number;
    moveYAxis: number;

    constructor(game: Phaser.Game) {
        super();
        this.game = game;
        game.input.gamepad.start();
        this.setupKeyboardLayout();
    }

    setupKeyboardLayout() {
        this.kb = this.game.input.keyboard;
        let layout = localStorage.getItem('keyboard.layout');
        if (null == layout || layout == 'azerty') {
            this.useAzertyLayout();
        } else if (layout == 'qwerty') {
            this.useQwertyLayout();
        } else if (layout == 'other') {
            this.useOtherKeyboardLayout();
        } else if (layout == 'custom') {
            this.useCustomKeyboardLayout();
        }
    }

    useAzertyLayout() {
        this.keyCodeMoveUp = Phaser.KeyCode.Z;
        this.keyCodeMoveDown = Phaser.KeyCode.S;
        this.keyCodeMoveLeft = Phaser.KeyCode.Q;
        this.keyCodeMoveRight = Phaser.KeyCode.D;
        this.keyCodeShoot = Phaser.KeyCode.J;
        localStorage.setItem('keyboard.layout', 'azerty');
    }

    useQwertyLayout() {
        this.keyCodeMoveUp = Phaser.KeyCode.W;
        this.keyCodeMoveDown = Phaser.KeyCode.S;
        this.keyCodeMoveLeft = Phaser.KeyCode.A;
        this.keyCodeMoveRight = Phaser.KeyCode.D;
        this.keyCodeShoot = Phaser.KeyCode.J;
        localStorage.setItem('keyboard.layout', 'qwerty');
    }

    useOtherKeyboardLayout() {
        this.keyCodeMoveUp = Phaser.KeyCode.UP;
        this.keyCodeMoveDown = Phaser.KeyCode.DOWN;
        this.keyCodeMoveLeft = Phaser.KeyCode.LEFT;
        this.keyCodeMoveRight = Phaser.KeyCode.RIGHT;
        this.keyCodeShoot = Phaser.KeyCode.SPACEBAR;
        localStorage.setItem('keyboard.layout', 'other');
    }

    useCustomKeyboardLayout() {
        this.keyCodeMoveUp = this.readNumberFromLocalStorage('keyboard.layout.custom.moveUp', Phaser.KeyCode.UP);
        this.keyCodeMoveDown = this.readNumberFromLocalStorage('keyboard.layout.custom.moveDown', Phaser.KeyCode.DOWN);
        this.keyCodeMoveLeft = this.readNumberFromLocalStorage('keyboard.layout.custom.moveLeft', Phaser.KeyCode.LEFT);
        this.keyCodeMoveRight = this.readNumberFromLocalStorage('keyboard.layout.custom.moveRight', Phaser.KeyCode.RIGHT);
        this.keyCodeShoot = this.readNumberFromLocalStorage('keyboard.layout.custom.shoot', Phaser.KeyCode.SPACEBAR);
        localStorage.setItem('keyboard.layout', 'custom');
    }

    shootingAngle(shooterX: number, shooterY: number): number {
        if (this.kb) {
            let dx = 0;
            if (this.kb.isDown(this.keyCodeMoveLeft)) {
                dx = -1;
            } else if (this.kb.isDown(this.keyCodeMoveRight)) {
                dx = 1;
            }
            let dy = 0;
            if (this.kb.isDown(this.keyCodeMoveUp)) {
                dy = -1;
            } else if (this.kb.isDown(this.keyCodeMoveDown)) {
                dy = 1;
            }
            if (dx != 0 || dy != 0) {
                return Phaser.Math.angleBetween(0, 0, dx, dy);
            } else {
                return null;
            }
        }
    }

    isGoingUp(): boolean {
        return this.kb && this.kb.isDown(this.keyCodeMoveUp);
    }
    isGoingDown(): boolean {
        return this.kb && this.kb.isDown(this.keyCodeMoveDown);
    }

    isGoingLeft(): boolean {
        return this.kb && this.kb.isDown(this.keyCodeMoveLeft);
    }

    isGoingRight(): boolean {
        return this.kb && this.kb.isDown(this.keyCodeMoveRight);
    }

}

export class PadControls extends AbstractControls {
    pad: Phaser.SinglePad;
    game: Phaser.Game;
    moveXAxis: number;
    moveYAxis: number;
    shootButton: number;

    constructor(game: Phaser.Game, padIndex: number) {
        super();
        this.game = game;
        game.input.gamepad.start();
        this.setupGamepadLayout(padIndex);
    }

    private setupGamepadLayout(padIndex: number) {
        let layout = localStorage.getItem('gamepad' + padIndex + '.layout');
        if (null == layout || layout == 'xbox') {
            this.useXboxLayout(padIndex);
        } else if (layout == 'custom') {
            this.useCustomGamepadLayout(padIndex);
        }
    }

    useXboxLayout(padIndex: number) {
        padIndex = padIndex || 1;
        this.pad = this.game.input.gamepad['pad' + padIndex];
        this.moveXAxis = Phaser.Gamepad.XBOX360_STICK_LEFT_X;
        this.moveYAxis = Phaser.Gamepad.XBOX360_STICK_LEFT_Y;
        this.shootButton = Phaser.Gamepad.XBOX360_A;
        localStorage.setItem('gamepad' + padIndex + '.layout', 'xbox');
    }

    useCustomGamepadLayout(padIndex: number) {
        padIndex = padIndex || 1;
        this.pad = this.game.input.gamepad['pad' + padIndex];
        this.moveXAxis = this.readNumberFromLocalStorage('gamepad' + padIndex + '.layout.custom.moveXAxis', Phaser.Gamepad.XBOX360_STICK_LEFT_X);
        this.moveYAxis = this.readNumberFromLocalStorage('gamepad' + padIndex + '.layout.custom.moveYAxis', Phaser.Gamepad.XBOX360_STICK_LEFT_Y);
        this.shootButton = this.readNumberFromLocalStorage('gamepad' + padIndex + '.layout.custom.shootButton', Phaser.Gamepad.XBOX360_A);
        localStorage.setItem('gamepad' + padIndex + '.layout', 'custom');
    }

    shootingAngle(shooterX: number, shooterY: number): number {
        if (this.pad && this.pad.isDown(this.shootButton)) {
            let dx = this.pad.axis(this.moveXAxis);
            let dy = this.pad.axis(this.moveYAxis);
            dx = Math.abs(dx) <= this.pad.deadZone ? 0 : dx;
            dy = Math.abs(dy) <= this.pad.deadZone ? 0 : dy;
            if (dx != 0 || dy != 0) {
                return Phaser.Math.angleBetween(0, 0, dx, dy);
            } else {
                return null;
            }
        }
    }

    isGoingUp(): boolean {
        return this.pad && this.pad.axis(this.moveYAxis) < -this.pad.deadZone
            ;
    }
    isGoingDown(): boolean {
        return this.pad && this.pad.axis(this.moveYAxis) > this.pad.deadZone
            ;
    }

    isGoingLeft(): boolean {
        return this.pad && this.pad.axis(this.moveXAxis) < -this.pad.deadZone;
    }

    isGoingRight(): boolean {
        return this.pad && this.pad.axis(this.moveXAxis) > this.pad.deadZone;
    }

}