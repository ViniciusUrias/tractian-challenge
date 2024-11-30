import { Outlet } from "react-router";
import Header from "../../components/Header";

export default function HomeLayout({ children }) {
	return (
		<div className="bg-gray-300 h-screen w-screen">
			<Header />
			<main className="m-2 rounded-md flex flex-col min-h-screen overflow-x-hidden bg-white">
				<Outlet />
			</main>
		</div>
	);
}
