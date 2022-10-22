let Harvester = require("role.harvester")
let Builder = require("role.builder")
let Upgrader = require("role.upgrader")
let roleMap = {
    "harvester":Harvester,
    "builder":Builder,
    "upgrader":Upgrader
}
function countRoles() {
    let counts = {}
    Object.entries(Game.creeps).forEach( ([name, creep]) => {
        let role = creep.memory.role
        counts[role] = (counts[role] || 0) + 1
    })
    return counts
}
module.exports.loop = function(){
    let counts = countRoles()
    let roleTargets = [
        ["harvester", 1],
        ["upgrader", 2],
        ["builder", 1],
        ["harvester", 2],
        ["builder", 6]
    ]
    console.log(JSON.stringify(counts))
    
    for(let [role, target] of roleTargets) {
        if((counts[role] || 0) < target) {
            let controller = roleMap[role]
            //console.log("trySpawn", role, counts[role], target)
            let spawner = Game.spawns["Spawn1"]
            controller.spawn(spawner, spawner.room.energyCapacityAvailable)
            break
        }
    }
    Object.entries(Game.creeps).forEach(([name, creep]) => {
        let roleController = roleMap[creep.memory.role]
        if(roleController)
            roleController.run(creep)
    })
    console.log(Game.cpu.getUsed() / Game.cpu.limit)
}
global.buildRoad = function(room, x1, y1, x2, y2, opts = {range:1}) {
    let start = new RoomPosition(x1, y1, room)
    let goal = {pos:new RoomPosition(x2, y2, room), range:opts.range }
    let {path} = PathFinder.search(start, goal)
    console.log(path)
    path.forEach(rpos => Game.rooms[rpos.roomName].createConstructionSite(rpos, STRUCTURE_ROAD))
}