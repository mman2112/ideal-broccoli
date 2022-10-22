exports.name = function(Base = "Creep") {
    return Base + "_" + Game.time
}
exports.doOrMove = function(creep, location, action) {
    let err = action(creep, location)
    if(err == ERR_NOT_IN_RANGE) {
        creep.moveTo(location)
    } else if (err != 0) {
        //console.log("UNEXPECTED ERROR", err)
    }
}
exports.doThenDo = function(memory, actions, options={}) {
    let key = options.key || "utils_doThenDo"
    let index = memory[key] || 0
    if(index >= actions.length) {index = 0}
    
    if(actions[index]()) index++
    
    memory[key] = index
}
exports.harvest = function(creep) {
    if(creep.store.getFreeCapacity (RESOURCE_ENERGY) == 0) {
        return ERR_FULL
    }
    let src = creep.pos.findClosestByRange(FIND_SOURCES)
    exports.doOrMove(creep, src, (c, s) => c.harvest(s))
    
}
exports.partCost = function(parts) {
    let sum = 0
    parts.forEach(part => sum += BODYPART_COST[part])
    return sum
}