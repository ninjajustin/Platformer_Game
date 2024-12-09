import {AParticle3D} from "../../../../anigraph/physics/AParticle3D";
import {Color, V3, Vec3, Quaternion} from "../../../../anigraph";


/**
 * A particle subclass for you to customize
 */
export class BillboardParticle extends AParticle3D{
    color!:Color;
    timeSinceEmitted!:number;
    //lifeDuration:number = .5;
    right!:Vec3;
    sinOffset!:number;
    initialUpSpeed!:number;
    initialSize:number = 1;

    constructor(position?:Vec3, velocity?:Vec3, mass?:number, size?:number, color?:Color) {
        super(position, velocity, mass, size);
        this.color=color??Color.FromString("#00ff00");
        this.right=V3(1,0,0);
    }

    update(t:number, timePassed:number){
        this.timeSinceEmitted += timePassed;
        this.right = this.right.getRotatedByQuaternion(Quaternion.RotationY((Math.random() - .5) * 10 * timePassed));

        let sineRotation = Quaternion.FromRotationBetweenTwoVectors(V3(1,0,0), this.right);
        this.velocity = V3(-Math.sin(4 * t + this.sinOffset), this.initialUpSpeed + (3*this.timeSinceEmitted)**2, 0).getRotatedByQuaternion(sineRotation);
        this.size = Math.max(.05, this.initialSize - (1.8*this.timeSinceEmitted)**2)
        this.color = this.color.Spun(-.007);
        this.color = this.color.Darken(.1);
    }
}
