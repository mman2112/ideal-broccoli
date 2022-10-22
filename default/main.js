let Worker = require("role.worker")
let utils = require("utils")
let room = Game.spawns["Spawn1"].room
let sourceCount = room.find("FIND_SOURCES").length
let roomEnergyProduction = sourceCount * 10

function countRoles() {
    let counts = {total:0}
    Object.entries(Game.creeps).forEach( ([name, creep]) => {
        let role = creep.memory.role
        counts[role] = (counts[role] || 0) + 1
        counts.total += 1
    })
    return counts
}
room.memory.roleCounts = countRoles()
room.memory.siteCount = Game.spawns["Spawn1"].room.find(FIND_CONSTRUCTION_SITES).length


module.exports.loop = function(){
    utils.cleanupMemory()
    let counts = countRoles()
    let spawner = Game.spawns["Spawn1"]
    let info_count = `H/U/B ${counts.harvester || 0}/${counts.upgrader || 0}/${counts.builder || 0} (${counts.total})`
    let info_energy = `E ${spawner.room.energyAvailable}/${spawner.room.energyCapacityAvailable}`
    spawner.room.visual.text(info_count, spawner.pos.x, spawner.pos.y-2)
    spawner.room.visual.text(info_energy, spawner.pos.x, spawner.pos.y-3) 
    if(counts.total < 15) {
            let controller = Worker
            controller.spawn(spawner, counts.total < 1 ? 300 : spawner.room.energyCapacityAvailable)
    }
    Object.entries(Game.creeps).forEach(([name, creep]) => {
        let roleController = Worker
        if(roleController)
            roleController.run(creep)
    })
}
global.buildRoad = function(room, x1, y1, x2, y2, opts = {range:1}) {
    let start = new RoomPosition(x1, y1, room)
    let goal = {pos:new RoomPosition(x2, y2, room), range:opts.range }
    let {path} = PathFinder.search(start, goal)
    path.forEach(rpos => Game.rooms[rpos.roomName].createConstructionSite(rpos, STRUCTURE_ROAD))
}
let buildRoadTP = function(start, goal, fr=false) {
    let {path} = PathFinder.search(start, goal, {range:1})
    path.forEach(rpos => {
        if(!fr)
            Game.rooms[rpos.roomName].visual.circle(rpos)
        else
            Game.rooms[rpos.roomName].createConstructionSite(rpos, STRUCTURE_ROAD)
    })
}
global.buildRoads = function(roomName, fr) {
    let room = Game.rooms[roomName]
    let spawn = room.find(FIND_MY_STRUCTURES, {filter:(s) => s instanceof StructureSpawn})[0]
    let upgrade = room.find(FIND_MY_STRUCTURES, {filter:(s) => s instanceof StructureController})[0]
    let sources = room.find(FIND_SOURCES)
    if(spawn)
        sources.forEach(src => buildRoadTP(spawn.pos, src.pos, fr))
    if(upgrade)
        sources.forEach(src => buildRoadTP(upgrade.pos, src.pos, fr))
    
}