const DataLoader = require('dataloader');
const queries = require('../db/queries');
const { TABLES } = require('../utils/constants');

const loadPlanets = new DataLoader(async (ids) => {
  const planets = await queries.selectFromTable(TABLES.PLANET, {ids: ids});
  return ids.map(id => planets.find(planet => planet.id === id));
});

const loadSpaceCenters = new DataLoader(async (ids) => {
  const spaceCenters = await queries.selectFromTable(TABLES.SPACE_CENTER, {ids: ids});
  return ids.map(id => spaceCenters.find(spaceCenter => spaceCenter.id === id));
});

const loadFlights = new DataLoader(async (ids) => {
  const flights = await queries.selectFromTable(TABLES.FLIGHT, {ids: ids});
  return ids.map(id => flights.find(flight => flight.id === id));
});

module.exports = {
  loadPlanets,
  loadSpaceCenters,
  loadFlights,
};