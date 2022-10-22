exports.genName = function(Base = "Creep") {
    return Base + "_" + Game.time
}
exports.partCost = function(parts) {
    let sum = 0
    parts.forEach(part => sum += BODYPART_COST[part])
    return sum
}
exports.getWorkPartCount = function(creep) {
    return creep.body.filter(part => part.type == WORK).length
}