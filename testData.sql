DELETE FROM admin_details;
DELETE FROM instructor_details;
DELETE FROM student_details;
DELETE FROM user_login;
DELETE FROM feedback_sets;
DELETE FROM course_details;

INSERT INTO user_login(user_id, user_name, password, user_mail, user_type) values ('AD01', 'Admin A', '123123', 'hello022004@gmail.com', 'AD');
INSERT INTO admin_details values ('AD01', 'Admin A', 1);

INSERT INTO user_login(user_id, user_name, password, user_mail, user_type) values ('CS21BTECH11013', 'Hema Sri', '123123', 'hello022004@gmail.com', 'ST');
INSERT INTO student_details values ('CS21BTECH11013', 'Hema Sri', '6', 'CS', 'BTECH', 9, 1);


INSERT INTO user_login(user_id, user_name, password, user_mail, user_type) values ('CS21BTECH11012', 'Akshay', '123123', 'hello022004@gmail.com', 'ST');
INSERT INTO student_details values ('CS21BTECH11012', 'Akshay', '6', 'CS', 'BTECH', 9, 1);


INSERT INTO user_login(user_id, user_name, password, user_mail, user_type) values ('FA001', 'Faculty A', '123123', 'hello022004@gmail.com', 'FA');
INSERT INTO instructor_details values ('FA001', 'Faculty A', 'CS', 'phD in CS', 1);


INSERT INTO feedback_sets(set_name) values ('SET A');
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
    eligile_batches,
    start_time,
    end_time,
    feedback_set_id
) VALUES (
    'C001',
    'Introduction to Programming',
    'Faculty A',
    'FA001',
    'A1',
    'Room 101',
    3,
    30,
    0,
    'This course provides an introduction to programming concepts.',
    'Link to course syllabus',
    ARRAY['P001', 'P002'],
    ARRAY['B001', 'B002'],
    '2024-05-01',
    '2024-08-01',
    1
);

