import { useState } from "react";
import { Route, Routes } from "react-router";
import "./App.css";
import HomeLayout from "./layouts/home";
import Home from "./pages/home";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<Routes>
				<Route element={<HomeLayout />}>
					<Route index element={<Home />} />
				</Route>
			</Routes>
		</>
	);
}

export default App;
