import React from 'react';
import './App.css';
import * as axios from 'axios'
import data from './data.json'
import CardBook from './Book/CardBook';
import classnames from 'classnames'
import Sidebar from './Book/Sidebar';
import _ from "lodash";
import ModalPay from "./Book/ModalPay";

function App() {
	const [books, setBooks]: any[] = React.useState([]);
	const [discountP, setdiscountP] = React.useState(0);
	const [allBook, setAllBooks] = React.useState([]);
	const [toggle, setToggle] = React.useState(false);
	const [showPay, setShowPay] = React.useState(false);
	const [price, setPrice] = React.useState(0);
	const [success, setSuccess] = React.useState(false);
	const discountDetails:any = {2:10,3:11,4:12,5:13,6:14,7:15}	
	
	React.useMemo(() => {		
		if (success) {
			setBooks([]);
			setTimeout(() => {
				setSuccess(false);
				setToggle(false);;
				setShowPay(false);
			}, 3000);
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
	React.useEffect(() => {
		fetchBook();
	}, []);

	const sumDisCount = (data:any) =>{
		var dis = 0
		data.map((da:any) =>{ 
			const num  = _.filter(da,elm=>elm !== 0).length
			var countPrice = da.reduce(function(acc:any, val:any) { return acc + val; }, 0)
	
			if(num > 1){
				// console.log('countPrice',countPrice);
				// console.log('findDiscount',discountDetails[num]);
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
		}

	}
 	const deleteBooks = (e: any) => {
		const objData = _.filter(books, (elm) => elm.id !== e.id);
		setBooks(objData);

		// setList(objData);
	};

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

	// React.useEffect(() => {
	// 	if (!showPay) {
	// 		setToggle(false);
	// 	}
	// }, [showPay]);

	React.useEffect(() => {
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
			<div className={classnames("text-center head py-3", {
						headerShop: toggle,
					})}>
				<h1 className="mb-2 mt-4">Shiba Book Store</h1>
				<div className="displayRow" >

				<div
					className={classnames("row mx-0", {
						toggleSide: toggle,
					})}>
					{allBook.map((item: any, key: number) => (
						<CardBook key = {key} book={item} selectBooks={selectBooks} toggle={toggle} />
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
						deleteBooks={deleteBooks}
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
		</>
	);
}

export default App;
