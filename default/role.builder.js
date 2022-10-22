let utils = require("utils")

function build(creep) {
    if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        return ERR_NOT_ENOUGH_RESOURCES
    }
    let target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, {
        filter:structure => structure instanceof StructureExtension
    }) || creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES)
    if(target == null) {
        return ERR_NO_PATH
    }
    utils.doOrMove(creep, target, (c, s) => c.build(s))
}
exports.run = function (creep) {
    utils.doThenDo(creep.memory, [
        () => utils.harvest(creep),
        () => build(creep)
    ])
}
exports.spawn = function(spawner, energyTarget) {
    let parts = [MOVE, MOVE, CARRY, CARRY, WORK]
    let upgrade = [MOVE, CARRY, WORK]
    while(utils.partCost(parts) + utils.partCost(upgrade) < energyTarget) {
        upgrade.forEach(part => parts.push(part))
    }
    spawner.spawnCreep([MOVE, MOVE, CARRY, CARRY, WORK], utils.name("Builder"), {memory:{role:"builder"}})
}