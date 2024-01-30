import React, { createContext, useContext, useReducer } from 'react';

// Define the initial state
const initialState = {
  opportunities: [], // Initialize with an empty array for opportunities
  createdMember: null, // Initialize with null for createdMember
};

// Create a context for the state and dispatch function
export const DataContext = createContext();

// Define the reducer function to update the state
const dataReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_OPPORTUNITIES':
      return { ...state, opportunities: action.payload };
    case 'CREATE_MEMBER':
      return { ...state, createdMember: action.payload };
    // Add other cases as needed for different actions
    default:
      return state;
  }
};

// Create a DataProvider component to wrap your app with
export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to access the state
export const useDataState = () => {
  return useContext(DataContext).state;
};

// Custom hook to access the dispatch function
export const useDataDispatch = () => {
  return useContext(DataContext).dispatch;
};
