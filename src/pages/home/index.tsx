import EnergyIcon from "../../assets/energyIcon.svg";
import WarningIcon from "../../assets/warningIcon.svg";
import Button from "../../components/Button";
import { TreeNode } from "../../components/TreeView";
import { useSelectedCompany } from "../../contexts/GlobalContext";
import {
	buildTreeViewAssetsAndComponents,
	buildTreeViewLocationsByParentId,
	concatenateTrees,
} from "../../utils/treeViewFormatForeach";

export default function Home() {
	const { selectedCompany, companyDetails } = useSelectedCompany();

	console.log("formatted locations", buildTreeViewLocationsByParentId(companyDetails?.locations));
	console.log("formatted assets", buildTreeViewAssetsAndComponents(companyDetails?.assets));
	console.log(
		"concatenated trees",
		concatenateTrees(
			buildTreeViewLocationsByParentId(companyDetails?.locations),
			buildTreeViewAssetsAndComponents(companyDetails?.assets)
		)
	);
	const treeView = concatenateTrees(
		buildTreeViewLocationsByParentId(companyDetails?.locations),
		buildTreeViewAssetsAndComponents(companyDetails?.assets)
	).sort((a, b) => b.children!.length - a.children!.length);
	console.log("treeView", treeView);

	return (
		<div className="flex flex-col p-2 flex-grow ">
			<div id="mainHeader" className="flex justify-between items-center">
				<div className="flex gap-2 items-center">
					<span className="text-bold text-lg text-blac">Ativos</span>
					<span className="text-gray-400">/ {selectedCompany?.name} Unit</span>
				</div>
				<div className="flex gap-2 items-center">
					<Button color="outlined" startIcon={<EnergyIcon />}>
						Sensor de energia
					</Button>
					<Button startIcon={<WarningIcon />} color="outlined">
						Crítico
					</Button>
				</div>
			</div>

			<div className="flex gap-2 mt-2  bg-blue-300">
				<div className="flex flex-col w-[30%]">
					<input style={{ all: "unset" }} placeholder="Buscar Ativo ou Local" />

					{treeView.map((e) => (
						<TreeNode node={e} key={e.id} />
						// <Tree item={e} />
					))}
				</div>
				<div className="flex flex-col w-[70%] bg-red-300"></div>
			</div>
		</div>
	);
}
