/// <reference path="../../typings/phaser.d.ts"/>
import { CPUControls } from "../utils/Controls";
import { Player } from "../entities/Player";

export class CPU {
    controls: CPUControls;
    underwears: Phaser.Group;
    capturePoints: Phaser.Group;
    me: Player;
    waitUntil: number;

    think() {
        this.controls.reset();
        if (!this.waiting()) {
            let underwear = this.underwears.getClosestTo(this.me, u => u.body.enable);
            let capturePoint = this.capturePoints.getClosestTo(this.me, u => u.body.enable);
            if (underwear && capturePoint) {
                if (this.me.game.physics.arcade.overlap(this.me, this.underwears)) {
                    this.waitUntil = this.me.game.time.time + 500;
                } else {
                    this.pushUnderwear(underwear, capturePoint);

                }
            }
        }
    }
    pushUnderwear(underwear, capturePoint) {
        if (underwear.body.blocked.up && underwear.body.blocked.left) {
            this.unblockTopLeftUnderwear(underwear);
        } else if (underwear.body.blocked.up && underwear.body.blocked.right) {
            this.unblockTopRightUnderwear(underwear);
        } if (underwear.body.blocked.down && underwear.body.blocked.left) {
            this.unblockBottomLeftUnderwear(underwear);
        } else if (underwear.body.blocked.down && underwear.body.blocked.right) {
            this.unblockBottomRightUnderwear(underwear);
        } else {
            this.pushUnderwearToCapturePoint(underwear, capturePoint);
        }
    }

    pushUnderwearToCapturePoint(underwear, capturePoint) {
        let ucVector = new Phaser.Point(underwear.body.x - capturePoint.body.x, underwear.body.y - capturePoint.body.y);
        ucVector.setMagnitude(underwear.body.radius).add(underwear.body.x, underwear.body.y);
        this.moveToXY(ucVector.x, ucVector.y);
    }

    unblockTopLeftUnderwear(underwear) {
        this.moveToXY(underwear.left, underwear.top);
    }
    unblockTopRightUnderwear(underwear) {
        this.moveToXY(underwear.right, underwear.top);
    }
    unblockBottomLeftUnderwear(underwear) {
        this.moveToXY(underwear.left, underwear.bottom);
    }
    unblockBottomRightUnderwear(underwear) {
        this.moveToXY(underwear.right, underwear.bottom);
    }
    waiting(): boolean {
        if (this.waitUntil) {
            if (this.me.game.time.time < this.waitUntil) {
                return true;
            } else {
                this.waitUntil = null;
            }
        }
        return false;
    }

    moveToXY(x: number, y: number) {
        if (this.me.body.x < x) {
            this.controls.goingRight = true;
        } else if (this.me.body.x > x) {
            this.controls.goingLeft = true;
        }
        if (this.me.body.y < y) {
            this.controls.goingDown = true;
        } else if (this.me.body.y > y) {
            this.controls.goingUp = true;
        }
    }
}