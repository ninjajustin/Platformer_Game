export class AppConfigs {
    static JumpPower = 0.075;
    static Gravity = 0.001;
    static SlowDown = 0.15;
    static AllowMultiJump = false;
    static MoveSpeed = 0.090;

    // GAME CONFIG ABOVE


    static CameraDefaultHeight=5;

    //Texture used for the terrain
    static GroundTexture="./images/terrain/desert.jpeg"
    // static GroundTexture="./images/pursianface.jpg"


    //how far does the light attached to the camera reach
    static ViewLightRange=30;

    //This is how far the terrain stretches out in the positive and negative X directions
    static TerrainScaleX=15;

    //This is how far the terrain stretches out in the positive and negative Y directions
    static TerrainScaleY=15;


    /**
     * This is whether to use a data texture for the terrain. For the most part, this should be true, but some older
     * machines or browsers may have trouble with the feature, so you can turn it off.
     */
    static UseTerrainDataTexture=true;

    /**
     * The width of the height map used for the terrain
     */
    static TerrainDataTextureWidth = 64;

    /**
     * The height of the height map used for the terrain
     */
    static TerrainDataTextureHeight = 64;

    /**
     * How many times does the terrain color texture repeat in the terrain
     */
    static TerrainWrapTextureX:number=15.0;
    static TerrainWrapTextureY:number=15.0;

    /**
     * The percentage of the window taken up by the render context
     */
    static WindowMaxWidthPercentage = 100;
    static WindowMaxHeightPercentage = 100;

    /**
     * Maximum number of particles in an instanced system. You can increase this if your machine can handle it.
     */
    static MAX_PARTICLES= 500;

    static DefaultBotSize:number=1;


    static VelocitySliderName:string="Velocity"
    static GravitySliderName:string="Gravity"
    static ForceStrengthSliderName:string="ForceStrength";
    static ParticleMassSliderName:string="ParticleMass"
}
