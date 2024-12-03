import { Asset, Assets, Item, Location, Locations } from "../types/company";

export const flattenArray = (arr: Item[]) => {
	const result: Item[] = [];
	const flat = (items: Item[]) => {
		items.forEach((item) => {
			result.push(item);
			if (item.children && item.children.length > 0) {
				flat(item.children);
			} // Optional: remove children property if not needed in the final flat array;
			// delete item.children;
		});
	};
	flat(arr);
	return result;
};
const getAssetType = (a: Asset) => {
	if (a.sensorType) return "component";
	if (a.parentId && !a.sensorId) return "asset";
	if (a.locationId && !a.sensorId) return "asset";
};
export const buildTreeViewLocationsByParentId = (locations: Locations): Item[] => {
	if (!locations?.length) return [];
	const map: { [key: string]: Item } = {};
	locations.forEach((item) => {
		map[item.id] = { ...item, type: "location", children: [] };
	});
	return locations.reduce<Item[]>((acc, item) => {
		if (item.parentId) {
			if (!map[item.parentId].children) {
				map[item.parentId].children = [];
			}
			map[item.parentId].children.push(map[item.id]);
		} else {
			acc.push(map[item.id]);
		}
		return acc.sort((a, b) => b.children!.length - a.children!.length);
	}, []);
};
export const buildTreeViewAssetsAndComponents = (assets: Assets): Item[] => {
	if (!assets?.length) return [];
	const map: { [key: string]: Item } = {};
	assets.forEach((item) => {
		map[item.id] = { ...item, type: getAssetType(item), children: [] };
	});
	return assets.reduce<Item[]>((acc, item) => {
		if (item.parentId) {
			if (!map[item.parentId].children) {
				map[item.parentId].children = [];
			}
			map[item.parentId].children.push(map[item.id]);
		} else {
			acc.push(map[item.id]);
		}
		return acc.sort((a, b) => b.children!.length - a.children!.length);
	}, []);
};

export const buildTreeViewWithAssets = (
	locations: Locations,
	assets: Assets & { type: "component" | "asset" }
): any[] => {
	if (!locations?.length || !assets?.length) return [];
	const formattedLocations = buildTreeViewLocationsByParentId(locations);

	assets
		.map((a) => ({ ...a, type: getAssetType(a) }))
		.sort((a) => (a.type === "asset" ? 1 : 0))
		.forEach((a: Asset & { type: "component" | "asset" }) => {
			const flattened: Item[] = flattenArray(formattedLocations);

			if (a.type === "asset") {
				console.log("asset", a);
				//If the item has a location and does not have a sensorId, it means he is an asset with a location as parent, from the location collection
				if (a.locationId && !a.sensorId) {
					const found = flattened.find((f) => f.id === a.locationId);
					if (found) {
						if (found.children) {
							found.children.push(a);
						} else {
							found.children = [a];
						}
					}
				}
				if (a.parentId && !a.sensorId) {
					const found = flattened.find((f) => f.id === a.parentId);
					if (found) {
						if (found.children) {
							found.children.push(a);
						} else {
							found.children = [a];
						}
					}
				}
				if (a.sensorType && a.parentId && !a.locationId) {
					console.log("a.sensorType && a.parentId && !a.locationId", a);
					const found = flattened.find((f) => f.id === a.parentId);
					if (found) {
						console.log(found);
						if (found.children) {
							found.children.push(a);
						} else {
							found.children = [a];
						}
					}
				}

				if (a.sensorType && !a.parentId && a.locationId) {
					const found = flattened.find((f) => f.id === a.locationId);
					if (found) {
						console.log(found);
						if (found.children) {
							found.children.push(a);
						} else {
							found.children = [a];
						}
					}
				}
			}

			if (a.type === "component") {
				console.log("component", a);
				if (!a.locationId && !a.parentId) {
					formattedLocations.push(a);
				}
				if (a.locationId) {
					const found = flattened.find((f) => f.id === a.locationId);
					if (found) {
						if (found.children) {
							found.children.push(a);
						} else {
							found.children = [a];
						}
					}
				}
				if (a.parentId) {
					const found = flattened.find((f) => f.id === a.parentId);
					if (found) {
						if (found.children) {
							found.children.push(a);
						} else {
							found.children = [a];
						}
					}
				}

				console.log(flattened);
				return;
			}
		});
	return formattedLocations;
};
export function findParent(node: Asset, nodes: Item[]): Item {
	if (!node.parentId && !node.locationId) return node;
	let found = null;
	if (node.parentId) {
		found = nodes.find((n) => n.id === node.parentId);
	}
	if (node.locationId) {
		found = nodes.find((n) => n.id === node.locationId);
	}
	if (!found?.parentId) {
		console.log("found", found);
		found = findParent(found, nodes);
	}

	return found;
}

export function deepFilterArr(treeArray: Item[], name: string) {
	function filterNode(node: Item): Item {
		// Check if the node itself matches the search criteria
		const nodeMatches = node.name.toLowerCase().includes(name.toLowerCase()); // Recursively filter the children
		const filteredChildren = node?.children.map(filterNode).filter(Boolean); // If the node matches or any of the children match, return the node with filtered children
		if (nodeMatches || filteredChildren.length > 0) {
			return { ...node, children: filteredChildren };
		} // If no match found, return null
		return null;
	}
	return treeArray.map(filterNode).filter(Boolean);
}
export function deepFilter(
	tree: Item,
	field: keyof Item,
	value: string | number,
	type: "exact" | "includes" = "exact"
) {
	if (!tree) return null;

	const matches = (node: Item) =>
		type === "exact"
			? node[field] === value
			: node[field]?.toString()?.toLowerCase().includes(value.toString()?.toLowerCase());

	const filterNode = (node: Item): Item | null => {
		if (matches(node)) {
			return { ...node, children: node.children?.map(filterNode).filter(Boolean) };
		}

		const filteredChildren = node.children?.map(filterNode).filter(Boolean);
		return filteredChildren?.length ? { ...node, children: filteredChildren } : null;
	};

	return filterNode(tree);
}

export function findDuplicates(arr: Item[]) {
	const seen = new Set();
	const duplicates = new Set();

	for (const item of arr) {
		if (seen.has(item)) {
			duplicates.add(item);
		} else {
			seen.add(item);
		}
	}

	return Array.from(duplicates);
}
export function traverseTree(nodes: Item[], callback: (item: Item) => void) {
	return nodes.map((node) => {
		// Apply the callback to the current node
		callback(node);

		// If the node has children, recursively apply the callback to them
		if (node.children && Array.isArray(node.children)) {
			node.children = traverseTree(node.children, callback);
		}

		return node; // Return the modified node
	});
}

function findNodeById(node: Location, id: string): Item {
	if (node.id === id) {
		return node;
	}
	if (Array.isArray(node.children)) {
		for (const child of node.children) {
			const result = findNodeById(child, id);
			if (result) {
				return result;
			}
		}
	}
	return null;
}
export function concatenateTrees(tree1: Locations, tree2: Assets): Item[] {
	tree2.forEach((k) => {
		if (!k.locationId && !k.parentId && k.type === "component") {
			tree1.push(k);
			return;
		}
		if (typeof k.locationId === "string") {
			tree1.forEach((t) => {
				const found = findNodeById(t, k.locationId);

				if (found) {
					found!.children!.push(k);
				}
			});
		}
	});
	return tree1;
}
