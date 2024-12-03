import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
	AlertIcon,
	AssetIcon,
	CheckIcon,
	ChevronDown,
	ChevronUp,
	ComponentIcon,
	EnergyIcon,
	LocationIcon,
} from "../../assets/icons";
import { useSelectedCompany } from "../../contexts/GlobalContext";
import { Item } from "../../types/company";
const isArray = (item) => Array.isArray(item?.children) && item?.children?.length > 0;

export const getNodeTypeIcon = {
	location: <LocationIcon />,
	asset: <AssetIcon />,
	component: <ComponentIcon />,
};
export function TreeContainer({ children }) {
	return <div>{children}</div>;
}
export function TreeNode({ node, ...rest }: { node: Item }) {
	const { dispatch, selectedAsset } = useSelectedCompany();
	const { children, name, sensorType, status, id, isOpen, type } = node;
	const [showChildren, setShowChildren] = useState(isOpen);
	const hasChildren = children?.length > 0;
	useEffect(() => {
		setShowChildren(isOpen);
	}, [isOpen]);
	const isSelected = selectedAsset?.id === id;
	const isAsset = type === "asset";
	const isComponent = type === "component";
	const handleClick = () => {
		setShowChildren(!showChildren);
		if (!hasChildren && (isComponent || isAsset)) {
			dispatch({ payload: node, type: "SET_SELECTED_ASSET" });
		}
	};
	const titleClassname = isAsset ? "font-semibold" : isComponent ? "italic" : hasChildren ? "font-bold" : "";
	return (
		<div {...rest}>
			<div
				className={twMerge(["flex items-center gap-2 cursor-pointer px-1", isSelected && "bg-blue-400 "])}
				onClick={handleClick}
				style={{ marginBottom: "10px" }}
			>
				{!children?.length ? null : !showChildren ? <ChevronUp /> : <ChevronDown />}
				{getNodeTypeIcon[type]}
				<span className={twMerge([titleClassname])}>{name}</span>
				{sensorType === "energy" && <EnergyIcon />}
				{status === "alert" && <AlertIcon />}
				{status === "operating" && <CheckIcon />}
				{/* {hasChildren && (
					<div
						className={twMerge(["absolute left-3 w-px bg-red-300", showChildren ? "h-full" : "h-0"])}
						style={{ top: "20px" }}
					></div>
				)} */}
			</div>

			{/* Children Nodes */}
			{isArray(node) && showChildren && (
				<ul className="list-none list-image-none ml-2 pl-2 relative">
					{/* X-Line and Child Nodes */}
					{children.map((childNode, index) => (
						<li key={childNode.id} className="relative flex items-start">
							{/* X-Line */}
							{/* <div className="absolute left-[-1.5rem] top-4 h-px w-6 bg-gray-300"></div> */}
							{/* Child Node */}
							<TreeNode node={childNode} />
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
