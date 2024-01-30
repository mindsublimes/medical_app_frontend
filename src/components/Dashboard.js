import React, {useState, useEffect} from 'react';
// import DashboardSlider from './DashboardSlider'; // You can create a DashboardSlider component
import MemberModal from './MemberModal'; // You can create a MemberModal component
import OpportunityModal from './OpportunityModal'; // You can create a MemberModal component
import Edit from '../images/Edit.png'
import Icon1 from '../images/icon-img.png'
import Image1 from '../images/img01.png';
import Logo from '../images/logo.png';
import Next from '../images/next.png';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/dashboard.css'
import { fetchOpportunities }  from '../services/api';
import { nextStage } from '../services/api';
import { search } from '../services/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

function Dashboard() {
  const [opportunities, setOpportunities] = useState(null);
  const [leads, setLeads] = useState([]);
  const [qualifieds, setQualified] = useState([]);
  const [bookeds, setBooked] = useState([]);
  const [treateds, setTreated] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');


  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const swiperSettings = {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    pagination: {
      clickable: true,
    },
    breakpoints: {
      // when window width is >= 767px
      767: {
        slidesPerView: 2, // Adjust the number of slides per view as needed
        spaceBetween: 40, // Adjust space between slides as needed
        // You can add more settings specific to this breakpoint
      },
    },
    // Add more settings as needed
  };
  
  const makeData = (response) => {
    let data = response.data.opportunities
    setOpportunities(response.data);

    const leads = data.filter(opportunity =>
      opportunity.stage_history.length === 1
    );
    const qualifieds = data.filter(opportunity =>
      opportunity.stage_history.length === 2
    );
    const bookeds = data.filter(opportunity =>
      opportunity.stage_history.length === 3
    );
    const treateds = data.filter(opportunity =>
      opportunity.stage_history.length === 4
    );

    setLeads(leads);
    setQualified(qualifieds);
    setBooked(bookeds);
    setTreated(treateds);
  }

  useEffect(() => {
    // Fetch opportunities from your API
    console.log("response")
    fetchOpportunities()
      .then(response => {
        let data = response.data.opportunities
        setOpportunities(response.data);
  
        const leads = data.filter(opportunity =>
          opportunity.stage_history.length === 1
        );
        const qualifieds = data.filter(opportunity =>
          opportunity.stage_history.length === 2
        );
        const bookeds = data.filter(opportunity =>
          opportunity.stage_history.length === 3
        );
        const treateds = data.filter(opportunity =>
          opportunity.stage_history.length === 4
        );
  
        setLeads(leads);
        setQualified(qualifieds);
        setBooked(bookeds);
        setTreated(treateds);
      })
      .catch((error) => {
        console.error('Error fetching opportunities:', error);
      });

      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);

  }, []);
  

  const handleEditOpportunity = (opportunity) => {
    setSelectedOpportunity(opportunity);
  };

  function formatDate(inputDate) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(inputDate);
    return date.toLocaleDateString('en-US', options);
  }

  const refreshDashboard = () => {
    fetchOpportunities()
      .then(response => {
        let data = response.data.opportunities
        setOpportunities(response.data);
  
        const leads = data.filter(opportunity =>
          opportunity.stage_history.length === 1
        );
        const qualifieds = data.filter(opportunity =>
          opportunity.stage_history.length === 2
        );
        const bookeds = data.filter(opportunity =>
          opportunity.stage_history.length === 3
        );
        const treateds = data.filter(opportunity =>
          opportunity.stage_history.length === 4
        );
  
        setLeads(leads);
        setQualified(qualifieds);
        setBooked(bookeds);
        setTreated(treateds);
      })
      .catch((error) => {
        console.error('Error fetching opportunities:', error);
      });
  };


  const moveToNextStage = async (opportunity) => {
    const stages = ["Lead", "Qualified", "Booked", "Treated"];
    const nextStageIndex = opportunity.stage_history.length;
    const nextStageName = stages[nextStageIndex];
  
    const timestamp = new Date().toISOString();
  
    const updatedStageHistory = [
      ...opportunity.stage_history, 
      { timestamp, stage_name: nextStageName }
    ];
  
    try {
      let response = await nextStage(opportunity.id, {
        stage_history: updatedStageHistory
      });
  
      refreshDashboard();
    } catch (error) {
      // console.error('Error updating stage:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await search(searchQuery);
      // Update your state with the search results
      makeData(response)
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };


  return (
    <div id="wrapper">
      <header id="header" className="p-3">
        <div className="logo">
          <a href="#">
            <img src={Logo} alt="logo" />
          </a>
        </div>
      </header>
      <div className="pulse-dashboard px-3 py-4">
        <div className="custom-container">
          <div className="head-area d-flex flex-column flex-md-row align-items-center justify-content-between mb-4">
            <h2 className="mb-3 mb-md-0 pb-3 pb-md-0">Patients</h2>
            <div className="d-flex align-items-center gap-2">
              <a
                className="btn btn-primary text-nowrap"
                href="#"
                data-bs-toggle="modal"
                data-bs-target="#membermodal"
              >
                Add Member
              </a>
              <form className="search-form border px-2 d-flex" onSubmit={handleSearch}>
                <button type="submit" className="border-0 bg-transparent">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M17.7656 16.6895L12.6934 11.6172C13.4805 10.5996 13.9062 9.35547 13.9062 8.04688C13.9062 6.48047 13.2949 5.01172 12.1895 3.9043C11.084 2.79687 9.61133 2.1875 8.04688 2.1875C6.48242 2.1875 5.00977 2.79883 3.9043 3.9043C2.79687 5.00977 2.1875 6.48047 2.1875 8.04688C2.1875 9.61133 2.79883 11.084 3.9043 12.1895C5.00977 13.2969 6.48047 13.9062 8.04688 13.9062C9.35547 13.9062 10.5977 13.4805 11.6152 12.6953L16.6875 17.7656C16.75 17.8281 16.8516 17.8281 16.9141 17.7656L17.7656 16.916C17.8281 16.8535 17.8281 16.752 17.7656 16.6895ZM11.1406 11.1406C10.3125 11.9668 9.21484 12.4219 8.04688 12.4219C6.87891 12.4219 5.78125 11.9668 4.95312 11.1406C4.12695 10.3125 3.67188 9.21484 3.67188 8.04688C3.67188 6.87891 4.12695 5.7793 4.95312 4.95312C5.78125 4.12695 6.87891 3.67188 8.04688 3.67188C9.21484 3.67188 10.3145 4.125 11.1406 4.95312C11.9668 5.78125 12.4219 6.87891 12.4219 8.04688C12.4219 9.21484 11.9668 10.3145 11.1406 11.1406Z"
                      fill="#4D4D4D"
                    />
                  </svg>
                </button>
                <input
                  type="search"
                  placeholder="Search"
                  className="form-control border-0 flex-fill"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
          </div>
          <div className="dashboard-slider d-md-flex flex-wrap gap-3">
          {isMobile ? (
              <Swiper {...swiperSettings}>
              <SwiperSlide>
                <div className="flex-fill">
                  <div className="board px-2">
                    <div className="head d-flex justify-content-between align-items-center py-3">
                      <h3 className="m-0">Leads ({leads && leads.length})</h3>
                      <a
                        className="btn btn-primary text-nowrap"
                        href="#"
                        data-bs-toggle="modal"
                        data-bs-target="#opportunitymodal"
                      >
                        Add opportunity
                      </a>
                    </div>
                    {leads && leads.map((lead) => (
                      <div className="widget mb-3" key={lead.id}> {/* Assuming each lead has a unique 'id' */}
                        <div className="top d-flex gap-3 bg-white p-3">
                          <div className="img-holder">
                            <img src={Image1} alt="Lead" />
                          </div>
                          <div className="txt-holder">
                            <strong className="title d-block">{lead.patient.first_name}</strong> {/* Replace with actual lead property */}
                            <span>{`${lead.patient.gender}, ${lead.patient.age} years old`}</span> {/* Replace with actual lead properties */}
                          </div>
                        </div>
                        <div className="description d-flex justify-content-between p-3">
                          <div className="flex-fill">
                            <span className="name d-block">{lead.procedure_name}</span> {/* Replace with actual lead property */}
                            <span className="name d-block">Dr {lead.doctor.first_name} {lead.doctor.last_name}</span> {/* Replace with actual lead property */}
                            <ul className="list-unstyled">
                              <li className="row">
                                <span className="col-4">Lead</span>
                                <span className="col-8">{formatDate(lead.stage_history[0].timestamp)}</span> {/* Replace with actual lead property */}
                              </li>
                            </ul>
                          </div>
                          <div className="icons d-flex justify-content-between align-items-center flex-column gap-2">
                            <a href="#">
                              <img src={Icon1} alt="Icon" />
                            </a>
                            <a href="#" onClick={() => moveToNextStage(lead)}>
                              <img src={Next} alt="Next"/>
                            </a>
                            <a href="javascript:void()" onClick={() => handleEditOpportunity(lead)}  
                              data-bs-toggle="modal"
                              data-bs-target="#opportunitymodal">
                              <img src={Edit} alt="Edit" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SwiperSlide>  
              <SwiperSlide>
              <div className="flex-fill">
                <div className="board px-2">
                  <div className="head d-flex justify-content-between align-items-center py-3">
                    <h3 className="m-0">Qualified ({qualifieds && qualifieds.length})</h3>
                  </div>
                  {qualifieds && qualifieds.map((qualified) => (
                      <div className="widget mb-3">
                        <div className="top d-flex gap-3 bg-white p-3">
                          <div className="img-holder">
                            <img src={Edit} alt="Edit" />
                          </div>
                          <div className="txt-holder">
                            <strong className="title d-block">{qualified.patient.first_name}</strong>
                            <span>{qualified.patient.gender}, {qualified.patient.age} years old</span>
                          </div>
                        </div>
                        <div className="description d-flex justify-content-between p-3">
                          <div className="flex-fill">
                            <span className="name d-block">{qualified.procedure_name}</span>
                            <span className="name d-block">Dr. {qualified.doctor.first_name} {qualified.doctor.last_name}</span>
                            <ul className="list-unstyled">
                              <li className="row">
                                <span className="col-4">Lead</span>
                                <span className="col-8">{formatDate(qualified.stage_history[0].timestamp)}</span>
                              </li>
                              <li className="row">
                                <span className="col-4">Qualified</span>
                                <span className="col-8">{qualified.stage_history[1] && formatDate(qualified.stage_history[1] && qualified.stage_history[1].timestamp)}</span>
                              </li>
                            </ul>
                          </div>
                          <div className="icons d-flex justify-content-between align-items-center flex-column gap-2">
                            <a href="#">
                              <img src={Image1} alt="Image" />
                            </a>
                            <a href="#" onClick={() => moveToNextStage(qualified)}>
                              <img src={Next} alt="View Qualified" /> {/* Change "View Qualified" here */}
                            </a>
                            <a href="javascript:void()" onClick={() => handleEditOpportunity(qualified)}  
                              data-bs-toggle="modal"
                              data-bs-target="#opportunitymodal">
                              <img src={Edit} alt="Edit" />
                            </a>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
              </SwiperSlide> 
              <SwiperSlide>
              <div className="flex-fill">
                <div className="board px-2">
                  <div className="head d-flex justify-content-between align-items-center py-3">
                    <h3 className="m-0">Booked ({bookeds && bookeds.length})</h3>
                  </div>
                  {bookeds && bookeds.map((booked) => (
                      <div className="widget mb-3">
                        <div className="top d-flex gap-3 bg-white p-3">
                          <div className="img-holder">
                            <img src={Edit} alt="Edit" />
                          </div>
                          <div className="txt-holder">
                            <strong className="title d-block">{booked.patient.first_name}</strong>
                            <span>{booked.patient.gender}, {booked.patient.age} years old</span>
                          </div>
                        </div>
                        <div className="description d-flex justify-content-between p-3">
                          <div className="flex-fill">
                            <span className="name d-block">{booked.procedure_name}</span>
                            <span className="name d-block">Dr. {booked.doctor.first_name} {booked.doctor.last_name}</span>
                            <ul className="list-unstyled">
                              <li className="row">
                                <span className="col-4">Lead</span>
                                <span className="col-8">{booked.stage_history[0] && formatDate(booked.stage_history[0] && booked.stage_history[0].timestamp)}</span>
                              </li>
                              <li className="row">
                                <span className="col-4">Qualified</span>
                                <span className="col-8">{booked.stage_history[1] && formatDate(booked.stage_history[1] && booked.stage_history[1].timestamp)}</span>
                              </li>
                              <li className="row">
                                <span className="col-4">Booked</span>
                                <span className="col-8">{booked.stage_history[2] && formatDate(booked.stage_history[2] && booked.stage_history[2].timestamp)}</span>
                              </li>
                            </ul>
                          </div>
                          <div className="icons d-flex justify-content-between align-items-center flex-column gap-2">
                            <a href="#">
                              <img src={Image1} alt="Image" />
                            </a>
                            <a href="#" onClick={() => moveToNextStage(booked)}>
                              <img src={Next} alt="View Qualified" /> {/* Change "View Qualified" here */}
                            </a>
                            <a href="javascript:void()" onClick={() => handleEditOpportunity(booked)}  
                              data-bs-toggle="modal"
                              data-bs-target="#opportunitymodal">
                              <img src={Edit} alt="Edit" />
                            </a>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
              </SwiperSlide>
              <SwiperSlide>
              <div className="flex-fill">
                <div className="board px-2">
                  <div className="head d-flex justify-content-between align-items-center py-3">
                    <h3 className="m-0">Treated ({treateds && treateds.length})</h3>
                  </div>
                  {treateds && treateds.map((treated) => (
                      <div className="widget mb-3">
                        <div className="top d-flex gap-3 bg-white p-3">
                          <div className="img-holder">
                            <img src={Edit} alt="Edit" />
                          </div>
                          <div className="txt-holder">
                            <strong className="title d-block">{treated.patient.first_name}</strong>
                            <span>{treated.patient.gender}, {treated.patient.age} years old</span>
                          </div>
                        </div>
                        <div className="description d-flex justify-content-between p-3">
                          <div className="flex-fill">
                            <span className="name d-block">{treated.procedure_name}</span>
                            <span className="name d-block">Dr. {treated.doctor.first_name} {treated.doctor.last_name}</span>
                            <ul className="list-unstyled">
                              <li className="row">
                                <span className="col-4">Lead</span>
                                <span className="col-8">{treated.stage_history[0] && formatDate(treated.stage_history[0] && treated.stage_history[0].timestamp)}</span>
                              </li>
                              <li className="row">
                                <span className="col-4">Qualified</span>
                                <span className="col-8">{treated.stage_history[1] && formatDate(treated.stage_history[1] && treated.stage_history[1].timestamp)}</span>
                              </li>
                              <li className="row">
                                <span className="col-4">Booked</span>
                                <span className="col-8">{treated.stage_history[2] && formatDate(treated.stage_history[2] && treated.stage_history[2].timestamp)}</span>
                              </li>
                              <li className="row">
                                <span className="col-4">Treated</span>
                                <span className="col-8">{treated.stage_history[3] && formatDate(treated.stage_history[3] && treated.stage_history[3].timestamp)}</span>
                              </li>
                            </ul>
                          </div>
                          <div className="icons d-flex justify-content-between align-items-center flex-column gap-2">
                            <a href="#">
                              <img src={Image1} alt="Image" />
                            </a>
                            <a href="#">
                              <img src={Next} alt="View treated" /> {/* Change "View Qualified" here */}
                            </a>
                            <a href="javascript:void()" onClick={() => handleEditOpportunity(treated)}  
                              data-bs-toggle="modal"
                              data-bs-target="#opportunitymodal">
                              <img src={Edit} alt="Edit" />
                            </a>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
              </SwiperSlide>
            </Swiper>
            ) : (
              <>
                <div className="flex-fill">
                  <div className="board px-2">
                    <div className="head d-flex justify-content-between align-items-center py-3">
                      <h3 className="m-0">Leads ({leads && leads.length})</h3>
                      <a
                        className="btn btn-primary text-nowrap"
                        href="#"
                        data-bs-toggle="modal"
                        data-bs-target="#opportunitymodal"
                      >
                        Add opportunity
                      </a>
                    </div>
                    {leads && leads.map((lead) => (
                      <div className="widget mb-3" key={lead.id}> {/* Assuming each lead has a unique 'id' */}
                        <div className="top d-flex gap-3 bg-white p-3">
                          <div className="img-holder">
                            <img src={Image1} alt="Lead" />
                          </div>
                          <div className="txt-holder">
                            <strong className="title d-block">{lead.patient.first_name}</strong> {/* Replace with actual lead property */}
                            <span>{`${lead.patient.gender}, ${lead.patient.age} years old`}</span> {/* Replace with actual lead properties */}
                          </div>
                        </div>
                        <div className="description d-flex justify-content-between p-3">
                          <div className="flex-fill">
                            <span className="name d-block">{lead.procedure_name}</span> {/* Replace with actual lead property */}
                            <span className="name d-block">Dr {lead.doctor.first_name} {lead.doctor.last_name}</span> {/* Replace with actual lead property */}
                            <ul className="list-unstyled">
                              <li className="row">
                                <span className="col-4">Lead</span>
                                <span className="col-8">{formatDate(lead.stage_history[0].timestamp)}</span> {/* Replace with actual lead property */}
                              </li>
                            </ul>
                          </div>
                          <div className="icons d-flex justify-content-between align-items-center flex-column gap-2">
                            <a href="#">
                              <img src={Icon1} alt="Icon" />
                            </a>
                            <a href="#" onClick={() => moveToNextStage(lead)}>
                              <img src={Next} alt="Next"/>
                            </a>
                            <a href="javascript:void()" onClick={() => handleEditOpportunity(lead)}  
                              data-bs-toggle="modal"
                              data-bs-target="#opportunitymodal">
                              <img src={Edit} alt="Edit" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-fill">
                  <div className="board px-2">
                    <div className="head d-flex justify-content-between align-items-center py-3">
                      <h3 className="m-0">Qualified ({qualifieds && qualifieds.length})</h3>
                    </div>
                    {qualifieds && qualifieds.map((qualified) => (
                        <div className="widget mb-3">
                          <div className="top d-flex gap-3 bg-white p-3">
                            <div className="img-holder">
                              <img src={Edit} alt="Edit" />
                            </div>
                            <div className="txt-holder">
                              <strong className="title d-block">{qualified.patient.first_name}</strong>
                              <span>{qualified.patient.gender}, {qualified.patient.age} years old</span>
                            </div>
                          </div>
                          <div className="description d-flex justify-content-between p-3">
                            <div className="flex-fill">
                              <span className="name d-block">{qualified.procedure_name}</span>
                              <span className="name d-block">Dr. {qualified.doctor.first_name} {qualified.doctor.last_name}</span>
                              <ul className="list-unstyled">
                                <li className="row">
                                  <span className="col-4">Lead</span>
                                  <span className="col-8">{formatDate(qualified.stage_history[0].timestamp)}</span>
                                </li>
                                <li className="row">
                                  <span className="col-4">Qualified</span>
                                  <span className="col-8">{qualified.stage_history[1] && formatDate(qualified.stage_history[1] && qualified.stage_history[1].timestamp)}</span>
                                </li>
                              </ul>
                            </div>
                            <div className="icons d-flex justify-content-between align-items-center flex-column gap-2">
                              <a href="#">
                                <img src={Image1} alt="Image" />
                              </a>
                              <a href="#" onClick={() => moveToNextStage(qualified)}>
                                <img src={Next} alt="View Qualified" /> {/* Change "View Qualified" here */}
                              </a>
                              <a href="javascript:void()" onClick={() => handleEditOpportunity(qualified)}  
                                data-bs-toggle="modal"
                                data-bs-target="#opportunitymodal">
                                <img src={Edit} alt="Edit" />
                              </a>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
                <div className="flex-fill">
                  <div className="board px-2">
                    <div className="head d-flex justify-content-between align-items-center py-3">
                      <h3 className="m-0">Booked ({bookeds && bookeds.length})</h3>
                    </div>
                    {bookeds && bookeds.map((booked) => (
                        <div className="widget mb-3">
                          <div className="top d-flex gap-3 bg-white p-3">
                            <div className="img-holder">
                              <img src={Edit} alt="Edit" />
                            </div>
                            <div className="txt-holder">
                              <strong className="title d-block">{booked.patient.first_name}</strong>
                              <span>{booked.patient.gender}, {booked.patient.age} years old</span>
                            </div>
                          </div>
                          <div className="description d-flex justify-content-between p-3">
                            <div className="flex-fill">
                              <span className="name d-block">{booked.procedure_name}</span>
                              <span className="name d-block">Dr. {booked.doctor.first_name} {booked.doctor.last_name}</span>
                              <ul className="list-unstyled">
                                <li className="row">
                                  <span className="col-4">Lead</span>
                                  <span className="col-8">{booked.stage_history[0] && formatDate(booked.stage_history[0] && booked.stage_history[0].timestamp)}</span>
                                </li>
                                <li className="row">
                                  <span className="col-4">Qualified</span>
                                  <span className="col-8">{booked.stage_history[1] && formatDate(booked.stage_history[1] && booked.stage_history[1].timestamp)}</span>
                                </li>
                                <li className="row">
                                  <span className="col-4">Booked</span>
                                  <span className="col-8">{booked.stage_history[2] && formatDate(booked.stage_history[2] && booked.stage_history[2].timestamp)}</span>
                                </li>
                              </ul>
                            </div>
                            <div className="icons d-flex justify-content-between align-items-center flex-column gap-2">
                              <a href="#">
                                <img src={Image1} alt="Image" />
                              </a>
                              <a href="#" onClick={() => moveToNextStage(booked)}>
                                <img src={Next} alt="View Qualified" /> {/* Change "View Qualified" here */}
                              </a>
                              <a href="javascript:void()" onClick={() => handleEditOpportunity(booked)}  
                                data-bs-toggle="modal"
                                data-bs-target="#opportunitymodal">
                                <img src={Edit} alt="Edit" />
                              </a>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
                <div className="flex-fill">
                  <div className="board px-2">
                    <div className="head d-flex justify-content-between align-items-center py-3">
                      <h3 className="m-0">Treated ({treateds && treateds.length})</h3>
                    </div>
                    {treateds && treateds.map((treated) => (
                        <div className="widget mb-3">
                          <div className="top d-flex gap-3 bg-white p-3">
                            <div className="img-holder">
                              <img src={Edit} alt="Edit" />
                            </div>
                            <div className="txt-holder">
                              <strong className="title d-block">{treated.patient.first_name}</strong>
                              <span>{treated.patient.gender}, {treated.patient.age} years old</span>
                            </div>
                          </div>
                          <div className="description d-flex justify-content-between p-3">
                            <div className="flex-fill">
                              <span className="name d-block">{treated.procedure_name}</span>
                              <span className="name d-block">Dr. {treated.doctor.first_name} {treated.doctor.last_name}</span>
                              <ul className="list-unstyled">
                                <li className="row">
                                  <span className="col-4">Lead</span>
                                  <span className="col-8">{treated.stage_history[0] && formatDate(treated.stage_history[0] && treated.stage_history[0].timestamp)}</span>
                                </li>
                                <li className="row">
                                  <span className="col-4">Qualified</span>
                                  <span className="col-8">{treated.stage_history[1] && formatDate(treated.stage_history[1] && treated.stage_history[1].timestamp)}</span>
                                </li>
                                <li className="row">
                                  <span className="col-4">Booked</span>
                                  <span className="col-8">{treated.stage_history[2] && formatDate(treated.stage_history[2] && treated.stage_history[2].timestamp)}</span>
                                </li>
                                <li className="row">
                                  <span className="col-4">Treated</span>
                                  <span className="col-8">{treated.stage_history[3] && formatDate(treated.stage_history[3] && treated.stage_history[3].timestamp)}</span>
                                </li>
                              </ul>
                            </div>
                            <div className="icons d-flex justify-content-between align-items-center flex-column gap-2">
                              <a href="#">
                                <img src={Image1} alt="Image" />
                              </a>
                              <a href="#">
                                <img src={Next} alt="View treated" /> {/* Change "View Qualified" here */}
                              </a>
                              <a href="javascript:void()" onClick={() => handleEditOpportunity(treated)}  
                                data-bs-toggle="modal"
                                data-bs-target="#opportunitymodal">
                                <img src={Edit} alt="Edit" />
                              </a>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
              </>
          )}
          </div>
        </div>
      </div>
      <MemberModal refreshDashboard={refreshDashboard}/>
      <OpportunityModal opportunities={opportunities} opportunity={selectedOpportunity} refreshDashboard={refreshDashboard}/>
    </div>
  );
}

export default Dashboard;
