DROP DATABASE IF EXISTS swe;
CREATE DATABASE swe;
\c swe

-- drop pre existed tables to prevent conflicts
DROP TABLE IF EXISTS user_login;
DROP TABLE IF EXISTS student_details;
DROP TABLE IF EXISTS instructor_details;
DROP TABLE IF EXISTS admin_details;
DROP TABLE IF EXISTS feedback_sets;
DROP TABLE IF EXISTS course_details;
DROP TABLE IF EXISTS feedback_questions;
DROP TABLE IF EXISTS electives;
DROP TABLE IF EXISTS student_courses;
DROP TABLE IF EXISTS instructor_courses;

--user login table for user authentication

CREATE TABLE user_login (
	user_id VARCHAR(50) UNIQUE NOT NULL,
	user_name VARCHAR(50) NOT NULL,
	password VARCHAR(255) NOT NULL,
	user_type VARCHAR(50) NOT NULL,
	PRIMARY KEY(user_id, user_name)
);


-- user details table (more attributes can be added, this is just a rough estimate)
CREATE TABLE student_details(
	user_id VARCHAR(50) UNIQUE NOT NULL,
	user_name VARCHAR(50) NOT NULL,
	semester VARCHAR(50),
	department VARCHAR(50),
	CGPA INTEGER,
	PRIMARY KEY(user_id),
	FOREIGN KEY (user_id, user_name) REFERENCES user_login (user_id, user_name)
);

CREATE TABLE instructor_details(
	user_id VARCHAR(50) UNIQUE NOT NULL,
	user_name VARCHAR(50) NOT NULL,
	department VARCHAR(50),
	qualification VARCHAR(100),
	PRIMARY KEY(user_id, user_name),
	FOREIGN KEY(user_id, user_name) REFERENCES user_login (user_id, user_name)
);

CREATE TABLE admin_details(
	user_id VARCHAR(50) NOT NULL,
	user_name VARCHAR(50) NOT NULL,
	PRIMARY KEY(user_id),
	FOREIGN KEY(user_id, user_name) REFERENCES user_login (user_id, user_name)
);

-- feedback question sets
CREATE TABLE feedback_sets(
	id SERIAL NOT NULL,
	set_name VARCHAR(50) UNIQUE NOT NULL,
	PRIMARY KEY (id)
);

-- course details, 
-- used to extract details of given course, 
-- used to extract list of available courses
CREATE TABLE course_details (
	course_id VARCHAR(50) NOT NULL,
	course_name VARCHAR(255),
	instructor_name VARCHAR(50),
	instructor_id VARCHAR(50),
	slot VARCHAR(50),
	credits VARCHAR(50),
	course_description VARCHAR(255),
	course_syllabus VARCHAR(255),
	start_time VARCHAR(50),
	end_time VARCHAR(50),
	feedback_set_id INTEGER,
	PRIMARY KEY (course_id),
	FOREIGN KEY (instructor_id, instructor_name) REFERENCES instructor_details(user_id, user_name),
	FOREIGN KEY (feedback_set_id) REFERENCES feedback_sets (id)
);

-- feedback questions (All quetions from all feedback sets are stored in this table)
-- used to extract questions of a feedback set, given feedback id
CREATE TABLE feedback_questions(
	question_id SERIAL NOT NULL,
	feedback_set_id INTEGER NOT NULL,
	question VARCHAR(255),
	PRIMARY KEY(question_id),
	FOREIGN KEY(feedback_set_id) REFERENCES feedback_sets(id)
);


-- student elective details, 
-- used to extract details of no. of credits completed under each elective of given student
CREATE TABLE electives(
	student_id VARCHAR(50) NOT NULL,
	elective_A INTEGER,
	elective_B INTEGER,
	elective_C INTEGER,
	elective_D INTEGER,
	PRIMARY KEY(student_id),
	FOREIGN KEY(student_id) REFERENCES student_details (user_id)
);


-- instructor course table, contains list of course ids and instructor ids
-- used to extract courses list taught by given instructor (completed and running)
CREATE TABLE instructor_courses(
	course_id VARCHAR(50),
	instructor_id VARCHAR(50),
	start_time VARCHAR(50),
	end_time VARCHAR(50),
	status VARCHAR(50),
	FOREIGN KEY(instructor_id) REFERENCES instructor_details(user_id),
	FOREIGN KEY(course_id) REFERENCES course_details(course_id)
);


-- student course table
-- used to extract registered courses of a given student(completed and running)
-- used to extract registered students of a given course and its status(say running)
-- used to extract grades information
CREATE TABLE student_courses(
	course_id VARCHAR(50),
	student_id VARCHAR(50),
	start_time VARCHAR(50),
	end_time VARCHAR(50),
	status VARCHAR(50),
	grade VARCHAR(50),
	FOREIGN KEY(student_id) REFERENCES student_details(user_id),
	FOREIGN KEY(course_id) REFERENCES course_details(course_id)
);
