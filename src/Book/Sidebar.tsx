import * as React from "react";
import _ from "lodash";
import ModalPay from "./ModalPay";
interface DataBook {
	count?: number;
	cover: string;
	id: string;
	price: string;
	title: string;
}

interface ISidebar {
	data: any[];
	showPay: boolean;
	setShowPay: any;
	price: number;
	deleteBooks: (action: any) => void;
	setToggle?:any
	discountP:number

}

const Sidebar: React.FC<ISidebar> = (props) => {
	return (
		<>
			<div className ="mx-3 h-100">
				<div className = 'selectBook'>
					{props.data.map((books: any, key: number) => (
				<ItemList key = {key} deleteBooks={props.deleteBooks} data={books} />
			))}
				</div>
				
			<div className="allPrice">
			<div className="d-flex justify-content-between my-2 mx-3">
				
				<div>Total: </div>
				<div>{props.price}</div>

			</div>

			<div className="d-flex justify-content-between my-2 mx-3">
				
				<div>Discount: </div>
				<div>{props.discountP}</div>

			</div>
			<div className="d-flex justify-content-between my-2 mx-3">
				
				<div>Total After Discount: </div>
				<div>{props.price - props.discountP}</div>

			</div>
			<div>
				<button type="button" className="mx-2 btn btn-secondary" onClick={()=>props.setToggle(false)}>
					Cancel
				</button>
				<button
					type="button"
					className="btn btn-primary"
					onClick={() => props.setShowPay(true)}>
					Pay
				</button>
			</div>
			</div>
			
			</div>
			
		</>
	);
};
export default Sidebar;

interface IItemList {
	deleteBooks: (action: any) => void;
	data: DataBook;
}
const ItemList = (props: IItemList) => {
	let total = 0
	if(props.data.count !== undefined){
		total = +props.data.price * props.data.count
	}
	return (
		<>
			<div className="text-start mx-3">{props.data.title}</div>
			<div className="mx-3 d-flex justify-content-between pt-2 pl-2 mb-3" style={{backgroundColor:'wheat',paddingLeft:'8px'}}>
				<div className="">
					{props.data.count}
				</div>
				<div style={{ display: "inherit" }}>
					<p className="mb-0">{total}</p>
					<i
						className="material-icons px-2"
						style={{fontSize:'14px',cursor:'pointer'}}
						onClick={() => props.deleteBooks(props.data)}>
						delete_outline
					</i>
				</div>
			</div>
		</>
	);
};
