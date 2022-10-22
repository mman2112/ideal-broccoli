const { getLeastBusy, markBusy } = require ("./busy")
exports.doOrMove = function(creep, location, action) {
    let err = action(creep, location)
    if(err == ERR_NOT_IN_RANGE) {
        err = creep.moveTo(location)
        if(err == -2) {
            markBusy(location)
        }
    } else if (err != 0) {
        return err
    }
}
exports.harvest = function(creep) {
    if(creep.store.getFreeCapacity (RESOURCE_ENERGY) == 0) {
        return ERR_FULL
    }
    let src = creep.pos.findClosestByRange(FIND_SOURCES)
    if (creep.memory.source) {
        src = Game.getObjectById(creep.memory.source)
    }
    exports.doOrMove(creep, src, (c, s) => c.harvest(s))
    return 
}
exports.transfer = function(creep) {
    if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        return ERR_NOT_ENOUGH_RESOURCES
    }
    let target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        filter: function(structure) {
            return (structure instanceof StructureSpawn || structure instanceof StructureExtension)
            && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        }
    })
    return exports.doOrMove(creep, target, (c, s) => c.transfer(s, RESOURCE_ENERGY))
}
exports.build = function(creep) {
    if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        return ERR_NOT_ENOUGH_RESOURCES
    }
    let target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, {
        filter:structure => structure instanceof StructureExtension || structure instanceof StructureTower
    }) || creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES)
    if(target == null) {
        return ERR_NO_PATH
    }
    return exports.doOrMove(creep, target, (c, s) => c.build(s))
}

exports.upgradeController = function(creep) {
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
    exports.doOrMove(creep, target, (c, s) => c.upgradeController(s))
}

exports.doThenDo = function(memory, actions, options={}) {
    let key = options.key || "utils_doThenDo"
    let index = memory[key] || 0
    if(index >= actions.length) {index = 0}
    let err = actions[index]()
    if(err) {
        index++
    }
    memory[key] = index
}