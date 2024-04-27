import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';

function UserList({ bid }) {
  // State to store the user list data
  const [users, setUsers] = useState([]);
  // State to track whether data is loading
  const [loading, setLoading] = useState(false);

  // Function to fetch user list data
  const fetchUserList = async () => {
    try {
      setLoading(true);
      // Fetch user list data based on bid
      const response = await fetch(`http://localhost:5000/batchusers/${bid}`, {
        method: "GET",
        headers: { "Content-Type" : "application/json "},
      });
      const data = await response.json();
      setUsers(data);
      console.log(users);
    } catch (error) {
      console.error('Error fetching user list:', error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect hook to fetch user list data whenever bid changes
  useEffect(() => {
    if (bid) {
      fetchUserList();
    }
  }, [bid]); // Dependency array to watch for changes in bid state

  // Define columns for DataTable
  const columns = [
    {
      name: 'ID',
      selector: (row) => row.user_id,
      sortable: true,
    },
    {
      name: 'Name',
      selector: (row) => row.user_name,
      sortable: true,
    },
    // Add more columns as needed
  ];

  const navigate = useNavigate();

  const handleRowClick = (row) => {
    navigate(`/dashboard/${row.user_id}`);
  }

  return (
    <div>
      <DataTable
        noHeader
        columns={columns}
        data={users}
        progressPending={loading}
        pagination
        highlightOnHover
        pointerOnHover
        onRowClicked={handleRowClick}
      />
    </div>
  );
}

export default UserList;
