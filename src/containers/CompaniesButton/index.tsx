import { twMerge } from "tailwind-merge";
import Gold from "../../assets/gold.svg";
import Button from "../../components/Button";
import { useSelectedCompany } from "../../contexts/GlobalContext";
import useGetCompanies from "../../hooks/useGetCompanies";
export default function CompaniesButton() {
	const { data: companies, status, error, ok, refetch } = useGetCompanies();
	console.log({ companies, status, error, ok });
	const { selectedCompany, setSelectedCompany } = useSelectedCompany();
	if (!ok) return <Button onClick={refetch}>Refetch</Button>;

	return (
		<>
			{companies?.map((company) => {
				const isSelected = selectedCompany?.id === company.id;
				return (
					<Button
						className={twMerge(isSelected && "bg-blue-700")}
						startIcon={<Gold />}
						onClick={() => setSelectedCompany(company)}
					>
						{company.name} Unit
					</Button>
				);
			})}
		</>
	);
}
