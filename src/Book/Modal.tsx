import classname from "classnames";

interface IModal {
	show: boolean;
	center?: boolean;
	opacity?: number;
	size?: string;
}
const Modal: React.FC<IModal> = (props) => {
	return (
		<div
			className={classname("modal", {
				"modal-dialog-centered": props.center,
			})}
			style={{
				display: props.show ? "block" : "none",
				background: `rgba(0,0,0,0.4)`,
			}}>
			<div
				className={classname("modal-dialog animated fadeInDown", props.size)}>
				{props.children}
			</div>
		</div>
	);
};
export default Modal;
