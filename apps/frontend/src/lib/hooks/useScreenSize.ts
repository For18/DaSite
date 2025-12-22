import { useDebugValue, useEffect, useState } from "react";

export default function useScreenSize(): [number, number] {
	const [screenSize, setScreenSize] = useState<[number, number]>([window.innerWidth, window.innerHeight]);

	function update() {
		setScreenSize([
			window.innerWidth,
			window.innerHeight
		]);
	}

	useEffect(() => {
		window.addEventListener("resize", update);
		return () => window.removeEventListener("resize", update);
	}, []);

	useDebugValue(screenSize);

	return screenSize;
}
