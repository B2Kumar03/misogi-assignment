
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ARoutes from './allroutes/ARoutes';
import './App.css'
import Navbar from './component/Navbar';



const App = () => {
 

  return (
    <>
    <Navbar/>
    <ARoutes/>
    <ToastContainer/>
    </>
    );
};

export default App;
