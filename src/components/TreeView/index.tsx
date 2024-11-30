import { useState } from "react";
import {
	AlertIcon,
	AssetIcon,
	ChevronDown,
	ChevronUp,
	ComponentIcon,
	EnergyIcon,
	LocationIcon,
} from "../../assets/icons";

const isArray = (item) => Array.isArray(item?.children) && item?.children?.length > 0;

const getNodeTypeIcon = {
	location: <LocationIcon />,
	asset: <AssetIcon />,
	component: <ComponentIcon />,
};

export function TreeNode({ node, ...rest }) {
	const { children, name, sensorType, status } = node;

	const [showChildren, setShowChildren] = useState(false);

	const handleClick = () => {
		setShowChildren(!showChildren);
	};
	const renderRow = ({ index, style }) => {
		const child = children[index];
		console.log(child, index);
		return (
			<li style={{ ...style }} key={child.id}>
				<TreeNode node={child} />
			</li>
		);
	};
	const getItemSize = (index) => {
		const child = children[index];
		return child.length ? child.length * 10 : 100;
	};

	return (
		<div {...rest} className="list-none ">
			<div className="flex items-center gap-2" onClick={handleClick} style={{ marginBottom: "10px" }}>
				{!children?.length ? null : !showChildren ? <ChevronUp /> : <ChevronDown />}
				{getNodeTypeIcon[node.type]}
				<span>{name}</span>
				{sensorType === "energy" && <EnergyIcon />}
				{status === "alert" && <AlertIcon />}
			</div>
			{isArray(node) && showChildren && (
				// <List itemCount={children.length} height={200} itemSize={getItemSize} width={"100%"}>
				// 	{renderRow}
				// </List>

				<ul className="list-none list-image-none ml-2 transition-all">
					{showChildren && children.map((c) => <TreeNode node={c} />)}
				</ul>
			)}
			{/* {isArray(node) && <ul className="list-none list-image-none ml-2">{showChildren && <Tree item={node} />}</ul>} */}
		</div>
	);
}
