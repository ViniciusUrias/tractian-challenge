import { Asset, Assets, Locations } from "../types/company";
type Item = { id: string; name: string; parentId: string | null; children?: Item[] };

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
const flattenArray = (arr) => {
	const result = [];
	const flat = (items) => {
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
export const buildTreeViewWithAssets = (
	locations: Locations,
	assets: Assets & { type: "component" | "asset" }
): any[] => {
	if (!locations?.length || !assets?.length) return [];
	const formattedLocations = buildTreeViewLocationsByParentId(locations);

	const formatedAssets = assets.map((a) => {
		const type = getAssetType(a);
		const flattened: Item[] = flattenArray(formattedLocations);

		if (type === "asset") {
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
		if (type === "component") {
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
		}
		console.log(flattened);
		return flattened;
	});
	console.log(formatedAssets);
	return formattedLocations;
};
