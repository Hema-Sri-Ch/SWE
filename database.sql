DROP DATABASE IF EXISTS swe;
CREATE DATABASE swe;
\c swe

-- drop pre existed tables to prevent conflicts
DROP TABLE IF EXISTS batches;
DROP TABLE IF EXISTS user_login;
DROP TABLE IF EXISTS student_details;
DROP TABLE IF EXISTS instructor_details;
DROP TABLE IF EXISTS admin_details;
DROP TABLE IF EXISTS feedback_sets;
DROP TABLE IF EXISTS course_details;
DROP TABLE IF EXISTS feedback_responses;
DROP TABLE IF EXISTS electives;
DROP TABLE IF EXISTS student_courses;
DROP TABLE IF EXISTS instructor_courses;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS receivers;
DROP TABLE IF EXISTS course_log;
DROP TABLE IF EXISTS custom_access_log;
DROP TABLE IF EXISTS slots;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS grades;

-- grades table
CREATE TABLE grades(
	grade VARCHAR(5) UNIQUE NOT NULL,
	PRIMARY KEY(grade)
);


-- slots table
CREATE TABLE slots(
	slot_id VARCHAR(10) UNIQUE NOT NULL,
	start_time VARCHAR(10),
	end_time VARCHAR(10),
	PRIMARY KEY(slot_id)
);

-- rooms table
CREATE TABLE rooms(
	room_id VARCHAR(10) UNIQUE NOT NULL,
	PRIMARY KEY(room_id)
);

-- batch a user could possible belong to
CREATE TABLE batches(
	batch_id VARCHAR(10) UNIQUE NOT NULL,
	department VARCHAR(50) DEFAULT 'NONE',
	year INT DEFAULT 24 ,
	batch VARCHAR(50) DEFAULT 'NONE', --btech or mtech
	PRIMARY KEY(batch_id)
);

--user login table for user authentication
CREATE TABLE user_login (
	user_id VARCHAR(50) UNIQUE NOT NULL,
	user_name VARCHAR(50) NOT NULL,
	password VARCHAR(255) NOT NULL,
	user_mail VARCHAR(50) NOT NULL,
	user_type VARCHAR(50) NOT NULL,
	PRIMARY KEY(user_id, user_name)
);


-- user details table (more attributes can be added, this is just a rough estimate)
CREATE TABLE student_details(
	user_id VARCHAR(50) UNIQUE NOT NULL,
	user_name VARCHAR(50) NOT NULL,
	semester VARCHAR(50) DEFAULT 1,
	department VARCHAR(50),
	batch VARCHAR(50),
	CGPA INTEGER DEFAULT 0,
	isActive INTEGER DEFAULT 1,
	PRIMARY KEY(user_id),
	FOREIGN KEY (user_id, user_name) REFERENCES user_login (user_id, user_name),
	FOREIGN KEY (batch) REFERENCES batches(batch_id)
);

CREATE TABLE instructor_details(
	user_id VARCHAR(50) UNIQUE NOT NULL,
	user_name VARCHAR(50) NOT NULL,
	department VARCHAR(50),
	qualification VARCHAR(100),
	isActive INTEGER DEFAULT 1,
	batch VARCHAR(50) DEFAULT 'FA',
	PRIMARY KEY(user_id, user_name),
	FOREIGN KEY(user_id, user_name) REFERENCES user_login (user_id, user_name),
	FOREIGN KEY (batch) REFERENCES batches(batch_id)
);

CREATE TABLE admin_details(
	user_id VARCHAR(50) UNIQUE NOT NULL,
	user_name VARCHAR(50) NOT NULL,
	isActive INTEGER DEFAULT 1,
	batch VARCHAR(50) DEFAULT 'AD',
	PRIMARY KEY(user_id),
	FOREIGN KEY(user_id, user_name) REFERENCES user_login (user_id, user_name),
	FOREIGN KEY(batch) REFERENCES batches(batch_id)
);

-- feedback question sets
CREATE TABLE feedback_sets(
	id SERIAL NOT NULL,
	set_name VARCHAR(50) UNIQUE NOT NULL,
	q1 VARCHAR(255) DEFAULT 'N/A',
	q2 VARCHAR(255) DEFAULT 'N/A',
	q3 VARCHAR(255) DEFAULT 'N/A',
	q4 VARCHAR(255) DEFAULT 'N/A',
	q5 VARCHAR(255) DEFAULT 'N/A',
	q6 VARCHAR(255) DEFAULT 'N/A',
	q7 VARCHAR(255) DEFAULT 'N/A',
	q8 VARCHAR(255) DEFAULT 'N/A',
	q9 VARCHAR(255) DEFAULT 'N/A',
	q10 VARCHAR(255) DEFAULT 'N/A',	
	PRIMARY KEY (id)
);


-- feedback response log
-- extract feedback responses for current running course
CREATE TABLE feedback_responses(
	id SERIAL NOT NULL,
	course_id VARCHAR(10),
	feedback_set_id INTEGER DEFAULT 0,
	question1 INTEGER[] DEFAULT ARRAY_FILL(0, ARRAY[5]),
	question2 INTEGER[] DEFAULT ARRAY_FILL(0, ARRAY[5]),
	question3 INTEGER[] DEFAULT ARRAY_FILL(0, ARRAY[5]),
	question4 INTEGER[] DEFAULT ARRAY_FILL(0, ARRAY[5]),
	question5 INTEGER[] DEFAULT ARRAY_FILL(0, ARRAY[5]),
	question6 INTEGER[] DEFAULT ARRAY_FILL(0, ARRAY[5]),
	question7 INTEGER[] DEFAULT ARRAY_FILL(0, ARRAY[5]),
	question8 INTEGER[] DEFAULT ARRAY_FILL(0, ARRAY[5]),
	question9 INTEGER[] DEFAULT ARRAY_FILL(0, ARRAY[5]),
	question10 INTEGER[] DEFAULT ARRAY_FILL(0, ARRAY[5]),
	-- FOREIGN KEY (feedback_set_id) REFERENCES feedback_sets(id),
	PRIMARY KEY (id)
);


-- course details, 
-- used to extract details of given course, 
-- used to extract list of available courses
-- current_log_id would be initially set to the id number of the newly created course_log
-- then eventually updated to next numbers of nextly created course_logs for this course
-- Update course_log whenever course_details is modified
CREATE TABLE course_details (
	course_id VARCHAR(50) NOT NULL,
	course_name VARCHAR(255),
	instructor_name VARCHAR(50),
	instructor_id VARCHAR(50),
	slot VARCHAR(50),
	room VARCHAR(50),
	credits INT DEFAULT 3,
	max_students INT DEFAULT 30,
	student_count INT DEFAULT 0,
	course_description VARCHAR(255) DEFAULT 'N/A',
	course_syllabus VARCHAR(255) DEFAULT 'N/A',
	prereq_cids VARCHAR(20)[],
	eligible_batches VARCHAR(20)[],
	start_time DATE,
	end_time DATE,
	feedback_set_id INTEGER,
	feedback_response_id INTEGER,
	current_log_id INTEGER,
	status INTEGER DEFAULT 0, -- 1 is Active; 0 is inActive
	PRIMARY KEY (course_id),
	FOREIGN KEY (instructor_id, instructor_name) REFERENCES instructor_details(user_id, user_name),
	FOREIGN KEY (room) REFERENCES rooms(room_id),
	FOREIGN KEY (slot) REFERENCES slots(slot_id),
	FOREIGN KEY (feedback_set_id) REFERENCES feedback_sets(id),
	FOREIGN KEY (feedback_response_id) REFERENCES feedback_responses(id)
);


-- messages (sender side details)
CREATE TABLE messages (
	msg_id SERIAL NOT NULL,
	msg_head VARCHAR(255),
	message VARCHAR(255),
	user_id VARCHAR(50) NOT NULL,
	time TIMESTAMP,
	PRIMARY KEY(msg_id)
	-- FOREIGN KEY(user_id) REFERENCES user_login(user_id)
);

-- receiver id to message id map (to prevent repition of message text sent to group)
CREATE TABLE receivers (
	msg_id INT NOT NULL,
	user_id VARCHAR(50) NOT NULL,
	PRIMARY KEY(msg_id, user_id),
	FOREIGN KEY(msg_id) REFERENCES messages(msg_id)
	-- FOREIGN KEY(user_id) REFERENCES user_login(user_id)
);


-- student elective details, 
-- used to extract details of no. of credits completed under each elective of given student
CREATE TABLE electives(
	student_id VARCHAR(50) NOT NULL,
	elective_A INTEGER DEFAULT 0,
	elective_B INTEGER DEFAULT 0,
	elective_C INTEGER DEFAULT 0,
	elective_D INTEGER DEFAULT 0,
	PRIMARY KEY(student_id),
	FOREIGN KEY(student_id) REFERENCES student_details (user_id)
);



-- To be updated right after a course is marked a completed (graded)
-- stores the course history
-- previous instructors
-- previous course start and end times
-- previous course feedback responses
-- previous course enrollers
-- <REMOVED SOME FOREIGN KEY CONSTRAINTS> to retain information even after deletion of instructor
-- modified when course is activated, graded(completed), deactivated
CREATE TABLE course_log(
	log_id SERIAL NOT NULL,
	course_id VARCHAR(50),
	isActive INT DEFAULT 1, -- may be not required
	start_time DATE,
	end_time DATE,
	instructor_id VARCHAR(50),
	instructor_name VARCHAR(50),
	feedback_response_id INTEGER,
	PRIMARY KEY(log_id),
	-- FOREIGN KEY(course_id) REFERENCES course_details(course_id),
	-- FOREIGN KEY(instructor_id, instructor_name) REFERENCES instructor_details (user_id, user_name),
	FOREIGN KEY (feedback_response_id) REFERENCES feedback_responses (id)
);


-- instructor course table, contains list of course ids and instructor ids
-- used to extract courses list taught by given instructor (completed and running)
-- modified when course is created or when course is updated (no need for course-id constraint)
CREATE TABLE instructor_courses(
	course_log_id INTEGER,
	course_id VARCHAR(50),
	instructor_id VARCHAR(50),
	start_time VARCHAR(50),
	end_time VARCHAR(50),
	status INTEGER DEFAULT 1,
	FOREIGN KEY(course_log_id) REFERENCES course_log(log_id),
	FOREIGN KEY(instructor_id) REFERENCES instructor_details(user_id)
	-- FOREIGN KEY(course_id) REFERENCES course_details(course_id)
);


-- student course table
-- used to extract registered courses of a given student(completed and running)
-- used to extract registered students of a given course and its status(say running)
-- used to extract grades information
-- status = course completion status = grade allocation status
-- status changes from -1 to 0 when the registration period completeds
CREATE TABLE student_courses(
	course_log_id INTEGER,
	course_id VARCHAR(50),
	student_id VARCHAR(50),
	start_time DATE,
	end_time DATE,
	slot VARCHAR(50),
	room VARCHAR(50),
	type VARCHAR(50),
	credits INT,
	status INT, -- 0: running; -1: freshly registered course; 1:completed course 
	grade VARCHAR(50) DEFAULT 'N/A',
	FOREIGN KEY(course_log_id) REFERENCES course_log(log_id)
	-- rFOREIGN KEY(student_id) REFERENCES student_details(user_id),
	-- FOREIGN KEY(course_id) REFERENCES course_details(course_id)
);





-- action type ==> 1:Course Registration; 2: Feedback Submission; 3:Grade Submission
CREATE TABLE custom_access_log(
	log_id SERIAL NOT NULL,
	actionType INT,
	start_time TIMESTAMP,
	end_time TIMESTAMP,
	batch_id VARCHAR(10),
	PRIMARY KEY(log_id),
	FOREIGN KEY(batch_id) REFERENCES batches(batch_id)
);
