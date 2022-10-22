let utils = require("utils")
function transfer(creep) {
    if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        return ERR_NOT_ENOUGH_RESOURCES
    }
    let target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        filter: function(structure) {
            return (structure instanceof StructureSpawn || structure instanceof StructureExtension)
            && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        }
    })
    return utils.doOrMove(creep, target, (c, s) => c.transfer(s, RESOURCE_ENERGY))
}
function build(creep) {
    if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        return ERR_NOT_ENOUGH_RESOURCES
    }
    let target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, {
        filter:structure => structure instanceof StructureExtension || structure instanceof StructureTower
    }) || creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES)
    if(target == null) {
        return ERR_NO_PATH
    }
    utils.doOrMove(creep, target, (c, s) => c.build(s))
}
function upgradeController(creep) {
    if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        return ERR_NOT_ENOUGH_RESOURCES
    }
    let target = creep.pos.findClosestByRange(
        creep.room.find(FIND_MY_STRUCTURES, {
            filter:structure => structure instanceof StructureController
        })
    )
    if(target == null) {
        return ERR_NO_PATH
    }
    utils.doOrMove(creep, target, (c, s) => c.upgradeController(s))
}
function doJob(creep) {
    
    if(creep.memory.role == "harvester") {
        return transfer(creep)
    } else if(creep.memory.role == "builder") {
        return build(creep)
    } else {
        return upgradeController(creep)
    }
    return -1
}
exports.run = function (creep) {
    utils.doThenDo(creep.memory, [
        () => utils.assignSource(creep),
        () => utils.harvest(creep),
        () => utils.getJob(creep),
        () => doJob(creep),
        () => {creep.memory.role = "none"; return -1}
        
    ])
}
exports.spawn = function(spawner, energyTarget) {
    
    energyTarget = energyTarget || 300
    let parts = [MOVE, CARRY, WORK]
    if(energyTarget >= 400)
        parts = [MOVE, MOVE, CARRY, CARRY, WORK, WORK]
    if(energyTarget >= 600)
        parts = [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK, WORK]
        console.log(energyTarget, spawner.spawnCreep(parts, utils.name("Worker"), {memory:{role:"harvester"}}))

}