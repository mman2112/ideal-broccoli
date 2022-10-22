let utils = require("utils")
function transfer(creep) {
    if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        return ERR_NOT_ENOUGH_RESOURCES
    }
    let spawn = creep.room.find(FIND_MY_SPAWNS)[0]
    utils.doOrMove(creep, spawn, (c, s) => c.transfer(s, RESOURCE_ENERGY))
}
exports.run = function (creep) {
    utils.doThenDo(creep.memory, [
        () => utils.harvest(creep),
        () => transfer(creep)
    ])
}
exports.spawn = function(spawner, energyTarget) {
    energyTarget = energyTarget || spawner.room.energyCapacityAvailable
    if(energyTarget >= 0)
    spawner.spawnCreep([MOVE, CARRY, WORK, WORK], utils.name("Harvester"), {memory:{role:"harvester"}})
}