import { useDebugValue, useState } from "react";
import useAnimationFrame from "./useAnimationFrame";

export default function useTime() {
	const [time, setTime] = useState(Date.now());
	useAnimationFrame(() => {
		setTime(Date.now());
	});
	useDebugValue(time);
	return time;
}
