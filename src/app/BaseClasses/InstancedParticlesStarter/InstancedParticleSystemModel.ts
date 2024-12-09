import {Particle3D} from "../../../anigraph/physics/AParticle3D";
import {AInstancedParticleSystemModel} from "../../../anigraph/effects/particles/InstancedParticles";

export abstract class InstancedParticleSystemModel<P extends Particle3D> extends AInstancedParticleSystemModel<P>{

    timeUpdate(t: number, ...args:any[]) {
        super.timeUpdate(t, ...args);
        this.signalParticlesUpdated();
    }

}
