import * as React from "react";
import classname from "classnames";
interface IModalPay {
	show: boolean;
	center?: boolean;
	opacity?: number;
	setShowPay?: any;
	price: number;
	success: boolean;
	setSuccess?: any;
	setToggle?:any
}

const ModalPay: React.FC<IModalPay> = (props) => {
	const regex = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

	const [money, setMoney] = React.useState("");
	
	const test = (e: any) => {
		e.preventDefault();
		setMoney(e.target.value);
	};
	React.useMemo(()=>{
		if(props.success){
			setMoney('')
		}
	},[props])
	
	return (
		<>
			<div
				className={classname("modal", {
					"modal-dialog-centered": props.center,
				})}
				style={{
					display: props.show ? "block" : "none",
					background: `rgba(0,0,0,0.4)`,
				}}>
				<div
					className={classname("modal-dialog animated fadeInDown modal-lg ")}>
					<div className="modal-content p-5">
						{!props.success ? (
							<>
								<h3>Money</h3>
								<input
									type="text"
									className='form-control mb-3'
									placeholder={"cash"}
									onChange={test}
									onKeyDown={(e) => {
										if (e.key !== "Backspace") {
											!regex.includes(e.key) && e.preventDefault();
										}
									}}
									value={money}
								/>
								<div className="d-flex justify-content-between mb-3">
									<label>Paying</label>
									<label>{props.price}</label>
								</div>
								<div className="d-flex justify-content-between">
									<label>Change</label>
									{money !== "" ? (
										<label>{+money - props.price}</label>
									) : (
										<label>0</label>
									)}
								</div>

								<div>
									<button
										type="button"
										className="btn btn-secondary"
										style={{marginRight:'20px'}}
										onClick={() => {
											props.setShowPay(false);
											props.setSuccess(false);
											props.setToggle(true);
											setMoney("");
										}}>
										Cancel
									</button>
									<button
										type="submit"
										style={{marginLeft:'20px'}}
										className="btn btn-primary "
										disabled={+money < props.price ? true : false}
										onClick={() => props.setSuccess(true)}>
										Pay
									</button>
								</div>
							</>
						) : (
							<>
								<i
						className="material-icons px-2"
						style={{fontSize:'140px',cursor:'pointer',color:'green'}}>
						check_circle
					</i>
								<h1>Successful</h1>
							</>
						)}
					</div>
				</div>
			</div>
		</>
	);
};
export default ModalPay;
