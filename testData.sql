DELETE FROM admin_details;
DELETE FROM instructor_details;
DELETE FROM student_details;
DELETE FROM user_login;
DELETE FROM feedback_sets;
DELETE FROM course_details;

INSERT INTO rooms(room_id) VALUES ('ALH-1');
INSERT INTO rooms(room_id) VALUES ('ALH-2');
INSERT INTO rooms(room_id) VALUES ('B512');
INSERT INTO rooms(room_id) VALUES ('A101');
INSERT INTO rooms(room_id) VALUES ('A117');

INSERT INTO slots(slot_id) VALUES ('A');
INSERT INTO slots(slot_id) VALUES ('B');
INSERT INTO slots(slot_id) VALUES ('C');
INSERT INTO slots(slot_id) VALUES ('D');
INSERT INTO slots(slot_id) VALUES ('E');
INSERT INTO slots(slot_id) VALUES ('F');
INSERT INTO slots(slot_id) VALUES ('G');
INSERT INTO slots(slot_id) VALUES ('H');

INSERT INTO grades(grade) VALUES('A');
INSERT INTO grades(grade) VALUES('A-');
INSERT INTO grades(grade) VALUES('B');
INSERT INTO grades(grade) VALUES('B-');
INSERT INTO grades(grade) VALUES('C');
INSERT INTO grades(grade) VALUES('C-');
INSERT INTO grades(grade) VALUES('D');
INSERT INTO grades(grade) VALUES('D-');
INSERT INTO grades(grade) VALUES('F');


INSERT INTO batches(batch_id, department, year, batch) VALUES ('CS21BTECH', 'CS', '21', 'BTECH');
INSERT INTO batches(batch_id) VALUES ('FA');
INSERT INTO batches(batch_id) VALUES ('AD');

INSERT INTO user_login(user_id, user_name, password, user_mail, user_type) values ('AD01', 'Admin A', '123123', 'hello022004@gmail.com', 'AD');
INSERT INTO admin_details values ('AD01', 'Admin A', 1);

INSERT INTO user_login(user_id, user_name, password, user_mail, user_type) values ('CS21BTECH11013', 'Hema Sri', '123123', 'hello022004@gmail.com', 'ST');
INSERT INTO student_details values ('CS21BTECH11013', 'Hema Sri', '6', 'CS', 'CS21BTECH', 9, 1);


INSERT INTO user_login(user_id, user_name, password, user_mail, user_type) values ('CS21BTECH11012', 'Akshay', '123123', 'hello022004@gmail.com', 'ST');
INSERT INTO student_details values ('CS21BTECH11012', 'Akshay', '6', 'CS', 'CS21BTECH', 9, 1);


INSERT INTO user_login(user_id, user_name, password, user_mail, user_type) values ('FA001', 'Faculty A', '123123', 'hello022004@gmail.com', 'FA');
INSERT INTO instructor_details values ('FA001', 'Faculty A', 'CS', 'phD in CS', 1, 'FA');

INSERT INTO user_login(user_id, user_name, password, user_mail, user_type) values ('FA002', 'Faculty B', '123123', 'hello022004@gmail.com', 'FA');
INSERT INTO instructor_details values ('FA002', 'Faculty B', 'CS', 'phD in CS', 1, 'FA');

INSERT INTO feedback_sets(set_name) values ('SET A');
INSERT INTO feedback_responses(course_id, feedback_set_id) VALUES ('C001', 1);
INSERT INTO feedback_responses(course_id, feedback_set_id) VALUES ('C001', 1);
INSERT INTO course_details (
    course_id,
    course_name,
    instructor_name,
    instructor_id,
    slot,
    room,
    credits,
    max_students,
    student_count,
    course_description,
    course_syllabus,
    prereq_cids,
    eligible_batches,
    start_time,
    end_time,
    feedback_set_id,
    feedback_response_id,
    current_log_id
) VALUES (
    'C001',
    'Introduction to Programming',
    'Faculty A',
    'FA001',
    'A',
    'ALH-1',
    3,
    30,
    0,
    'This course provides an introduction to programming concepts.',
    'Link to course syllabus',
    ARRAY['P001', 'P002'],
    ARRAY['B001', 'B002'],
    '2024-05-01',
    '2024-08-01',
    1,
    1,
    1
);


INSERT INTO course_log (
	course_id,
	isActive,
	start_time,
	end_time,
	instructor_id,
	instructor_name,
	feedback_response_id
) VALUES (
	'C001',
	1,
	'2021-05-13',
	'2021-08-13',
	'FA002',
	'Faculty B',
	1
);

INSERT INTO course_log (
	course_id,
	isActive,
	start_time,
	end_time,
	instructor_id,
	instructor_name,
	feedback_response_id
) VALUES (
	'C001',
	0,
	'2021-05-13',
	'2021-08-13',
	'FA002',
	'Faculty B',
	2
);

INSERT INTO instructor_courses(course_log_id, instructor_id, course_id, status) VALUES (1, 'FA001', 'C001', 1);
INSERT INTO electives(student_id) VALUES ('CS21BTECH11013');
INSERT INTO electives(student_id) VALUES ('CS21BTECH11012');

INSERT INTO student_courses (course_log_id, student_id, course_id, status, type, credits) VALUES (1, 'CS21BTECH11013', 'C001', 0, 'elective_A', 3);
INSERT INTO student_courses (course_log_id, student_id, course_id, status, type, credits) VALUES (1, 'CS21BTECH11012', 'C001', 0, 'elective_A', 3);


INSERT INTO feedback_sets(set_name, 
	q1,
	q2,
	q3,
	q4,
	q5,
	q6,
	q7,
	q8,
	q9,
	q10
) VALUES (
	'set A',
	'ABCD',
	'EFGH',
	'ABCD',
	'EFGH',
	'1234',
	'5678',
	'1234',
	'5678',
	'xyz',
	'pqr'
);

INSERT INTO feedback_sets(set_name, 
	q1,
	q2,
	q3,
	q4,
	q5,
	q6,
	q7,
	q8,
	q9,
	q10
) VALUES (
	'set B',
	'ABCD',
	'EFGH',
	'ABCD',
	'EFGH',
	'1234',
	'5678',
	'1234',
	'5678',
	'xyz',
	'pqr'
);
