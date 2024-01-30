import React, { useState, useEffect } from 'react';
import { createOpportunity } from '../services/api';
import { updateOpportunity } from '../services/api';

function OpportunityModal({ opportunities, opportunity, refreshDashboard }) {
  const [procedureName, setProcedureName] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (opportunity) {
      // Initialize form fields with selectedOpportunity data
      setProcedureName(opportunity.procedure_name || '');
      setDoctorId(opportunity.doctor?.id || '');
      setPatientId(opportunity.patient?.id || '');
      // ...other initializations...
    } else {
      // Reset form fields for new opportunity
      setProcedureName('');
      setDoctorId('');
      setPatientId('');
      // ...other resets...
    }
  }, [opportunity]);

  // Get unique doctors and patients
  const doctors = opportunities &&  opportunities.doctors
  const patients = opportunities &&  opportunities.patients

  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const opportunityData = {
      procedure_name: procedureName,
      doctor_id: doctorId,
      patient_id: patientId
    };
  
    try {
      let response;
      if (opportunity) {
        // Edit mode: Update existing opportunity
        response = await updateOpportunity(opportunity.id, opportunityData);
      } else {
        // Create mode: Create new opportunity
        response = await createOpportunity(opportunityData);
      }
  
      setMessage('Saved successfully');
      setTimeout(() => {document.querySelector('.oppor-modal').click()
        setMessage('');
        }, 1000);
      refreshDashboard();
      setProcedureName('');
      setDoctorId('');
      setPatientId('');
    } catch (error) {
      setMessage('Failed to add opportunity. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="modal fade" id="opportunitymodal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Add Opportunity</h5>
            <button type="button" className="btn-close oppor-modal" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form className="member-form" onSubmit={handleSubmit}>
            <div className="modal-body pt-4">
              <div className="form-group mb-3">
                <label htmlFor="procedureName">Procedure Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="procedureName"
                  placeholder="Enter procedure name"
                  value={procedureName}
                  required={true}
                  onChange={(e) => setProcedureName(e.target.value)}
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="doctorName">Doctor's Name</label>
                <select
                  className="form-select"
                  id="doctorName"
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                >
                  <option value="">Select a Doctor</option>
                  {doctors && doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>{doc.first_name} {doc.last_name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group mb-3">
                <label htmlFor="patientName">Patient's Name</label>
                <select
                  className="form-select"
                  id="patientName"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                >
                  <option value="">Select a Patient</option>
                  {patients && patients.map((pat) => (
                    <option key={pat.id} value={pat.id}>{pat.first_name} {pat.last_name}</option>
                  ))}
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

export default OpportunityModal;
