let utils = require("utils")
const { doThenDo, harvest } = require("tasks")
const { genName } = require("creepUtils")
const { assignJob, clearJob, doJob, assignSource, sayJob } = require("./jobs")

exports.run = function (creep) {
    doThenDo(creep.memory, [
        () => assignSource(creep),
        () => harvest(creep),
        () => assignJob(creep),
        () => doJob(creep),
        () => clearJob(creep)
    ])
    sayJob(creep)
}
exports.spawn = function(spawner, size=1) {
    let parts = []
    for(let i=0; i<size; ++i) {
        parts.push(WORK)
        parts.push(MOVE)
        parts.push(CARRY)
    }
    spawner.spawnCreep(parts, genName("Worker"), {memory:{role:"worker"}})
}