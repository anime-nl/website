'use client';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';
import { createElement } from 'react';

type Filter = {
	key: string;
	operator: string;
	value: string;
}[];

type loadMoreAction = (
	offset: string | number | undefined,
	filter: Filter
) => Promise<readonly [React.JSX.Element[], number | null]>;

const LoadMore = ({
	                  initialOffset,
	                  loadMoreAction,
	                  filter
                  }: React.PropsWithChildren<{
	initialOffset: number;
	loadMoreAction: loadMoreAction;
	filter: Filter;
}>) => {
	const ref = React.useRef<HTMLButtonElement>(null);
	const [loadMoreNodes, setLoadMoreNodes] = React.useState<React.JSX.Element[] | React.JSX.Element[][]>([]);
	const searchParams = useSearchParams();

	const currentOffsetRef = React.useRef<number | string | undefined>(initialOffset);
	const [scrollLoad] = React.useState(true);
	const [loading, setLoading] = React.useState(false);
	const [disabled, setDisabled] = React.useState(false);

	const loadMore = React.useCallback(
		async (abortController?: AbortController) => {
			setLoading(true);

			loadMoreAction(currentOffsetRef.current, filter)
				.then(([nodes, next]) => {
					if (abortController?.signal.aborted) return;

					setLoadMoreNodes(() => {
						if (window.innerWidth <= 640) {
							const result: React.JSX.Element[] = [];

							const maxRow = Math.max(...nodes.map((el) => el.props.children.length));

							let isFinished = false;
							let columnCounter = 0;
							let rowCounter = 0;
							while (!isFinished) {
								const node: React.JSX.Element = nodes[columnCounter].props.children[rowCounter];
								if (rowCounter >= maxRow && !node) {
									isFinished = true;
									continue;
								}
								result.push(node);
								columnCounter++;

								if (columnCounter == 5) {
									columnCounter = 0;
									rowCounter++;
								}
							}

							const el = createElement(
								'div',
								{
									className: 'flex flex-col gap-4 w-full col-span-5 col-start-1'
								},
								...result
							);

							console.log(result);

							return [el];
						}
						return [nodes];
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
		[loadMoreAction, filter]
	);

	// Reset and reload when search parameters change
	React.useEffect(() => {
		currentOffsetRef.current = initialOffset;
		loadMore();
	}, [searchParams, initialOffset, loadMore]);

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
			<div className="w-fit mx-auto my-4">
				<Button
					variant="flat"
					ref={ref}
					onPress={() => loadMore()}
					className="w-fit mx-auto enabled:invisible"
					disabled={disabled || loading}
				>
					{loading ? 'Aan het zoeken...' : 'Laad meer'}
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
