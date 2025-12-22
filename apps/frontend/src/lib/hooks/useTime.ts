import useAnimationFrame from "./useAnimationFrame";
import { useState, useDebugValue } from "react";

export default function useTime() {
	const [time, setTime] = useState(Date.now());
	useAnimationFrame(() => {
		setTime(Date.now());
	});
	useDebugValue(time);
	return time;
}