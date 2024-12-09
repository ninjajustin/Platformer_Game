import {
    AInstancedGraphic,
    AMaterial,
    VertexArray3D
} from "../../../index";
import {Particle3D} from "../../../physics/AParticle3D";
import * as THREE from "three";



export class AInstancedParticleSystemGraphic<P extends Particle3D> extends AInstancedGraphic {
    static MAX_PARTICLES:number=300;
    protected _mesh!:THREE.InstancedMesh
    protected _geometry!:THREE.BufferGeometry;
    protected _material!:THREE.Material;

    get threejs(){
        return this.mesh;
    }

    // get particleTexture(){return "images/gradientParticle.jpg"}
    get particleTexture(){return "images/particleFlare.jpg"}

    static Create(nParticles:number=100, material?:AMaterial|THREE.Material, ...args:any[]){
        let psystem = new this();
        psystem.init(nParticles, material)
        return psystem;
    }


    init(nParticles?:number, material?:AMaterial|THREE.Material, geometry?:VertexArray3D, ...args:any[]){
        let mat = material;
        if(mat instanceof AMaterial){
            mat = mat.threejs;
        }else if(mat === undefined){
            mat = new THREE.MeshBasicMaterial({
                depthWrite: false,
                transparent:true,
                // alphaTest:0.2,
                alphaMap: new THREE.TextureLoader().load(this.particleTexture),
                // alphaMap: new THREE.Texture(particleTex)
            })
        }
        super.init(nParticles??AInstancedParticleSystemGraphic.MAX_PARTICLES, mat, geometry, ...args);
    }


}
