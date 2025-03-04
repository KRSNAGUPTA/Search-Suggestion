import './App.css'
import { Route, Router, Routes } from "react-router-dom";
import SearchPage from './pages/SearchPage';
function App() {

  return (
    <Router>
      <Routes>
        
      <Route path="/" element={SearchPage} />
      </Routes>
    </Router>
  )
}

export default App
