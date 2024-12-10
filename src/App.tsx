import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login/login";
import Signup from "./components/signup/signup";
import Home from "./components/home/home";
import PageNotFound from "./components/pagenotfound/pageNotFound";
import { ReactSession } from 'react-client-session';
function App() {
  ReactSession.setStoreType("localStorage");
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path="/signup" element={<Signup/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='*' element={<PageNotFound/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
