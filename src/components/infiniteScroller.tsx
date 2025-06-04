'use client';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import * as React from 'react';

type loadMoreAction<T extends string | number = any> = T extends number
	? (offset: T) => Promise<readonly [React.JSX.Element, number | null]>
	: T extends string
		? (offset: T) => Promise<readonly [React.JSX.Element, string | null]>
		: any;

const LoadMore = <T extends string | number = any>({
	                                                   children,
	                                                   initialOffset,
	                                                   loadMoreAction
                                                   }: React.PropsWithChildren<{
	initialOffset: T;
	loadMoreAction: loadMoreAction<T>;
}>) => {
	const ref = React.useRef<HTMLButtonElement>(null);
	const [loadMoreNodes, setLoadMoreNodes] = React.useState<React.JSX.Element[]>([]);

	const [disabled, setDisabled] = React.useState(false);
	const currentOffsetRef = React.useRef<number | string | undefined>(initialOffset);
	const [scrollLoad] = React.useState(true);
	const [loading, setLoading] = React.useState(false);

	const loadMore = React.useCallback(
		async (abortController?: AbortController) => {
			setLoading(true);

			// @ts-expect-error Can't yet figure out how to type this
			loadMoreAction(currentOffsetRef.current)
				.then(([node, next]) => {
					if (abortController?.signal.aborted) return;

					setLoadMoreNodes(() => {
						return [node];
					});

					if (next === null) {
						currentOffsetRef.current ??= undefined;
						setDisabled(true);
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
			<div id="item-cols" className="grid grid-cols-1 sm:grid-cols-5 gap-0 sm:gap-8 w-full">
				{loadMoreNodes}
			</div>
			<div className="relative overflow-hidden">
				<Button variant="bordered" size="lg" ref={ref} disabled={disabled || loading} onPress={() => loadMore()}
				        className="absolute h-[200vh]">
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
