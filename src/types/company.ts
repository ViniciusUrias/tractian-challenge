export type Company = {
	name: string;
	id: string;
};

export type Companies = Company[];

export type Locations = Location[];

export interface Location {
	id: string;
	name: string;
	parentId?: string;
	children?: Asset[] | Location[];
}

export type Assets = Asset[];

export interface Asset {
	id: string;
	locationId?: string;
	name: string;
	parentId?: string;
	sensorType?: string;
	status?: string;
	gatewayId?: string;
	sensorId?: string;
	type?: string;
	children?: Asset[] | Location[];
}

export type Item = Asset & Location & { isOpen?: boolean };
