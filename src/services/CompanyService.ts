import { Assets, Companies, Locations } from "../types/company";

const baseUrl = "https://fake-api.tractian.com";

export const getAllCompanies = async () => {
	const response = await fetch(`${baseUrl}/companies`);

	const data: Companies = await response.json();
	const { status, ok, statusText, headers, url } = response;

	return { data, status, ok, statusText, headers, url };
};
export const getCompanyLocationsById = async ({ companyId }: { companyId: string }) => {
	const response = await fetch(`${baseUrl}/companies/${companyId}/locations`);

	const data: Locations = await response.json();
	const { status, ok, statusText, headers, url } = response;

	return { data, status, ok, statusText, headers, url };
};
export const getCompanyAssetsById = async ({ companyId }: { companyId: string }) => {
	const response = await fetch(`${baseUrl}/companies/${companyId}/assets `);

	const data: Assets = await response.json();
	const { status, ok, statusText, headers, url } = response;

	return { data, status, ok, statusText, headers, url };
};
