import { useEffect, useState } from "react";
import { AlertIcon, EnergyIcon, RouterIcon, SearchIcon, SensorIcon } from "../../assets/icons";
import Button from "../../components/Button";
import { TreeContainer, TreeNode } from "../../components/TreeView";
import { useSelectedCompany } from "../../contexts/GlobalContext";
import { Item } from "../../types/company";
import { deepFilter, flattenArray, traverseTree } from "../../utils/treeViewFormat";

export default function Home() {
	const { selectedCompany, companyDetails, selectedAsset, loading, dispatch, selectedFilter, formattedTree } =
		useSelectedCompany();
	const openAllNodes = (nodes: Item[]) =>
		traverseTree(nodes, (node) => {
			node.isOpen = true;
		});
	const [filtered, setFiltered] = useState<Item[]>([]);

	useEffect(() => {
		if (!companyDetails) return;

		setFiltered(formattedTree?.length ? formattedTree : []);
	}, [formattedTree, companyDetails]);
	console.log("filtered", filtered);

	const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value?.toLowerCase();
		if (!value) {
			setFiltered(formattedTree);
			return;
		}

		const filtered = formattedTree.map((f) => deepFilter(f, "name", value, "includes")).filter(Boolean);

		setFiltered(filtered ? openAllNodes(filtered) : []);
	};

	const filterByEnergySensor = () => {
		if (selectedFilter === "energy") {
			dispatch({ type: "SET_SELECTED_FILTER", payload: null });
			setFiltered(formattedTree);
			return;
		}

		dispatch({ type: "SET_SELECTED_FILTER", payload: "energy" });

		const flat = flattenArray(formattedTree);

		// Create a map for quick parent-child lookups
		const nodeMap = new Map(flat.map((node) => [node.id, node]));

		// Collect nodes with sensorType "energy" and their ancestors
		const includedNodes = new Set();

		const collectWithParents = (node: Item, nodeMap: Map<string, Item>, includedNodes: Set<string>) => {
			while (node) {
				if (includedNodes.has(node.id)) break; // Stop if the node is already included
				includedNodes.add(node.id);
				node = node.parentId ? nodeMap.get(node.parentId) : null; // Move to the parent node
			}
		};

		// Filter nodes with "energy" and include their parents
		flat.forEach((node) => {
			if (node.sensorType === "energy") {
				collectWithParents(node, nodeMap, includedNodes);
			}
		});

		// Rebuild the tree from the collected nodes
		const filteredTree = formattedTree.map((root) => deepFilter(root, "sensorType", "energy")).filter(Boolean);

		setFiltered(openAllNodes(filteredTree));
	};
	const filterByCriticalStatus = () => {
		if (selectedFilter === "alert") {
			dispatch({ type: "SET_SELECTED_FILTER", payload: null });
			setFiltered(
				traverseTree(formattedTree, (node) => {
					node.isOpen = false;
				})
			);
			return;
		}
		dispatch({ type: "SET_SELECTED_FILTER", payload: "alert" });

		const flat = flattenArray(formattedTree);

		// Create a map for quick parent-child lookups
		const nodeMap = new Map(flat.map((node) => [node.id, node]));

		// Collect nodes with sensorType "energy" and their ancestors
		const includedNodes = new Set();
		console.log("node MAP ", nodeMap);
		console.log("INCLUDED NODES", includedNodes);

		const collectWithParents = (node: Item, nodeMap: Map<string, Item>, includedNodes: Set<string>) => {
			while (node) {
				if (includedNodes.has(node.id)) break; // Stop if the node is already included
				includedNodes.add(node.id);
				node = node.parentId ? nodeMap.get(node.parentId) : null; // Move to the parent node
			}
		};

		flat.forEach((node) => {
			if (node.sensorType === "energy") {
				collectWithParents(node, nodeMap, includedNodes);
			}
		});

		const filteredTree = formattedTree.map((root) => deepFilter(root, "status", "alert")).filter(Boolean);

		setFiltered(openAllNodes(filteredTree));
	};
	return (
		<div className="flex flex-col p-2 flex-grow ">
			<div id="mainHeader" className="flex justify-between items-center">
				<div className="flex gap-2 items-center">
					<span className="text-bold text-lg text-blac">Ativos</span>
					{selectedCompany && <span className="text-gray-400">/ {selectedCompany?.name} Unit</span>}
				</div>
				<div className="flex gap-2 items-center">
					<Button
						onClick={filterByEnergySensor}
						color={selectedFilter === "energy" ? "primary" : "outlined"}
						startIcon={<EnergyIcon />}
					>
						Sensor de energia
					</Button>
					<Button
						onClick={filterByCriticalStatus}
						startIcon={<AlertIcon />}
						color={selectedFilter === "alert" ? "primary" : "outlined"}
					>
						Crítico
					</Button>
				</div>
			</div>

			<div className="flex gap-2 mt-2  ">
				<div className="flex flex-col p-4 border w-[30%] overflow-y-scroll h-[80vh]">
					<div className="flex mb-2 border p-2 items-center justify-between focus-visible:shadow-md focus:shadow-md transition-all">
						<input
							onChange={handleFilter}
							className="outline-none focus:outline-none"
							placeholder="Buscar Ativo ou Local"
						/>
						<SearchIcon />
					</div>
					{loading && <span>loading</span>}
					<TreeContainer>
						{filtered?.length > 0 &&
							filtered.map((e, index) => (
								<TreeNode node={e} key={`${e.id}-${index}-${e.sensorId}`} />
								// <Tree item={e} />
							))}
					</TreeContainer>
				</div>
				<div className="flex border flex-col w-[70%] p-4 gap-2 ">
					{selectedAsset && (
						<div className="flex flex-col gap-4">
							<div className="font-bold text-lg flex gap-2 items-center ">
								{selectedAsset.name} {selectedAsset.sensorType === "energy" && <EnergyIcon />}
								{selectedAsset.status === "alert" && <AlertIcon />}
							</div>
							<div className="flex gap-4">
								<div className="border w-80 h-60">
									<img className="object-contain" alt="motor" src="/public/motor.png" />
								</div>

								<div className="flex flex-col gap-4 ">
									<div>
										<p>Tipo de equipamento</p>
										<span>Insira o tipo</span>
									</div>
									<div>
										<p>Responsáveis</p>
										<div className="flex items-center gap-2">
											<div className=" text-white text-center rounded-full w-6 h-6 bg-blue-500 ">E</div>
											<span>Elétrica</span>
										</div>
									</div>
								</div>
							</div>
							<div className="my-6">
								<Button color="outlined">Carregar imagem</Button>
							</div>
							<div className="flex mt-4 items-center justify-between">
								<div className="w-full">
									<p>Sensor</p>
									<div className="flex gap-2 items-center">
										<SensorIcon />
										{selectedAsset?.sensorId}
									</div>
								</div>
								<div className="w-full">
									<p>Receptor</p>
									<div className="flex gap-2 items-center">
										<RouterIcon />
										{selectedAsset?.gatewayId}
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
