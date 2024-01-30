import React, { useState, useEffect } from 'react';
import { createMember } from '../services/api';

function MemberModal({refreshDashboard }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMessage('')
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const memberData = {
      first_name: firstName,
      last_name: lastName,
      gender: gender === '1' ? 'male' : 'female',
      age: age,
      role: role  === '1' ? 'patient' : 'doctor',
    };

    try {
      const response = await createMember(memberData);
      setMessage('Saved successfully')
      setTimeout(() =>  document.querySelector('.member-modal').click(), 1000);
      setMessage('')
      refreshDashboard();
      // Additional actions on success, like closing the modal and refreshing data
    } catch (error) {
      setMessage('Failed to add opportunity. Please try again.');
      // Handle error, show message, etc.
    }
  };

  return (
    <div className="modal fade" id="membermodal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Add Member</h5>
            <button type="button" className="btn-close member-modal" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <form className="member-form" onSubmit={handleSubmit}>
            <div className="modal-body pt-4">
              {/* First Name Field */}
              <div className="form-group mb-3">
                <label>First Name <span>*</span></label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Belinda"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required 
                />
              </div>
              {/* Last Name Field */}
              <div className="form-group mb-3">
                <label>Last Name <span>*</span></label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Smith"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required 
                />
              </div>
              {/* Gender Select Field */}
              <div className="form-group mb-3">
                <label>Gender <span>*</span></label>
                <select 
                  className="form-select" 
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="1">Male</option>
                  <option value="2">Female</option>
                </select>
              </div>
              {/* Age Input Field (assuming it's a number input for age) */}
              <div className="form-group mb-3">
                <label>Age <span>*</span></label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Enter age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required 
                />
              </div>
              {/* Role Select Field */}
              <div className="form-group mb-3">
                <label>Role <span>*</span></label>
                <select 
                  className="form-select" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="1">Patient</option>
                  <option value="2">Doctor</option> {/* Replace with actual roles */}
                </select>
              </div>
            </div>
            <div className="modal-footer border-0 pt-0">
              {message && <div className="alert alert-warning" role="alert">{message}</div>}
              <button type="submit" className="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MemberModal;
