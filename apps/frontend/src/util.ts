import { useEffect, useState } from "react";

const RANDOM_CHARACTER_SET =
	"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function randomCharacter(): string {
	return RANDOM_CHARACTER_SET.charAt(
		Math.floor(Math.random() * RANDOM_CHARACTER_SET.length),
	);
}

export function generateRandomString(length: number): string {
	let result: string = "";

	for (let i = 0; i < length; i++) {
		result += randomCharacter();
	}

	return result;
}

export function range(amount: number): number[] {
	const result: number[] = Array(amount);
	for (let i = 0; i < amount; i++) {
		result.push(i);
	}
	return result;
}

export function useTime() {
	const [time, setTime] = useState(Date.now());
	useEffect(() => {
		let animationFrameId: number;
		function update() {
			setTime(Date.now());
			animationFrameId = requestAnimationFrame(update);
		}
		animationFrameId = requestAnimationFrame(update);
		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	});
	return time;
}
