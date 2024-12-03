import { twMerge } from "tailwind-merge";
import Gold from "../../assets/gold.svg";
import Button from "../../components/Button";
import { useSelectedCompany } from "../../contexts/GlobalContext";
import useGetCompanies from "../../hooks/useGetCompanies";
export default function CompaniesButton() {
	const { data: companies, status, error, ok, refetch } = useGetCompanies();
	console.log({ companies, status, error, ok });
	const { selectedCompany, dispatch } = useSelectedCompany();
	if (!ok) return <Button onClick={refetch}>Refetch</Button>;

	return (
		<>
			{companies?.map((company) => {
				const isSelected = selectedCompany?.id === company.id;
				return (
					<Button
						key={company.id}
						className={twMerge(isSelected && "bg-blue-700")}
						startIcon={<Gold />}
						onClick={() => {
							dispatch({ payload: company, type: "SET_SELECTED_COMPANY" });
							dispatch({ payload: null, type: "SET_SELECTED_ASSET" });
							dispatch({ type: "SET_FORMATTED_TREE", payload: null });
						}}
					>
						{company.name} Unit
					</Button>
				);
			})}
		</>
	);
}
