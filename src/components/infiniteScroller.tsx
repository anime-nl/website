'use client';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import * as React from 'react';

type loadMoreAction = (offset: string | number | undefined) => Promise<readonly [React.JSX.Element, number | null]>

const LoadMore = ({
	                  initialOffset,
	                  loadMoreAction
                  }: React.PropsWithChildren<{
	initialOffset: number;
	loadMoreAction: loadMoreAction;
}>) => {
	const ref = React.useRef<HTMLButtonElement>(null);
	const [loadMoreNodes, setLoadMoreNodes] = React.useState<React.JSX.Element[]>([]);

	const currentOffsetRef = React.useRef<number | string | undefined>(initialOffset);
	const [scrollLoad] = React.useState(true);
	const [loading, setLoading] = React.useState(false);

	const loadMore = React.useCallback(
		async (abortController?: AbortController) => {
			setLoading(true);

			loadMoreAction(currentOffsetRef.current)
				.then(([node, next]) => {
					if (abortController?.signal.aborted) return;

					setLoadMoreNodes(() => {
						return [node];
					});

					if (next === null) {
						currentOffsetRef.current ??= undefined;
						return;
					}

					currentOffsetRef.current = next;
				})
				.catch(() => {
				})
				.finally(() => setLoading(false));
		},
		[loadMoreAction]
	);

	React.useEffect(() => {
		const signal = new AbortController();

		const element = ref.current;

		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting && element?.disabled === false) {
				loadMore(signal);
			}
		});

		if (element && scrollLoad) {
			observer.observe(element);
		}

		return () => {
			signal.abort();
			if (element) {
				observer.unobserve(element);
			}
		};
	}, [loadMore, scrollLoad]);

	return (
		<>
			<div id="item-cols" className="grid grid-cols-5 gap-0 sm:gap-8 w-full">
				{loadMoreNodes}
			</div>
			<div className="overflow-hidden relative">
				<Button ref={ref}
				        className="absolute w-screen h-screen bottom-0 invisible">
					{loading ? 'Loading...' : 'Load More'}
				</Button>
			</div>
			<div className="sm:col-span-5 flex flex-col gap-4 w-full mt-4 sm:mt-0">
				<h1 className="text-center text-2xl w-fit mx-auto font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
					Niet gevonden waar je naar zocht?
				</h1>
				<p className="mx-auto">
					Stuur een email naar{' '}
					<Link href="mailto:info@animenl.nl?subject=Vraag%20beschikbaarheid%20artikel" target="_blank">
						info@animenl.nl
					</Link>
					, dan kijken wij wat we voor je kunnen betekenen
				</p>
			</div>
		</>
	);
};

export default LoadMore;
