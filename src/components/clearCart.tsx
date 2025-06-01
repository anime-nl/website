'use client';

import { useEffect } from 'react';

export default function ClearCart(props: { shouldClear: boolean }) {

	useEffect(() => {
		if (props.shouldClear) {
			localStorage.removeItem('cart');
		}
	}, []);

	return (<></>);
}