const { faker } = require('@faker-js/faker');
const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

// Helper function to generate random date within a range
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to generate random integer within a range
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate competition data
async function generateCompetition() {
  const competitionNames = [
    'Australian Football League',
    'National Rugby League',
    'A-League',
    'Big Bash League',
    'National Basketball League',
  ];
  const name = faker.helpers.arrayElement(competitionNames);
  const startDate = randomDate(new Date(2024, 0, 1), new Date(2024, 2, 31));
  const endDate = randomDate(new Date(2024, 9, 1), new Date(2024, 11, 31));

  const query = 'INSERT INTO COMPETITION (name, start_date, end_date) VALUES ($1, $2, $3) RETURNING competition_id';
  const result = await pool.query(query, [name, startDate, endDate]);
  return result.rows[0].competition_id;
}

// Generate division data
async function generateDivisions(competitionId) {
  const divisionAges = ['U12', 'U15', 'U18', 'U21', 'Open'];
  const divisions = [];

  for (const age of divisionAges) {
    const query = 'INSERT INTO DIVISION (competition_id, name) VALUES ($1, $2) RETURNING division_id';
    const result = await pool.query(query, [competitionId, age]);
    divisions.push(result.rows[0].division_id);
  }

  return divisions;
}

// Generate team data
async function generateTeams(divisionIds) {
  const cityPrefixes = ['Western', 'Eastern', 'Northern', 'Southern', 'Central'];
  const citySuffixes = ['Tigers', 'Sharks', 'Eagles', 'Bulldogs', 'Magpies', 'Hawks', 'Storm', 'Broncos', 'Roosters'];
  const teams = [];

  for (const divisionId of divisionIds) {
    for (let i = 0; i < 10; i++) {
      const teamName = `${faker.helpers.arrayElement(cityPrefixes)} ${faker.location.city()} ${faker.helpers.arrayElement(citySuffixes)}`;
      const query = 'INSERT INTO TEAM (division_id, name) VALUES ($1, $2) RETURNING team_id';
      const result = await pool.query(query, [divisionId, teamName]);
      teams.push(result.rows[0].team_id);
    }
  }

  return teams;
}

// Generate player data
async function generatePlayers(teamIds) {
  for (const teamId of teamIds) {
    for (let i = 0; i < 20; i++) {
      const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
      const matchesPlayed = randomInt(0, 30);
      const query = 'INSERT INTO PLAYER (team_id, name, matches_played) VALUES ($1, $2, $3)';
      await pool.query(query, [teamId, name, matchesPlayed]);
    }
  }
}

// Generate match data
async function generateMatches(divisionIds) {
  const rounds = ['R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9', 'R10'];

  for (const divisionId of divisionIds) {
    for (let i = 0; i < 50; i++) {
      const matchDate = randomDate(new Date(2024, 0, 1), new Date(2024, 11, 31));
      const matchRound = faker.helpers.arrayElement(rounds);
      const query = 'INSERT INTO MATCH (division_id, match_date, match_round) VALUES ($1, $2, $3)';
      await pool.query(query, [divisionId, matchDate, matchRound]);
    }
  }
}

// Main function to run the seeding process
async function seedDatabase() {
  try {
    const competitionId = await generateCompetition();
    const divisionIds = await generateDivisions(competitionId);
    const teamIds = await generateTeams(divisionIds);
    await generatePlayers(teamIds);
    await generateMatches(divisionIds);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await pool.end();
  }
}

seedDatabase();