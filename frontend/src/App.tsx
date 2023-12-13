import { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import My from "./pages/my";
import Sale from "./pages/sale";
import Layout from "./components/Layout";

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/my" element={<My />} />
          <Route path="/sale" element={<Sale />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

//디자인은 각자 반영 후 각 페이지에 적용 및 분위기설정
