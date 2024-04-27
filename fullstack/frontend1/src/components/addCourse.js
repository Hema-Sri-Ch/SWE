import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function AddCourse() {
  const [lgShow, setLgShow] = useState(false);
  const [dept, setDept] = useState(null);
  const [slot_id, setSlot] = useState(null);
  const [room_id, setRoom] = useState(null);
  const [iid, setIid] = useState(null);
  const [iname, setIname] = useState(null);
  const [prereq_cids, setPrereq_cids] = useState([]);
  const [eligible_batches, setEligible_batches] = useState([]);
  const [start_time, setStart_time] = useState(null);
  const [end_time, setEnd_time] = useState(null);
  const [fid, setFid] = useState(null);
  const [active, setActive] = useState(null);

  const[instructors, setInstructors] = useState([]);
  const[slots, setSlots] = useState([]);
  const[rooms, setRooms] = useState([]);
  const[courses, setCourses] = useState([]);
  const[batches, setBatches] = useState([]);
  const[fids, setFids] = useState([]);
  const getInstructors = async() => {
    try {
        const response = await fetch(`http://localhost:5000/batchusers/FA`, {
            method: "GET",
            headers: {"Content-Type": "appliction/json"}
        })
        const data = await response.json();
        setInstructors(data);
    }
    catch(error){
        console.error("ERror in fetching", error);
    }
  }

  const getSlots = async() => {
    try {
        const response = await fetch(`http://localhost:5000/slots`, {
            method: "GET",
            headers: {"Content-Type": "appliction/json"}
        })
        const data = await response.json();
        setSlots(data);
    }
    catch(error){
        console.error("ERror in fetching", error);
    }
  }

  const getRooms = async() => {
    try {
        const response = await fetch(`http://localhost:5000/rooms`, {
            method: "GET",
            headers: {"Content-Type": "appliction/json"}
        })
        const data = await response.json();
        setRooms(data);
        
    }
    catch(error){
        console.error("ERror in fetching", error);
    }
  }

  const getCourses = async() => {
    try {
        const response = await fetch(`http://localhost:5000/prereqcids`, {
            method: "GET",
            headers: {"Content-Type": "appliction/json"}
        })
        const data = await response.json();
        setCourses(data);
    }
    catch(error){
        console.error("ERror in fetching", error);
    }
  }

  const getBatches = async() => {
    try {
        const response = await fetch(`http://localhost:5000/batches`, {
            method: "GET",
            headers: {"Content-Type": "appliction/json"}
        })
        const data = await response.json();
        setBatches(data);
        
    }
    catch(error){
        console.error("ERror in fetching", error);
    }
  }

  const getForms = async() => {
    try {
        const response = await fetch(`http://localhost:5000/feedbackforms`, {
            method: "GET",
            headers: {"Content-Type": "appliction/json"}
        })
        const data = await response.json();
        setFids(data);
        
    }
    catch(error){
        console.error("ERror in fetching", error);
    }
  }

  useEffect(() => {
    getInstructors();
    getSlots();
    getRooms();
    getCourses();
    getBatches();
    getForms();
  }, [])

  // State variable to store the selected room IDs
  const [selectedRooms, setSelectedRooms] = useState([]);

  // Function to handle the change event of the select element
  const handleRoomChange = (event) => {
    const selectedRoomId = event.target.value;
    // Check if the selected room is already in the array
    if (!selectedRooms.includes(selectedRoomId)) {
      // Append the selected room to the array
      setSelectedRooms([...selectedRooms, selectedRoomId]);
    } else {
      // Remove the selected room from the array
      setSelectedRooms(selectedRooms.filter(roomId => roomId !== selectedRoomId));
    }
  };

  const handleChangeCids = (event) => {
    const newCid = event.target.value;

    if(!prereq_cids.includes(newCid)){
        setPrereq_cids([...prereq_cids, newCid]);
    } else {
        setPrereq_cids(prereq_cids.filter(course_id => course_id !== newCid));
    }
  }

  const handleChangeBids = (event) => {
    const newBid = event.target.value;

    if(!eligible_batches.includes(newBid)) {
        setEligible_batches([...eligible_batches, newBid]);
    }
    else {
        setEligible_batches(eligible_batches.filter(batch_id => batch_id !== newBid));
    }
  }


  const handleSubmit = async() => {
    try {
        const body = {
            dept, 
            active, 
            iid, 
            iname, 
            prereq_cids, 
            eligible_batches, 
            slot_id, 
            room_id, 
            fid
        };
        console.log(body);
         
        const response = await fetch(`http://localhost:5000/addcourse`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        })

        console.log(response);
        setLgShow(false);
    } catch (error) {
        console.error(error)
    }
  }
  return (
    <div>
      <Button onClick={() => setLgShow(true)}>Large modal</Button>

      <Modal
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Add New Course
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
            <Form.Label>Select relevant department</Form.Label>
            <Form.Select 
                required
                aria-label="Default select example" 
                aria-placeholder='Select department'
                value={dept}
                onChange={(e) => setDept(parseInt(e.target.value))}
            >
                    <option value="">-- Select --</option>
                <option value={-1}>Other</option>
                <option value={1}>Artificial Intelligence</option>
                <option value={2}>Computer Science</option>
                <option value={3}>Chemical Engineering</option>
                <option value={4}>Electrical Engineering</option>
                <option value={5}>Mechanical Engineering</option>
                
            </Form.Select>
            </Form>

            <Form>
            <Form.Label>Active</Form.Label>
            <Form.Select 
                required
                aria-label="Default select example" 
                aria-placeholder='Select department'
                value={active}
                onChange={(e) => setActive(parseInt(e.target.value))}
            >
                    <option value="">-- Select --</option>
                <option value={0}>No</option>
                <option value={1}>Yes</option>
            </Form.Select>
            </Form>

            <Form>
                <Form.Label>Select Instructor</Form.Label>
                <Form.Select 
                    required aria-label="Default select example" 
                    value={iid} 
                    onChange={(e)=>{setIid(e.target.value);}}
                >
                    <option value="">-- Select --</option>
                    {
                        instructors.map((ins) => (
                            <option value={ins.user_id}>{ins.user_id}: {ins.user_name}</option>
                        ))
                    }
                </Form.Select>
            </Form>
            <Form>
                <Form.Label>Select Feedback Set</Form.Label>
                <Form.Select 
                    required aria-label="Default select example" 
                    value={fid} 
                    onChange={
                        (e)=>{setFid(e.target.value);}}
                >
                    <option value="">-- Select --</option>
                    {
                        fids.map((fid) => (
                            <option value={fid.id}>{fid.id}: {fid.set_name}</option>
                        ))
                    }
                </Form.Select>
            </Form>

            <Form>
                <Form.Label>Select Slot</Form.Label>
                <Form.Select 
                    required aria-label="Default select example" 
                    value={slot_id} 
                    onChange={
                        (e)=>{setSlot(e.target.value);}}
                >
                    <option value="">-- Select --</option>
                    {
                        
                        slots.map((slt) => (
                            <option value={slt.slot_id}>{slt.slot_id}</option>
                        ))
                    }
                </Form.Select>
            </Form>
            <Form>
                <Form.Label>Select Room</Form.Label>
                <Form.Select 
                    required aria-label="Default select example" 
                    value={room_id} 
                    onChange={
                        (e)=>{setRoom(e.target.value);}}
                >
                    <option value="">-- Select --</option>
                    {
                        rooms.map((room) => (
                            <option value={room.room_id}>{room.room_id}</option>
                        ))
                    }
                </Form.Select>
            </Form>
            <Form>
                <Form.Label>Select Prerequisite courses</Form.Label>
                <Form.Select
                    aria-label='Default select example'
                    multiple
                    value={prereq_cids}
                    onChange={handleChangeCids}
                >
                    {
                        courses.map((course) => (
                            <option key={course.course_id} value={course.course_id}>{course.course_id}: {course.course_name}</option>
                        ))
                    }
                   
                </Form.Select>
                Selected Courses: {prereq_cids.join(', ')}
            </Form>
            <Form>
                <Form.Label>Select Eligible Batches</Form.Label>
                <Form.Select
                    aria-label='Default select example'
                    multiple
                    value={eligible_batches}
                    onChange={handleChangeBids}
                >
                    {
                        batches.map((batch) => (
                            <option key={batch.batch_id} value={batch.batch_id}>{batch.batch_id}</option>
                        ))
                    }
                   
                </Form.Select>
                Selected Batches: {eligible_batches.join(', ')}
            </Form>

            <Form>
            <Form.Label>Start Date</Form.Label>
                <DatePicker
                    selected={start_time}
                    onChange={(date) => {setStart_time(date)}}
                    dateFormat="MM/dd/yyyy" // Format the date as you prefer
                    isClearable // Allow clearing the selected date
                    showYearDropdown // Show a dropdown for selecting the year
                    scrollableYearDropdown // Allow scrolling through the year dropdown
                    yearDropdownItemNumber={15} // Number of years to display in the year dropdown
                />
                {/* Display the selected date */}
                {/* {start_time && (
                    <div>
                    Selected Date: {start_time.toLocaleDateString()}
                    </div>
                )} */}

        <Form.Label>End Date</Form.Label>
                <DatePicker
                    selected={end_time}
                    onChange={(date) => {setEnd_time(date)}}
                    dateFormat="MM/dd/yyyy" // Format the date as you prefer
                    isClearable // Allow clearing the selected date
                    showYearDropdown // Show a dropdown for selecting the year
                    scrollableYearDropdown // Allow scrolling through the year dropdown
                    yearDropdownItemNumber={15} // Number of years to display in the year dropdown
                />
                {/* Display the selected date */}
                {/* {start_time && (
                    <div>
                    Selected Date: {start_time.toLocaleDateString()}
                    </div>
                )} */}

                
            </Form>


        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary">Close</Button>
          <Button variant="primary" onClick={handleSubmit}>Save changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}