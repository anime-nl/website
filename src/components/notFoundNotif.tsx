'use client';

import { addToast } from '@heroui/toast';

export default function NotFoundNotif() {
	addToast({
		title: 'Uh Oh',
		description: `Dit product kon niet worden gevonden`,
		color: 'danger',
		variant: 'solid',
		timeout: 3000
	});
	return (<></>);
}
