exports.getRoomPlayers = (io, room) => {
  return Array.from(io.adapter.rooms.get(room));
};
