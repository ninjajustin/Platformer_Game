import {AParticleSystemModel} from "../../../../anigraph/effects/particles/AParticleSystemModel";
import {ASerializable, Color, GetAppState, NodeTransform3D, Quaternion, V3, Vec3} from "../../../../anigraph";
import {AppConfigs} from "../../../AppConfigs";
import {BillboardParticle} from "./BillboardParticle";
import { v3 } from "uuid";
import {BillboardParticleSystemView} from "./BillboardParticleSystemView";


let appState = GetAppState();

@ASerializable("BillboardParticleSystemModel")
export class BillboardParticleSystemModel extends AParticleSystemModel<BillboardParticle>{
    //particles:ABillboardParticle[]
    lastEmittedIndex:number=0;
    lastTimeUpdate:number=-1;
    cameraTransform:NodeTransform3D = new NodeTransform3D();
    myTransform:NodeTransform3D = new NodeTransform3D();
    disabled:boolean = false;
    timeSinceEmitted:number = 0;
    emissionCount:number = 0;

    initialUpSpeed:number = .5;
    initialSize:number = 1;
    particleColor:Color = Color.FromRGBA(222 + (256 - 222) * Math.random() / 256, 106 / 256, 44 / 256, .8);

    // /**
    //  * This is an example of how you can add particle system controls to the control panel
    //  * @constructor
    //  */
    // static AddParticleSystemControls(){
    // }

    /**
     * This will emit a new particle. The starter implementation does this in a round-robin order, so it will recycle
     * the particle that was emitted least recently.
     */
    emit(){
        let i=(this.lastEmittedIndex+1)%(this.nParticles);

        // set starting position to a random point inside a circle on the xz plane
        let startingPosition = V3(.5, 0, 0).times(Math.random()).getRotatedByQuaternion(Quaternion.RotationY(Math.random() * 2 * Math.PI));
        startingPosition = startingPosition.plus(this.myTransform.position);
        let rotation = Quaternion.RotationY(Math.random() * 2 * Math.PI);
        let startingVelocity = V3(0,this.initialUpSpeed,0).getRotatedByQuaternion(rotation);

        this.particles[i].right = this.particles[i].right.getRotatedByQuaternion(rotation);
        this.particles[i].position = startingPosition;
        this.particles[i].velocity = startingVelocity;
        this.particles[i].sinOffset = Math.random() * 2 * Math.PI
        this.particles[i].mass = 3;
        this.particles[i].size = this.initialSize;
        this.particles[i].visible=true;
        this.particles[i].timeSinceEmitted=0;
        this.particles[i].color = this.particleColor;
        this.lastEmittedIndex=i;
    }

    /**
     * Here you initialize the particles
     * @param nParticles
     */
    initParticles(nParticles:number){
        for(let i=0;i<nParticles;i++){
            let newp = new BillboardParticle();

            /**
             * Here we will initialize the particles to be invisible.
             * This won't do anything on its own, though; you will have to ensure that invisible particles are not visible in your corresponding custom view class.
             */
            newp.visible=false;

            /**
             * Let's add the particle...
             */
            newp.initialUpSpeed = this.initialUpSpeed;
            this.addParticle(newp);
        }
    }

    constructor(transform?:NodeTransform3D, ...args:any[]) {
        super();
        this.initParticles(BillboardParticleSystemView.MAX_PARTICLES);
        this.signalParticlesUpdated();
        if (transform != undefined)
            this.myTransform = transform;
    }

    updateCameraTransform(transform: NodeTransform3D){
        this.cameraTransform = transform
    }

    setDisable() {
        this.disabled = true;
        this.myTransform.position = V3(0, -999, 0);
        for(let i=0;i<this.particles.length;i++){
            this.particles[i].position = V3(0, -999, 0);
            this.particles[i].velocity = V3(0, 0, 0);
        }
    }

    timeUpdate(t: number, ...args:any[]) {
        super.timeUpdate(t, ...args);

        /**
         * This is one way to check and see if we are in our first timeUpdate call.
         * We initialized this.lastTimeUpdate to -1, so if it is less than 0 we know it's our first time calling this function.
         */
        if(this.lastTimeUpdate<0){
            this.lastTimeUpdate=t;
        }

        let timePassed = t-this.lastTimeUpdate;
        this.lastTimeUpdate=t;
        this.timeSinceEmitted += timePassed;
        if (this.disabled) return;

        /**
         * Let's emit a new particle
         */
        // if (this.emissionCount < this.nParticles || this.timeSinceEmitted > 0){
        //     this.emit();
        //     this.timeSinceEmitted = 0;
        //     if(this.emissionCount < this.nParticles) this.emissionCount++;
        // }
        this.emit();

        /**
         * Here we will define some behavior for our particles. This is a bare minimum simple forward euler simulation.
         */

        for(let i=0;i<this.particles.length;i++){
            let p =this.particles[i];
            p.position=p.position.plus(
                p.velocity.times(
                  3*timePassed
                )
            );

            p.update(t, timePassed);
        }

        /**
         * This is important! You need to signal that the particles have been updated to trigger re-rendering of the view!
         */
        this.signalParticlesUpdated();
    }

}
