import React, { createContext, ReactNode, useContext, useEffect, useReducer } from "react";
import { getCompanyAssetsById, getCompanyLocationsById } from "../../services/CompanyService";
import { Asset, Assets, Company, Item, Locations } from "../../types/company";
import {
	buildTreeViewAssetsAndComponents,
	buildTreeViewLocationsByParentId,
	concatenateTrees,
} from "../../utils/treeViewFormat";

type CompanyDetails = {
	locations: Locations;
	assets: Assets;
};
type Filter = "energy" | "alert" | null;
type Action =
	| { type: "SET_SELECTED_COMPANY"; payload: Company | null }
	| { type: "SET_COMPANY_DETAILS"; payload: CompanyDetails | null }
	| { type: "SET_SELECTED_ASSET"; payload: Asset | null }
	| { type: "SET_LOADING"; payload: boolean }
	| { type: "SET_SELECTED_FILTER"; payload: Filter }
	| { type: "SET_FORMATTED_TREE"; payload: Item[] | null };

interface ContextState {
	selectedCompany: Company | null;
	companyDetails: CompanyDetails | null;
	selectedAsset: Asset | null;
	loading: boolean;
	dispatch: React.Dispatch<Action>;
	selectedFilter: Filter;
	formattedTree: Item[] | [];
}
const initialState: ContextState = {
	selectedCompany: null,
	companyDetails: null,
	selectedAsset: null,
	loading: false,
	dispatch: () => {},
	selectedFilter: null,
	formattedTree: [],
};

function reducer(state: ContextState, action: Action) {
	switch (action.type) {
		case "SET_SELECTED_COMPANY":
			return { ...state, selectedCompany: action.payload };
		case "SET_COMPANY_DETAILS":
			return { ...state, companyDetails: action.payload };
		case "SET_SELECTED_ASSET":
			return { ...state, selectedAsset: action.payload };
		case "SET_LOADING":
			return { ...state, loading: action.payload };
		case "SET_SELECTED_FILTER":
			return { ...state, selectedFilter: action.payload };
		case "SET_FORMATTED_TREE":
			return { ...state, formattedTree: action.payload };

		default:
			throw new Error(`Unknown action type: ${action.type}`);
	}
}
// Create the context with default values
const SelectedCompanyContext = createContext<ContextState | undefined>(undefined);

const base = (locations: Locations, assets: Assets): Item[] =>
	concatenateTrees(buildTreeViewLocationsByParentId(locations), buildTreeViewAssetsAndComponents(assets)).sort(
		(a, b) => b.children!.length - a.children!.length
	);

export const SelectedCompanyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	console.log("STATE IN CONTEXT", state);
	useEffect(() => {
		if (!state.selectedCompany?.id) return;
		const fetchCompanyDetails = async () => {
			dispatch({ type: "SET_LOADING", payload: true });
			dispatch({ type: "SET_FORMATTED_TREE", payload: null });
			dispatch({ type: "SET_SELECTED_FILTER", payload: null });

			try {
				const assetsResponse = await getCompanyAssetsById({ companyId: state.selectedCompany.id });
				const locationsResponse = await getCompanyLocationsById({ companyId: state.selectedCompany.id });
				console.log({ assetsResponse, locationsResponse });
				dispatch({ type: "SET_FORMATTED_TREE", payload: base(locationsResponse.data, assetsResponse.data) });
				dispatch({
					type: "SET_COMPANY_DETAILS",
					payload: { locations: locationsResponse.data, assets: assetsResponse.data },
				});
			} catch (error) {
				console.error("Error fetching company details:", error);
			} finally {
				dispatch({ type: "SET_LOADING", payload: false });
			}
		};
		fetchCompanyDetails();
	}, [state.selectedCompany]);
	return <SelectedCompanyContext.Provider value={{ ...state, dispatch }}>{children}</SelectedCompanyContext.Provider>;
};

// Custom hook to use the SelectedCompanyContext
export const useSelectedCompany = (): ContextState => {
	const context = useContext(SelectedCompanyContext);
	if (!context) {
		throw new Error("useSelectedCompany must be used within a SelectedCompanyProvider");
	}
	return context;
};
