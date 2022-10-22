exports.name = function(Base = "Creep") {
    return Base + "_" + Game.time
}
exports.doOrMove = function(creep, location, action) {
    creep.moveTo(location)
    let err = action(creep, location)
    if(err == ERR_NOT_IN_RANGE) {
        creep.moveTo(location)
    } else if (err != 0) {
        console.log(err)
        return err
    }
}
exports.doThenDo = function(memory, actions, options={}) {
    let key = options.key || "utils_doThenDo"
    let index = memory[key] || 0
    if(index >= actions.length) {index = 0}
    let err = actions[index]()
    //console.log(actions, index, err)
    if(err) {
        index++
    }
    
    memory[key] = index
}
exports.harvest = function(creep) {
    if(creep.store.getFreeCapacity (RESOURCE_ENERGY) == 0) {
        return ERR_FULL
    }
    let src = creep.pos.findClosestByRange(FIND_SOURCES)
    if (creep.memory.source) {
        src = Game.getObjectById(creep.memory.source)
    }
    return exports.doOrMove(creep, src, (c, s) => c.harvest(s))
}
exports.partCost = function(parts) {
    let sum = 0
    parts.forEach(part => sum += BODYPART_COST[part])
    return sum
}
exports.getRoleCount = function(room, role) {
    let rc =  room.memory.roleCounts || {}
    return rc[role] || 0
}
exports.assignSource = function(creep) {
    let sources = creep.room.find(FIND_SOURCES)
    let len = sources.length
    let index = Game.time % len
    console.log(index, len)
    creep.memory.source = sources[index].id
    creep.say(`Src ${index+1}/${len}`)
    return -1
}
exports.getJob = function(creep) {
    let hc = exports.getRoleCount(creep.room, "harvester")
    let bc = exports.getRoleCount(creep.room, "builder")
    let uc = exports.getRoleCount(creep.room, "upgrader")
    if(creep.memory.role) {
        creep.room.memory.roleCounts[creep.memory.role] = (creep.room.memory.roleCounts[creep.memory.role] || 1) - 1
    }
    if(creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
        creep.memory.role = "harvester"
    } else if(bc <= uc && bc < creep.room.memory.siteCount) {
        creep.memory.role = "builder"
    } else {
        creep.memory.role = "upgrader"
    }
    creep.room.memory.roleCounts[creep.memory.role] = (creep.room.memory.roleCounts[creep.memory.role] || 0) + 1
    creep.say(creep.memory.role)
    return -1

}

exports.cleanupMemory = function() {
    Object.keys(Memory.creeps).filter(name => !Game.creeps[name]).forEach(name => delete Memory.creeps[name])
}