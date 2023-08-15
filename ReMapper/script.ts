import { Environment, Geometry, animateEnvTrack } from "https://deno.land/x/remapper@3.1.2/src/environment.ts";
import { Vec3, rand } from "https://deno.land/x/remapper@3.1.2/src/general.ts";
import { Difficulty, LightRemapper } from "https://deno.land/x/remapper@3.1.2/src/mod.ts";
import { ModelScene } from "https://deno.land/x/remapper@3.1.2/src/model.ts";
import { Wall } from "https://deno.land/x/remapper@3.1.2/src/wall.ts";

const map = new Difficulty("ExpertStandard", "ExpertPlusStandard");

// ----------- { SCRIPT } -----------


// Example: Run code on every note!

// map.notes.forEach(note => {
//     console.log(note.time)
// })



for(let i = 0; i < 400; i++) {
    let x = rand(-55, 50)
    let y = rand(15, 30)
    const starz = new Wall(0, 176, 0, 0, 0, 0)
    starz.track.value = "starzTrack"
    starz.scale = [0.5, 0.5, 0.5]
    starz.animate.length = starz.life;
    starz.animate.definitePosition = [
        [x, y, rand(-100, 50), 0]
        
    ]
    
    starz.color = [rand(0, 255) / 255, rand(0, 255) / 255, rand(0, 255) / 255, 1]

    starz.animate.localRotation = [
        [rand(0, 360), rand(0, 360), rand(0, 360), 0]
    ]
    
    starz.push(true);
}

const laserModel = new ModelScene(new Geometry())
const scene1 = new ModelScene(new Geometry())

scene1.addPrimaryGroups(
    "mountain",
    new Geometry("Cube", {
        shader: "Standard",
        color: [0.45098039215, 0.45098039215, 0.45098039215, 1]
    })
)

//Thanks to Nasafrasa for making the cool lights possible (thanks once more!)
// deno-lint-ignore no-explicit-any
function lasers(modelScenename: any, lasers: number, environment: Environment | Geometry, type: number, name: string, scale?: Vec3) {
    const laserTracks: string[] = [];
    const laserEnv = environment;
    laserEnv.lightID = 101;
    laserEnv.lightType = type;
    laserEnv.track.value = "LaserLightTrack"
    for (let i = 1; i <= lasers; i++) laserTracks.push(name + `${i}`);
    modelScenename.addPrimaryGroups(laserTracks, laserEnv, scale);
}

map.geoMaterials["laserss"] = {
    shader: "TransparentLight",
    color: [0, 0, 0]
}

lasers(laserModel, 3, new Geometry("Cube", "laserss"), 6, "laserbeam")
laserModel.static("lasers.rmmodel")
new LightRemapper().type(6).addToEnd(100).run();



scene1.static("mountainScene")

//Entfernt Umgebungsinhalte
const removeArray = [
    "BillieEnvironment.[0]Environment.[28]Clouds",
    "BillieEnvironment.[0]Environment.[12]Mountains",
    "BillieEnvironment.[0]Environment.[29]BigSmokePS",
    "BillieEnvironment.[0]Environment.[14]LeftRail",
    "BillieEnvironment.[0]Environment.[15]RightRail",
    "BillieEnvironment.[0]Environment.[16]LeftFarRail1",
    "BillieEnvironment.[0]Environment.[17]LeftFarRail2",
    "BillieEnvironment.[0]Environment.[18]RightFarRail1",
    "BillieEnvironment.[0]Environment.[19]RightFarRail2",
    'BillieEnvironment.[0]Environment.[20]RailingFullBack',
    'BillieEnvironment.[0]Environment.[21]RailingFullFront',
    'BillieEnvironment.[0]Environment.[22]LastRailingCurve',
    'BillieEnvironment.[0]Environment.[31]LightRailingSegment',
    'BillieEnvironment.[0]Environment.[31]LightRailingSegment.[0]RailingCurveF',
    'BillieEnvironment.[0]Environment.[31]LightRailingSegment.[1]NeonTubeDirectionalL',
    'BillieEnvironment.[0]Environment.[31]LightRailingSegment.[2]NeonTubeDirectionalR',
    'BillieEnvironment.[0]Environment.[31]LightRailingSegment.[3]NeonTubeDirectionalL (1)',
    'BillieEnvironment.[0]Environment.[31]LightRailingSegment.[4]NeonTubeDirectionalR (1)',
    'BillieEnvironment.[0]Environment.[32]LightRailingSegment (1)',
    'BillieEnvironment.[0]Environment.[33]LightRailingSegment (2)',
    'BillieEnvironment.[0]Environment.[33]LightRailingSegment (2).[0]RailingCurveF',
    'BillieEnvironment.[0]Environment.[33]LightRailingSegment (2).[1]NeonTubeDirectionalL',
    'BillieEnvironment.[0]Environment.[33]LightRailingSegment (2).[2]NeonTubeDirectionalR',
    'BillieEnvironment.[0]Environment.[33]LightRailingSegment (2).[3]NeonTubeDirectionalL (1)'

]

// deno-lint-ignore no-explicit-any
removeArray.forEach((x: any) => {
    const removal = new Environment(x, "Exact")
    removal.position = [0, -999, 0]
    removal.push();
})


const droplets = new Environment("BillieEnvironment.[0]Environment.[25]WaterRainRipples", "Exact")
droplets.position = [0, -999, 0]
droplets.push();


const sun = new Environment("BillieEnvironment.[0]Environment.[27]DayAndNight.[0]Day.[0]Sun", "Exact")
sun.track.value = "sunTrack"
sun.localRotation = [40, 0, 0]
sun.position = [0, -30, 100]
sun.push();

animateEnvTrack("sunTrack", 0, (x) => {
    x.length = 13.6 - 0
    x.position = [
        [0, -30, 100, 0],
        [0, 80, 100, 1, "easeOutCubic"]
    ]
},13.6 - 0)


animateEnvTrack("sunTrack", 155.8, (x2 => {
    x2.length =  176 - 155.8
    x2.position = [
        [0, 80, 100, 0],
        [0, -30, 100, 1, "easeOutCubic"]
    ]
}), 176 - 155.8)





// ----------- { OUTPUT } -----------

map.require("Chroma")
map.require("Noodle Extensions")
map.save();