import { useDebugValue, useEffect, useRef } from "react";

export default function useRenderCount(): number {
	const countRef = useRef<number>(0);

	useEffect(() => {
		countRef.current++;
	});

	useDebugValue(countRef);

	return countRef.current;
}
