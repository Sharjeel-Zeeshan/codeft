import React, { useState, useEffect } from 'react'
import { Chart } from 'react-google-charts'
import "./UserTable.css"
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import DeleteIcon from '@mui/icons-material/Delete'

const UserTable = () => {

  const [users, setUsers] = useState([])
  const [editUser, setEditUser] = useState(null)

  const editdata ={
    name: '',
    email: '',
    phone: '',
    address: { city: '' },
  }

  const [editData, setEditData] = useState(editdata)

  useEffect(() => {
    
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())

      .then((data) => {
        const userData = data.map((user, index) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: index % 3 === 0 ? 'Admin' : 'User',
        }));
        setUsers(userData)
      })
  }, []);


  const handleEdit = (user) => {
    if (user.role === 'User') {
      alert('Not authorized to perform this action')
      return
    }

    setEditUser(user.id)
    setEditData(user)
  }

  
  const saveEdit = () => {

    setUsers(
      users.map((user) => (user.id === editUser ? editData : user))
    )
    setEditUser(null)
  }

  
  const handleDelete = (user) => {
    if (user.role === 'User') {
      alert('Not authorized to perform this action')
      return
    }
    setUsers(users.filter((u) => u.id !== user.id))
  }

  
  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'city') {
      setEditData({
        ...editData,
        address: { ...editData.address, city: value }
      })
    } else {
      setEditData({ ...editData, [name]: value })
    }
  }

  
  const chartData = [
    ['Name', 'Role Value'],
    ...users.map((user) => [user.name, user.role === 'Admin' ? 2 : 1]),
  ]

  const chartOptions = {
    title: 'User Distribution by Names',
    pieSliceText: 'label',
    is3D: true,
  }

  return (
    <div>
      <div className='navbar'>
        <img className="image" src="./logo.svg" style={{width:"2.5%"}}/>
        <h3 style={{marginLeft:"15px"}}>Codeft</h3>
      </div>
      <h2 style={{marginLeft:"100px", marginTop:"45px"}}>User Table</h2>
      <div className='bar'></div>
      <table  style={{ borderCollapse: 'collapse',marginTop:"30px" }}>
        <thead className="table-heading">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>City</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {users.map((user) => (
            <tr key={user.id}>
              {editUser === user.id ? (
                <>
                  <td>
                    <input type="text" name="name" value={editData.name} onChange={handleChange}/>
                  </td>
                  <td>
                    <input type="email" name="email" value={editData.email}onChange={handleChange}  />
                  </td>
                  <td>
                    <input type="text" name="phone" value={editData.phone} onChange={handleChange}/>
                  </td>
                  <td>
                    <input type="text" name="city" value={editData.address.city} onChange={handleChange}/>
                  </td>
                  <td>
                    <input type="text" value={editData.role} disabled />
                  </td>
                  <td>
                    <button className='icon' onClick={saveEdit}>Save</button>
                    <button  className='icon' onClick={() => setEditUser(null)}>
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.address.city}</td>
                  <td>{user.role}</td>
                  <td>
                    <button title="Edit" onClick={() => handleEdit(user)}><ModeEditIcon  className='icon'style={{cursor:"pointer"}}/></button>
                    <button title="Delete" onClick={() => handleDelete(user)}><DeleteIcon  className='icon'style={{cursor:"pointer"}}/></button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '40px' }}>
        <h3 style={{marginLeft:"100px",marginTop:"15px"}}>Pie Chart</h3>
        <div className='bar'></div>
        <Chart
          chartType="PieChart"
          data={chartData}
          options={chartOptions}
          width="100%"
          height="400px"
        />
      </div>
    </div>
  );
};

export default UserTable;
