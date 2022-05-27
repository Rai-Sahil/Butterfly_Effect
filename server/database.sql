CREATE DATABASE IF NOT EXISTS COMP2800;

CREATE TABLE IF NOT EXISTS BBY_32_USER (
      id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
      uuid varchar(40) DEFAULT (uuid()) NOT NULL,
      name varchar(30),
      email varchar(30),
      password varchar(60),
      role enum('user', 'admin') NOT NULL
    );

CREATE TABLE IF NOT EXISTS QUESTION (
      id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
      question varchar(300)
    );

CREATE TABLE IF NOT EXISTS CHOICE (
      id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
      question_id int NOT NULL,
      text varchar(100),
      env_pt int(10),
      com_pt int(10),
      FOREIGN KEY (question_id) REFERENCES QUESTION(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS PLAYTHROUGH (
      id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
      is_complete bool DEFAULT FALSE NOT NULL,
      user_id int NOT NULL,
      current_question_id int,
      FOREIGN KEY (user_id) REFERENCES BBY_32_USER(id) ON DELETE CASCADE
      );

CREATE TABLE IF NOT EXISTS PLAYTHROUGH_QUESTION (
      id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
      playthrough_id int NOT NULL,
      question_id int NOT NULL,
      selected_choice_id int,
      FOREIGN KEY (playthrough_id) REFERENCES PLAYTHROUGH(id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES QUESTION(id) ON DELETE CASCADE,
      FOREIGN KEY (selected_choice_id) REFERENCES CHOICE(id) ON DELETE CASCADE
    );

ALTER TABLE PLAYTHROUGH ADD CONSTRAINT FK_PTQ
    FOREIGN KEY (current_question_id)
    REFERENCES PLAYTHROUGH_QUESTION (id)
    ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS ENDING (
      id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
      type enum('comfort', 'environment') NOT NULL,
      threshold int NOT NULL,
      text varchar(500)
    );

ALTER TABLE ENDING ADD CONSTRAINT UQ_type_threshold UNIQUE(type, threshold);

CREATE TABLE IF NOT EXISTS EARNED_ENDING (
      id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
      user_id int NOT NULL,
      playthrough_id int NOT NULL,
      ending_id int NOT NULL,
      earned_points int NOT NULL,
      FOREIGN KEY (user_id) REFERENCES BBY_32_USER(id) ON DELETE CASCADE,
      FOREIGN KEY (playthrough_id) REFERENCES PLAYTHROUGH(id) ON DELETE CASCADE,
      FOREIGN KEY (ending_id) REFERENCES ENDING(id) ON DELETE CASCADE
    );

INSERT INTO BBY_32_USER (name, email, password, role) values ('Thomas Anderson', 'admin@bby32.com', '$2b$10$brlF4KV5EsZS4I4BcX2Ve.YbYWUxrey.15xdnmfTpAFUDwfx9Cq.i', 'admin'), ('John Doe', 'user@bby32.com', '$2b$10$3sS.9GF2ZEe.uSyFlrAso.Tn2x.Y7wLr2cPaYTutuJ4gfcj4WTNxO', 'user');
INSERT INTO QUESTION (question) values ('Your old incandescent screw-in lightbulb just went out! You’re going to need to replace that asap. Pick a light bulb to use:'), ('Your clothes are starting to smell, must be laundry day soon. Good thing you have your own laundry machine at home, pick the temperature that best .'), ('Incoming heatwave! Time to bust out the A/C..right?'), ('Time to take out the trash. You just finished a 6 pack of coca cola (cans) and 2 bottles of jones (glass bottle) earlier, how should you dispose of these?'), ('You visited the local grocery store looking for a few things you could carry on your way home. Looks like you’re going to need more bags than you thought. Plastic bags are plentiful and look easy but there are some reusable bags sitting right next to you in the aisle. What should you do?'), ('You’re walking back to your home after the grocery store. You see some students trying to throw the trash into a trash bin like a basketball but missing. You’ve noticed there’s garbage all around it, what should you do?'), ('After a long day you’re feeling thirsty. What should you do?'), ('Time to go to school. Your friend also goes to the same school and around the same time too! How should you get to school on time?'), ('You had a great fried chicken dinner, and now left with tons of oil in the fryer. How do you throw it away?'), ('When recycling a plastic water bottle, should you take off the cap and recycle it separately?'), ('When recycling bottles, should you flatten it before throwing it out?'), ('Oops, you just broke a glass jar! How do you clean it up?'), ('You are at the residential recycling area, what seems incorrect?'), ('*stomach growls*~ Sounds like you’re hungry. You open the fridge and find 2 options, steak and chicken. What should you choose?'), ('Time to pick some milk for your cereal!'), ('As you pass by your bathroom, you notice your roommate didn’t turn off the sink tap all the way and it’s dripping water, what should you do?'), ('Your closet is getting full and you don’t really fit your old clothes anymore.'), ('Winter’s rolling around and the weather seems to be colder every year, always breaking records! What should you do?'), ('You received an email about your city hosting a town hall meeting on what your local representatives can do to help, what should you speak about?'), ('Waking up on a cold morning you decide you need to warm up, a shower seems like a great idea to warm up! How long should you shower for?'), ('As of lately you’ve been hearing the words meat and climate change used a lot in the same sentences, you come to think it might be about time for a change in your diet, what should you do?'), ('Companies are releasing new clothing lines every 3 months, you notice some brands have increasingly become aware of sustainability efforts. How would you check to see if a company is using sustainable materials?');
INSERT INTO CHOICE (question_id, text, env_pt, com_pt) values (1, 'Incandescent lightbulb', -5, 5), (1, 'LED light bulbs', 5, -5), (2, 'Warm water', -5, 5), (2, 'Cold water', 5, -5), (3, 'It’s hot, blast the A/C!', -10, 10), (3, 'Time to pull out the standing fan', -5, 5), (3, 'Fill a spray bottle with cool or room-temp water. Spritz your skin as needed', 5, 5), (3, 'It’s really hot, 2 A/C’s..?', -20, 15), (4, 'Recycling depot', 10, 5), (4, 'Throw it in the main garbage bin', 0, 10), (5, 'Plastic Bags! As many as you can load up!', -10, 5), (5, 'Forget it, carry everything home', 5, -5), (5, 'Buy some reusable bags', 5, 5), (5, 'Don’t buy anything, you forgot your wallet', 0, -5), (6, 'Yell “pick that up!”', 5, -5), (6, 'Go over, pick it up and throw it into the trash bin', 5, 5), (6, 'Ignore it and keep walking', -5, -5), (6, 'Throw something in the bin from a distance like the students', -5, 10), (7, 'You see the 12 pack of water bottles you bought, take one', -5, 5), (7, 'Use a reusable water bottle', 5, 5), (8, 'Car pool!', 5, 5), (8, 'Take your own car', -5, 5), (8, "Forget school, that\'s boring", 0, 10), (8, 'Walk', 10, 5), (9, 'Dump it in the sink', -5, 5), (9, 'Pour it down the toilet', -5, 5), (9, 'Pour it into a nonrecyclable container and throw it away in the garbage', 5, 5), (9, 'Pour it into a food waste container and throw it away in the organics', 5, 5), (10, 'Yes', 5, 5), (10, 'No', 10, 5), (11, 'Yes', 5, 5), (11, 'No', 10, 5), (12, 'Wrap it with a newspaper and put it into the general bin', 10, 5), (12, 'Wrap it with a newspaper and put it into the glass bin', 5, 5), (12, 'Sweep it with a broom and throw it into the general bin', -10, 5), (12, 'Sweep it with a broom and put it into the glass bin', -5, 5), (13, 'Throwing plain shredded paper in the compost bin', -5, -5), (13, 'Emptying the reusable shopping bag and only throwing away the recyclables', -5, -5), (13, 'Throwing the whole plastic bag with the recyclables in it', 5, 5), (13, 'Putting a greasy pizza box in the compost bin', -5, -5), (14, 'Steak', -10, 5), (14, 'Chicken', -5, 5), (15, '2% dairy milk', -5, 5), (15, 'Oat milk', 5, 5), (15, 'Skim milk', -5, 5), (15, 'Whole milk (3.25%)', -5, 5), (16, 'Turn it off', 10, 5), (16, 'Meh ~ it’s only dripping a little bit, not too bad!', -5, -5), (16, 'Put a glass under it, you’re going to be thirsty soon', 0, -5), (16, 'Walk away', -5, -5), (17, 'Throw out the old clothes!', -5, -5), (17, 'Donate them!', 5, 5), (17, 'Throw them under your bed', 0, -5), (17, 'Stack your new clothes on top of the old ones', 0, -10), (18, 'Blast that heater!!', -10, 10), (18, 'Hot tub!', -5, 10), (18, 'Pretend like it’s still warm outside, -5* ain’t so bad', 0, -10), (18, 'Put on another layer!', 5, 5), (19, 'Gas is way too expensive', 0, 5), (19, 'Bring up topics like carbon tax', 5, -5), (19, 'Yell they’re not doing their jobs right', 0, 5), (19, 'Tell them about your crazy neighbor who you think is spying on you', 0, -5), (20, 'Quick shower, in and out!', 5, 5), (20, 'Long hot shower, should warm you right up!', -5, 10), (20, 'Not too long, not too short', 5, 5), (20, 'Don’t bother showering, no need', 0, -5), (21, 'No thanks, meat eater for life :D', -10, 5), (21, 'Switch to beyond meat', 5, -5), (21, 'Go full on vegan', 10, -5), (21, 'Vegetarian??', 5, -5), (22, 'Check the materials', 5, 5), (22, 'Buy cashmere, that’s soft', -5, 10), (22, 'Start looking for a green sign', 5, 5), (22, 'Ask the store directly', 0, 0);
INSERT INTO ENDING (type, threshold, text) values ('comfort', 0, 'You have sacrificed a lot to save earth and the world! As long as it does not lower your happiness too much, keep up the good work! You are the part of the solution.'), ('comfort', 50, 'You reasonably compromised between your living comfort and care for earth. Remember. Small changes make a big difference. Look for more changes you can make for the better future.'), ('comfort', 100, 'It is time to take action for climate change. Living comfort that you are enjoying right now might not be available within few years. To keep our happy life, we need to make some small changes in our daily life choices. Is there anything you can help to mitigate climate change?'), ('environment', 0, 'Earth is in danger, and human race is also in danger. Sea level has risen tremendously with increased acidity. 60% of all fish species have been wiped out. The Maldives, Kiribati, Tuvalu, Solomon Islands, and more countries have sunk in the ocean. More frequent wildfires, longer periods of drought, intense tropical storms are happening. People are exposed to extreme heat waves every 5 years and are in risk of injury, disease, and death.'), ('environment', 50, 'It is not late to mitigate the climate change. Earth is still slowly going for the dead-end. Due to the research, we have about 10 years to cut emissions to avoid dire climate scenarios. Take the action now for our future.'), ('environment', 100, 'Earth is breathing. Overall risks have been lowered. As 196 countries signed and promised on Paris Agreement, we have successfully avoided more dire impacts of climate change by limiting global warming to well below 2° C (3.6° F)—or even 1.5° C.');
