let utils = require("utils")

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
exports.run = function (creep) {
    utils.doThenDo(creep.memory, [
        () => utils.harvest(creep),
        () => upgradeController(creep)
    ])
}
exports.spawn = function(spawner) {
    spawner.spawnCreep([MOVE, MOVE, CARRY, CARRY, WORK], utils.name("Upgrader"), {memory:{role:"upgrader"}})
}