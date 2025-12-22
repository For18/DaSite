import { useState, useEffect, useDebugValue } from "react";

export default function useMousePosition(): [number, number] {
	const [mousePosition, setMousePosition] = useState<[number, number]>([0, 0]);

	function listener(e: MouseEvent) {
		setMousePosition([e.clientX, e.clientY]);
	}

	useEffect(() => {
		window.addEventListener("mousemove", listener);
		return () => window.removeEventListener("mousemove", listener);
	}, []);

	useDebugValue(mousePosition);

	return mousePosition;
}