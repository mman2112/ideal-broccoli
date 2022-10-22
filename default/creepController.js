const Worker = require("role.worker")
exports.run = function() {
    Object.values(Game.creeps).forEach(creep => {
        Worker.run(creep)
    })
    
}