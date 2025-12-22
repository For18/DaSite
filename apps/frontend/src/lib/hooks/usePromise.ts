import { type DependencyList, useDebugValue, useEffect, useState } from "react";

export interface PromiseHookResponse<T> {
	isLoading: boolean;
	value?: T;
	error?: Error;
}

export default function usePromise<T>(createPromise: () => Promise<T> | null,
	dependencies: DependencyList): PromiseHookResponse<T> {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [value, setValue] = useState<T>();
	const [error, setError] = useState<Error>();

	useEffect(() => {
		setIsLoading(true);
		setValue(undefined);
		setError(undefined);

		const promise = createPromise();

		if (promise === null) return;

		promise
			.then(setValue)
			.catch(err => {
				console.warn(err);
				setError(err);
			})
			.finally(() => setIsLoading(false));
	}, dependencies);

	useDebugValue(isLoading ? "Loading..." : error != null ? error : value);

	return {
		isLoading,
		value,
		error
	};
}
