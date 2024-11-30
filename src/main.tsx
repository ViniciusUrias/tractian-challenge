import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";

import App from "./App.tsx";
import { SelectedCompanyProvider } from "./contexts/GlobalContext/index.tsx";

createRoot(document.getElementById("root")!).render(
	<BrowserRouter>
		<SelectedCompanyProvider>
			<App />
		</SelectedCompanyProvider>
	</BrowserRouter>
);
