const TABLES = {
  PLANET: 'planet',
  SPACE_CENTER: 'space_center',
  FLIGHT: 'flight',
  BOOKING: 'booking',
};

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
  TABLES,
  JWT_SECRET,
};
