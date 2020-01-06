CREATE database IF NOT EXISTS reservations;
CREATE TABLE users (
  user_id              SERIAL PRIMARY KEY,
  username             VARCHAR(100) NOT NULL,
  rating               VARCHAR(20) NOT NULL
); 

CREATE TABLE homes (
  home_id              SERIAL PRIMARY KEY,
  title                VARCHAR(100) NOT NULL,
  priceperadult        VARCHAR(20) NOT NULL,
  priceperchild        VARCHAR(20) NOT NULL,
  cleaningfee          VARCHAR(20) NOT NULL,
  rating               VARCHAR(20) NOT NULL,
  ratingcount          VARCHAR(20) NOT NULL,
  host_id              INTEGER NOT NULL,
  -- FOREIGN KEY (host_id) REFERENCES users (user_id)
);

CREATE TABLE reservations (
  start_date           DATE,
  end_date             DATE,
  home_id              INTEGER,
  adultcount           INTEGER,
  childrencount        INTEGER,
  infantcount          INTEGER,
  user_id              INTEGER,
  amountpaid           VARCHAR(10) NOT NULL,
  amountowed           VARCHAR(10) NOT NULL,
  -- FOREIGN KEY (home_id) REFERENCES homes (home_id)
);

-- base price multiplier ?
-- review table ?
