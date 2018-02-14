import { CPUControls } from "../utils/Controls";
import { Player } from "../entities/Player";

export class CPU {
    controls: CPUControls;
    underwears: Phaser.Group;
    capturePoints: Phaser.Group;
    me: Player;

    think() {
        this.controls.reset();
        let underwear = this.underwears.getClosestTo(this.me, u => u.body.enable);
        if(underwear) {
            this.moveToXY(underwear.body.x, underwear.body.y);
        }
    }

    moveToXY(x:number, y:number) {
        if(this.me.body.x < x) {
            this.controls.goingLeft = true;
        } else if(this.me.body.x < x) {
            this.controls.goingRight = true;
        }
        if(this.me.body.y < y) {
            this.controls.goingDown = true;
        } else if(this.me.body.y < y) {
            this.controls.goingUp = true;
        }
    }
}