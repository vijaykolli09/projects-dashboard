import './App.css';
import ProjectsTable from './components/projectTable/ProjectsTable';
import Pagination from './components/Pagination';
import fetchRecords from './services/api';
import { useState,useEffect } from 'react';
import Navbar from './components/Navbar';

function App() {
  const [records, setRecords] = useState([])

  useEffect(() => {
    const getRecords = async ()=>{
      const data = await fetchRecords();
      console.log(data)
      setRecords(data)

    }
    // getRecords()
    
  })
  
  return (
    <div className="container">
      <Navbar/>
      <ProjectsTable projectsAll = {records}/>
      <Pagination/>
    </div>
  );
}

export default App;
