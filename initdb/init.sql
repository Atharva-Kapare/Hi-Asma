-- Create COMPETITION table
CREATE TABLE COMPETITION (
    competition_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);

-- Create DIVISION table
CREATE TABLE DIVISION (
    division_id SERIAL PRIMARY KEY,
    competition_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (competition_id) REFERENCES COMPETITION(competition_id)
);

-- Create TEAM table
CREATE TABLE TEAM (
    team_id SERIAL PRIMARY KEY,
    division_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (division_id) REFERENCES DIVISION(division_id)
);

-- Create PLAYER table
CREATE TABLE PLAYER (
    player_id SERIAL PRIMARY KEY,
    team_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    matches_played INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (team_id) REFERENCES TEAM(team_id)
);

-- Create MATCH table
CREATE TABLE MATCH (
    match_id SERIAL PRIMARY KEY,
    division_id INTEGER NOT NULL,
    match_date DATE NOT NULL,
    match_round VARCHAR(50) NOT NULL,
    FOREIGN KEY (division_id) REFERENCES DIVISION(division_id)
);

-- Create MATCH_TEAM table
CREATE TABLE MATCH_TEAM (
    match_id INTEGER,
    team_id INTEGER,
    PRIMARY KEY (match_id, team_id),
    FOREIGN KEY (match_id) REFERENCES MATCH(match_id),
    FOREIGN KEY (team_id) REFERENCES TEAM(team_id)
);

-- Create BORROWING_RESTRICTION table
CREATE TABLE BORROWING_RESTRICTION (
    restriction_id SERIAL PRIMARY KEY,
    borrowing BOOLEAN NOT NULL,
    borrow_from_all BOOLEAN NOT NULL
);

-- Create RESTRICTION_RELATION table
CREATE TABLE RESTRICTION_RELATION (
    restriction_id INTEGER,
    from_division_id INTEGER,
    to_division_id INTEGER,
    PRIMARY KEY (restriction_id, from_division_id, to_division_id),
    FOREIGN KEY (restriction_id) REFERENCES BORROWING_RESTRICTION(restriction_id),
    FOREIGN KEY (from_division_id) REFERENCES DIVISION(division_id),
    FOREIGN KEY (to_division_id) REFERENCES DIVISION(division_id)
);

-- Create FINALS_ELIGIBILITY table
CREATE TABLE FINALS_ELIGIBILITY (
    eligibility_id SERIAL PRIMARY KEY,
    division_id INTEGER NOT NULL,
    min_matches_required INTEGER NOT NULL,
    borrowed_players BOOLEAN NOT NULL,
    started_matches BOOLEAN NOT NULL,
    all_rounds BOOLEAN NOT NULL,
    FOREIGN KEY (division_id) REFERENCES DIVISION(division_id)
);

-- Create ELIGIBLE_ROUNDS table
CREATE TABLE ELIGIBLE_ROUNDS (
    eligibility_id INTEGER,
    match_id INTEGER,
    PRIMARY KEY (eligibility_id, match_id),
    FOREIGN KEY (eligibility_id) REFERENCES FINALS_ELIGIBILITY(eligibility_id),
    FOREIGN KEY (match_id) REFERENCES MATCH(match_id)
);