import { withTV } from "tailwind-variants/transformer";
/** @type {import('tailwindcss').Config} */

export default withTV({
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {},
	},
	plugins: [],
});
