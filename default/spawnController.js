const {getSourceCount} = require("roomUtils")
const { getWorkPartCount } = require("creepUtils")
const { getRole } = require ("./roles")
const Worker = require("role.worker")
const { debugText } = require("roomUtils")
const { getJobCountString } = require("./jobs")

exports.maintainPopulation = function() {
    Object.values(Game.spawns).forEach(spawn => {
        let room = spawn.room
        let idealWorkCount = getSourceCount(spawn.room) * 6 //WORK part count in worker
        let workCount = spawn.room.find(FIND_MY_CREEPS, {
            filter: c => getRole(c) == "worker"
        }).map(c => getWorkPartCount(c)).reduce((a, b) => a+b, 0)

        if(workCount < 1) {
            Worker.spawn(spawn, 1)
        } else if (workCount < idealWorkCount) {
            if(room.energyCapacityAvailable >= 600)
                Worker.spawn(spawn, 3)
            else
                Worker.spawn(spawn, 2)
        }

        
        debugText(room, `Workers: ${workCount}/${idealWorkCount}`)
        debugText(room, `Energy: ${room.energyAvailable}/${room.energyCapacityAvailable}`)
        debugText(room, getJobCountString(room))
    })
}