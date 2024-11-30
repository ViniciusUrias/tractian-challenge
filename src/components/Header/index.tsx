import Logo from "../../assets/tractianLogo.svg";
import CompaniesButton from "../../containers/CompaniesButton";
export default function Header() {
	return (
		<header className="bg-gray-900 p-6 px-8 flex justify-between items-center">
			<Logo />
			<div className="gap-2 flex">
				<CompaniesButton />
			</div>
		</header>
	);
}
