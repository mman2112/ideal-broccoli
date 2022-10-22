const { cleanupMemory } = require("./utils")

exports.markBusy = function(obj) {
    let id = obj.id
    global.busy = global.busy || {}
    global.busy[id] = (global.busy[id] || 0) + 1
}
exports.busyTick = function() { //should be called once per tick
    Memory.busy = global.busy || {}
    global.busy = {}
}
exports.getBusy = function(obj) {
    return Memory.busy[obj.id]
}
exports.getLeastBusy = function(objs) {
    let array = [...objs]
    array.sort((a,b) => exports.getBusy(a) - exports.getBusy(b))
    return Game.getObjectById(array[0])
}