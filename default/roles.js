exports.countRoles = function(room) {
    let counts = {total:0}
    room.find(FIND_CREEPS, {filter: creep => creep.memory.role == "worker"})
        .map(creep => creep.memory.job)
        .forEach(job => {
            counts[job] = (counts[job] || 0) + 1
            counts.total += 1
        })
    return counts
}
exports.getRole = function(creep) {
    return creep.memory.role || "worker"
}