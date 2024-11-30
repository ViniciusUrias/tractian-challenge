import { useEffect, useState } from "react";
import { getAllCompanies } from "../services/CompanyService";
import { Companies } from "../types/company";

const useGetCompanies = () => {
	const [companies, setCompanies] = useState<Response & { data: Companies; error?: any; refetch: () => void }>(null);
	const [loading, setLoading] = useState(false);
	const fetchCompanies = async () => {
		try {
			setLoading(true);
			const response = await getAllCompanies();
			console.log("RESPONSE", response);
			setCompanies(response);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setCompanies({ error: { message: error ?? "Something went wrong.." } });
		}
	};
	useEffect(() => {
		fetchCompanies();
	}, []);

	return { ...companies, refetch: fetchCompanies };
};

export default useGetCompanies;
