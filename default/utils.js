exports.cleanupMemory = function() {
    Object.keys(Memory.creeps).filter(name => !Game.creeps[name]).forEach(name => delete Memory.creeps[name])
}