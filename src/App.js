import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddUser from './components/AddUser';
import EditUser from './components/EditUser';
 
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/users/add" element={<AddUser />} />
      <Route path="/users/edit/:id" element={<EditUser />} />
    </Routes>
  );
}

export default App;
