import React from 'react';
import { useState,useEffect,useMemo } from 'react';
import './App.css';
import data from './data.json'
import CardBook from './Book/CardBook';
import classnames from 'classnames'
import Sidebar from './Book/Sidebar';
import _ from "lodash";
import ModalPay from "./Book/ModalPay";
import Modal from './Book/Modal'
const discountDetails:any = {2:10,3:11,4:12,5:13,6:14,7:15}	

function App() {
	const [books, setBooks]: any[] = useState([]);
	const [discountP, setdiscountP] = useState(0);
	const [allBook, setAllBooks] = useState([]);
	const [toggle, setToggle] = useState(false);
	const [deleteId,setDeleteId] = useState('')
	const [modalDel,setModalDel] = useState(false)
	const [showPay, setShowPay] = useState(false);
	const [price, setPrice] = useState(0);
	const [success, setSuccess] = useState(false);
	
	useMemo(() => {		
		if (success) {
			setBooks([]);
			setTimeout(() => {
				setSuccess(false);
				setToggle(false);;
				setShowPay(false);
			}, 1000);
		}
		if (!showPay && !toggle) {
			setBooks([]);
		}
		if(toggle ){
			document.body.style.overflow = 'hidden'
		}

		if(!success && !toggle && !showPay){
			document.body.style.overflow = 'auto'

		}
	}, [success, toggle, showPay]);


	const fetchBook = async () => {
		let url =
			"https://akita-examination.s3-ap-southeast-1.amazonaws.com/shiba-book-shop.json";
		let response = await fetch(url);
		let commits = await response.json();
		setAllBooks(commits.books);
	};
	useEffect(() => {
		fetchBook();
	}, []);

	const sumDisCount = (data:any) =>{
		var dis = 0
		data.map((da:any) =>{ 
			const num  = _.filter(da,elm=>elm !== 0).length
			var countPrice = da.reduce(function(acc:any, val:any) { return acc + val; }, 0)
	
			if(num > 1){
				dis = dis + (discountDetails[num] / 100 * countPrice)
			}
		})
		setdiscountP(dis)


	}
	const checkDiscount = (data:any) =>{
		let getBook:any[] = []
		let deleteNoHarry = _.filter(data,elm=>elm.id !== '9780241392362')		
		const maxCount = deleteNoHarry.reduce((pre, cur) => pre = pre > cur.count ? pre : cur.count, 0);
		if(maxCount>1 && deleteNoHarry.length>1){
			for(var i=maxCount;i > 0;i--){		
				const objData = deleteNoHarry.map((elm:any)=>{
						return elm.count <= 0 ?0:+elm.price
					})				
				const checkDis = deleteNoHarry.map( (value:any)=>{
					return {
						...value,
						count: value.count - 1
					}
				})
				deleteNoHarry = checkDis
				getBook.push(objData)
			}
			sumDisCount(getBook)	
		}else{
			setdiscountP(0)	

		}

	}
 	const deleteBooks = () => {
		const objData = _.filter(books, (elm) => elm.id !== deleteId);
		if(objData.length === 0){
			setToggle(false)
		}
		checkDiscount(objData)
		setBooks(objData);
		setModalDel(false)
	};

	const modalDelete = (e:any)=>{
		setModalDel(true)
		setDeleteId(e.id)
	}
	const selectBooks = (e: any) => {
		const filter2 = _.filter(books, (elm) => elm?.id === e.id);
		if (filter2.length !== 0 && books.length !== 0) {
			e.count = e.count + 1;
		} else {
			e.count = 1;
		}
		const obj = [...books, e];
		const unique = obj
			.map((e) => e["id"])
			.map((e, i, final) => final.indexOf(e) === i && i)
			.filter((e: any) => obj[e])
			.map((e: any) => obj[e]);
		
		checkDiscount(unique)
		setBooks(unique);
		setToggle(true);
	};

	useEffect(() => {
		let count = 0;
		const price = books.map((data: any) => {
			count = data.count * +data.price;
			return count;
		});
		var sum = price.reduce(function (a: any, b: any) {
			return a + b;
		}, 0);
		setPrice(sum);
	}, [books]);
	return (
		<>
			<div
				className={classnames("text-center head py-3", {
					headerShop: toggle,
				})}>
				<h1 className="mb-2 mt-4">Shiba Book Store</h1>
				<div className="displayRow">
					<div
						className={classnames("row mx-0", {
							toggleSide: toggle,
						})}>
					{/* {allBook.map((item: any, key: number) => ( */}

						{data.books.map((item: any, key: number) => (
							<CardBook
								key={key}
								book={item}
								selectBooks={selectBooks}
								toggle={toggle}
							/>
						))}
					</div>
				</div>
				<div
					className={classnames("sidebar pt-5", {
						closeSlide: !toggle,
					})}>
					<h2>Order</h2>
					<Sidebar
						data={books}
						showPay={showPay}
						setShowPay={setShowPay}
						price={price}
						deleteBooks={modalDelete}
						setToggle={setToggle}
						discountP={discountP}
					/>
					<ModalPay
						show={showPay}
						setToggle={setToggle}
						setShowPay={setShowPay}
						price={price - discountP}
						success={success}
						setSuccess={setSuccess}
					/>
				</div>
			</div>
		    <Modal show = {modalDel} size = {'modal-md'}>
			<div className="modal-content p-5 text-center">

				<p>Do you want delete this selected book?</p>
				<div>
									<button
										type="button"
										className="btn btn-secondary"
										style={{marginRight:'20px'}}
										onClick={()=>setModalDel(false)}>
	
										Cancel
									</button>
									<button
										type="submit"
										style={{marginLeft:'20px'}}
										className="btn btn-primary "
										onClick={deleteBooks}>
										Confirm
									</button>
								</div>
								</div>
			</Modal>
		</>
	);
}

export default App;
