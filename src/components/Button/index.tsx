import { tv, VariantProps } from "tailwind-variants";

const button = tv({
	base: "font-medium bg-blue-500 text-white  rounded-none active:opacity-80 flex flex-row items-center gap-2",
	variants: {
		color: {
			primary: "bg-blue-500 text-white",
			secondary: "bg-purple-500 text-white",
			outlined: "bg-white border border-gray-500 text-gray-500", // Add outlined variant
		},
		size: {
			sm: "text-sm",
			md: "text-base",
			lg: "px-4 py-3 text-lg",
		},
		rounded: {
			none: "rounded-none",
			sm: "rounded-sm",
			md: "rounded-md",
			lg: "rounded-lg",
		},
	},
	compoundVariants: [
		{
			size: ["sm", "md"],
			class: "px-3 py-1",
		},
	],
	defaultVariants: {
		size: "md",
		color: "primary",
		rounded: "md",
	},
});
type ButtonVariants = VariantProps<typeof button>;

type ButtonProps = ButtonVariants & {
	startIcon?: React.ReactNode;
	endIcon?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
const Button = ({ size, color, children, startIcon, endIcon, ...rest }: ButtonProps) => (
	<button {...rest} className={button({ size, color, className: rest.className })}>
		{startIcon ?? null}
		{children}
		{endIcon ?? null}
	</button>
);

export default Button;
