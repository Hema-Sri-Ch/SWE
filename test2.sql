


-- add some active courses
INSERT INTO feedback_responses(course_id, feedback_set_id) VALUES ('E001', 1);
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
    start_time,
    end_time,
    feedback_set_id,
    feedback_response_id,
    current_log_id
) VALUES (
    'E001',
    'Introduction to Electronics',
    'Faculty A',
    'FA001',
    'B',
    'ALH-1',
    3,
    30,
    0,
    'This course provides an introduction to programming concepts.',
    'Link to course syllabus',
    '2024-05-01',
    '2024-08-01',
    1,
    3,
    3
);

INSERT INTO course_log(course_id, instructor_id, instructor_name, feedback_response_id) VALUES ('E001', 'FA001', 'Faculty A', 3);

INSERT INTO instructor_courses (course_log_id, course_id, instructor_id) VALUES (3, 'E001', 'FA001');

INSERT INTO feedback_responses(course_id, feedback_set_id) VALUES ('H001', 1);
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
    start_time,
    end_time,
    feedback_set_id,
    feedback_response_id,
    current_log_id
) VALUES (
    'H001',
    'Introduction to History',
    'Faculty B',
    'FA002',
    'A',
    'ALH-2',
    3,
    30,
    0,
    'This course provides an introduction to programming concepts.',
    'Link to course syllabus',
    '2024-05-01',
    '2024-08-01',
    1,
    4,
    4
);


INSERT INTO course_log(course_id, instructor_id, instructor_name, feedback_response_id) VALUES ('H001', 'FA002', 'Faculty B', 4);

INSERT INTO instructor_courses (course_log_id, course_id, instructor_id) VALUES (4, 'H001', 'FA002');

INSERT INTO course_details(
	course_id,
	instructor_id,
	instructor_name,
	credits,
	status
) VALUES (
	'A101',
	'FA002',
	'Faculty B',
	5,
	0
);


INSERT INTO course_details(
	course_id,
	instructor_id,
	instructor_name,
	credits,
	status
) VALUES (
	'A102',
	'FA001',
	'Faculty A',
	5,
	0
);
