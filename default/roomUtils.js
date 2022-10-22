exports.getPopulation = function(room) {
    return room.find(FIND_MY_CREEPS).length
}
exports.getSiteCount = function(room) {
    return room.find(FIND_CONSTRUCTION_SITES).length
}
exports.getSourceCount = function(room) {
    return room.find(FIND_SOURCES).length
}
exports.projectPopulation = function(room, ticks) {
    return room.find(FIND_MY_CREEPS, {filter: c=>c.ticksToLive > ticks}).length
}

exports.debugText = function(room, text) {
    if(Memory.debugText != Game.time) {
        Memory.debugText = Game.time
        nextOffset = -1
    }
    let pos = room.find(FIND_STRUCTURES, {filter: s => s instanceof StructureController})[0].pos
    room.visual.text(text, pos.x, pos.y + nextOffset--)
}