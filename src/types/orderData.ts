export default interface OrderData {
	form: {
		firstName: string;
		middleName: string;
		lastName: string;
		email: string;
		phone: string;
		street: string;
		houseNumber: string;
		notes: string;
		postalCode: string;
		city: string;
		country: string;
	};
	cart: {
		name: string;
		qty: number;
	}[];
	shipping: number;
	method: string;
}
