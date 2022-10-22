const { transfer, build, upgradeController } = require("./tasks")
const { getSiteCount } = require("roomUtils")
const { getLeastBusy } = require("./busy")
const { getRole } = require("./roles")

exports.assignSource = function(creep) {
    creep.memory.source = getLeastBusy(creep.room.find(FIND_SOURCES))
    return -1
}
exports.countJobs = function(room) {
    let counts = {total:0}
    room.find(FIND_CREEPS, {filter: creep => getRole(creep) == "worker"})
        .map(creep => creep.memory.job)
        .forEach(job => {
            counts[job] = (counts[job] || 0) + 1
            counts.total += 1
        })
    return counts
}
exports.getJobCountString = function(room) {
    let counts = exports.countJobs(room)
    return `H/U/B ${counts.harvester || 0}/${counts.upgrader || 0}/${counts.builder || 0} (${counts.total})`
}
exports.assignJob = function(creep) {
    creep.memory.job = "none"
    let jobCounts = exports.countJobs(creep.room)

    let job = "upgrader"
    if(creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
        job = "harvester"
    } else if(jobCounts.builder < jobCounts.upgrader && jobCounts.builder < getSiteCount(creep.room)) {
        job = "builder"
    }
    creep.memory.job = job

    return 1
}
exports.getJob = function(creep) {
    return creep.memory.job || "none"
}

exports.doJob = function(creep) {
    let jobFunctions = {
        harvester: transfer,
        builder: build,
        upgrader: upgradeController,
        none:()=>-1
    }
    return jobFunctions[exports.getJob(creep)](creep)
}
exports.clearJob = function(creep) {
    creep.memory.job = "none"
    return 1
}
exports.sayJob = function(creep) {
    let symbols = {
        "upgrader":"⬆",
        "builder":"🛠",
        "harvester":"⚡"
    }
    let sym = symbols[exports.getJob(creep)] || "⛏"
    creep.say(sym)
}