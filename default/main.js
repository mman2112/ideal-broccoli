const utils = require("utils")
const SpawnController = require("spawnController")
const CreepController = require("creepController")
const { busyTick } = require ("./busy")

module.exports.loop = function(){
    utils.cleanupMemory()
    SpawnController.maintainPopulation()
    CreepController.run()
    busyTick()
}
