import { ReactElement } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PropertyExplorer } from "./components/PropertyExplorer";
//import { Navigation } from './components/Navigation';
import { Reservations } from "./components/Reservations";
import { Listings } from "./components/Listings";
import { Wallet } from "./components/Wallet";
import { Navbar } from "./components/Navbar";
import Home from "./components/Home";
import Sender from "./components/Minter/Sender";

export function App(): ReactElement {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        {/* <Navigation />  */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="PropertyExplorer" element={<PropertyExplorer />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/sender" element={<Sender />} />
          <Route path="/wallet" element={<Wallet />} />
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    </div>
  );
}
