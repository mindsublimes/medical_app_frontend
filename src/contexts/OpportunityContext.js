import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { fetchOpportunities } from '../services/api';
// Define the initial state with additional states
const initialState = {
  opportunities: [],
  leads: [],
  qualified: [],
  booked: [],
  treated: [],
  // ... other states
};

export const DataContext = createContext();

// Update the reducer to handle new actions
const dataReducer = (state, action) => {
  switch (action.type) {
    case 'SET_OPPORTUNITIES':
      return { ...state, opportunities: action.payload };
    case 'SET_LEADS':
      return { ...state, leads: action.payload };
    case 'SET_QUALIFIED':
      return { ...state, qualified: action.payload };
    case 'SET_BOOKED':
      return { ...state, booked: action.payload };
    case 'SET_TREATED':
      return { ...state, treated: action.payload };
    // ... other cases
    default:
      return state;
  }
};

// DataProvider component
export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  useEffect(() => {
    // Fetch opportunities
    fetchOpportunities()
      .then(response => console.log(response))
      .then(data => {
        dispatch({ type: 'SET_OPPORTUNITIES', payload: data });
  
        // Filter opportunities based on the latest stage in their stage_history
        const leads = data.filter(opportunity =>
          opportunity.stage_history[opportunity.stage_history.length - 1].stage_name === 'Lead'
        );
        const qualified = data.filter(opportunity =>
          opportunity.stage_history[opportunity.stage_history.length - 1].stage_name === 'Qualified'
        );
        const booked = data.filter(opportunity =>
          opportunity.stage_history[opportunity.stage_history.length - 1].stage_name === 'Booked'
        );
        const treated = data.filter(opportunity =>
          opportunity.stage_history[opportunity.stage_history.length - 1].stage_name === 'Treated'
        );
  
        dispatch({ type: 'SET_LEADS', payload: leads });
        dispatch({ type: 'SET_QUALIFIED', payload: qualified });
        dispatch({ type: 'SET_BOOKED', payload: booked });
        dispatch({ type: 'SET_TREATED', payload: treated });
      })
      .catch(error => console.error('Error fetching opportunities:', error));
  }, []);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};

// Export custom hooks for state and dispatch
export const useDataState = () => {
    const context = useContext(DataContext);
    if (!context) {
      throw new Error('useDataState must be used within a DataProvider');
    }
    return context.state;
  };
  
  // Custom hook to access the dispatch function
  export const useDataDispatch = () => {
    const context = useContext(DataContext);
    if (!context) {
      throw new Error('useDataDispatch must be used within a DataProvider');
    }
    return context.dispatch;
  };
