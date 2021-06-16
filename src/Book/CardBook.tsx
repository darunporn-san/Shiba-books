import * as React from "react";
import classnames from "classnames";

interface DataBook {
	cover: string;
	id: string;
	price: string;
	title: string;
}
interface ICardBook {
	book: DataBook;
	selectBooks: (select: string) => void;
	toggle?: boolean;
}
const CardBook: React.FC<ICardBook> = (props: any) => {
	return (
		<>
			<div
				className="cardbook col"
				onClick={() => props.selectBooks(props.book)}
				style={{ cursor: "pointer" }}>
				<p
					className={classnames("textPrice mb-0 mt-2", {
						slidePrice: props.toggle,
					})}>
					{props.book.price} ฿{" "}
				</p>

				<img
					className={classnames({
						imgSlide: props.toggle,
					})}
					src={props.book.cover}
				/>
				<p>{props.book.title}</p>
			</div>
		</>
	);
};
export default CardBook;
