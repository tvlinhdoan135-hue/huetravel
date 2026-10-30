
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import DestinationDetail from "./pages/DestinationDetail";
import Itinerary from "./pages/Itinerary";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />

        <Route
          path="/destinations"
          element={<App />}
        />

        <Route
          path="/destinations/:slug"
          element={<DestinationDetail />}
        />

        <Route
          path="/itinerary"
          element={<Itinerary />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
