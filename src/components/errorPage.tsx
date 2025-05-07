'use client';
import { Alert } from '@heroui/alert';
import { Button } from '@heroui/button';
import { useRouter } from 'next/navigation';

export default function ErrorPage(props: { error: string }) {
	const router = useRouter();

	return (
		<div className="dark mx-16 pt-16 min-h-screen font-[family-name:var(--font-geist-sans)]">
			<span className="flex animate-appearance-in">
				<Alert
					color={'danger'}
					title={props.error}
					endContent={
						<Button
							color="danger"
							size="sm"
							variant="flat"
							onPress={() => {
								router.push('/');
							}}
						>
							Return to home
						</Button>
					}
				/>
			</span>
		</div>
	);
}
