import { useEffect } from "react";

export default function useAnimationFrame(callback: (deltaTimeMillis: number) => void) {
	useEffect(() => {
		let animationFrameId: number;
		function update(deltaTimeMillis: number) {
			callback(deltaTimeMillis);
			animationFrameId = requestAnimationFrame(update);
		}
		animationFrameId = requestAnimationFrame(update);
		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	});
}
