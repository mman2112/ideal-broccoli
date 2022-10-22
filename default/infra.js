
exports.buildRoadpp = function(start, goal, fr=false) {
    let {path} = PathFinder.search(start, goal, {range:1})
    path.forEach(rpos => {
        if(!fr)
            Game.rooms[rpos.roomName].visual.circle(rpos)
        else
            Game.rooms[rpos.roomName].createConstructionSite(rpos, STRUCTURE_ROAD)
    })
}
exports.buildRoadxy = function(room, x1, y1, x2, y2, fr=false) {
    let start = new RoomPosition(x1, y1, room)
    let goal = {pos:new RoomPosition(x2, y2, room), range:opts.range }
    exports.buildRoadpp(start, goal, fr)
}
exports.buildRoads = function(roomName, fr) {
    let room = Game.rooms[roomName]
    let spawn = room.find(FIND_MY_STRUCTURES, {filter:(s) => s instanceof StructureSpawn})[0]
    let upgrade = room.find(FIND_MY_STRUCTURES, {filter:(s) => s instanceof StructureController})[0]
    let sources = room.find(FIND_SOURCES)
    if(spawn)
        sources.forEach(src => exports.buildRoadpp(spawn.pos, src.pos, fr))
    if(upgrade)
        sources.forEach(src => exports.buildRoadpp(upgrade.pos, src.pos, fr))
    
}