import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getCompanyAssetsById, getCompanyLocationsById } from "../../services/CompanyService";
import { Assets, Company, Locations } from "../../types/company";

type CompanyDetails = {
	locations: Locations;
	assets: Assets;
};
// Define the context type
interface SelectedCompanyContextType {
	selectedCompany: Company | null;
	setSelectedCompany: (company: Company) => void;
	companyDetails: CompanyDetails | null;
}

// Create the context with default values
const SelectedCompanyContext = createContext<SelectedCompanyContextType | undefined>(undefined);

// Create a provider component
export const SelectedCompanyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
	const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);
	useEffect(() => {
		if (!selectedCompany?.id) return;

		const fetchCompanyDetails = async () => {
			const assetsResponse = await getCompanyAssetsById({ companyId: selectedCompany.id });
			const locationsResponse = await getCompanyLocationsById({ companyId: selectedCompany.id });
			console.log({ assetsResponse, locationsResponse });
			setCompanyDetails({ locations: locationsResponse.data, assets: assetsResponse.data });
		};
		fetchCompanyDetails();
	}, [selectedCompany]);
	return (
		<SelectedCompanyContext.Provider value={{ selectedCompany, setSelectedCompany, companyDetails }}>
			{children}
		</SelectedCompanyContext.Provider>
	);
};

// Custom hook to use the SelectedCompanyContext
export const useSelectedCompany = (): SelectedCompanyContextType => {
	const context = useContext(SelectedCompanyContext);
	if (!context) {
		throw new Error("useSelectedCompany must be used within a SelectedCompanyProvider");
	}
	return context;
};
