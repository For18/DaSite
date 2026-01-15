import useAnimationFrame from "@lib/hooks/useAnimationFrame";
import { useDebugValue, useState } from "react";

export default function useTime() {
	const [time, setTime] = useState(Date.now());
	useAnimationFrame(() => {
		setTime(Date.now());
	});
	useDebugValue(time);
	return time;
}
