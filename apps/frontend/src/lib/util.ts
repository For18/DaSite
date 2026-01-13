const RANDOM_CHARACTER_SET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export function randomCharacter(): string {
	return RANDOM_CHARACTER_SET.charAt(
		Math.floor(Math.random() * RANDOM_CHARACTER_SET.length)
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

export function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatEuros(n: number): string {
	const wholePart = Math.floor(n);
	const decimalPart = n % 1;

	let wholeString = "";

	let tempWholePart = wholePart;
	do {
		wholeString = (tempWholePart % 1000).toString() + " " + wholeString;
		tempWholePart = Math.floor(tempWholePart / 1000);
	} while (tempWholePart > 0);

	wholeString = wholeString.slice(0, wholeString.length - 1);

	if (decimalPart !== 0) {
		let tempDecimalPart = decimalPart;
		while (tempDecimalPart % 1 !== 0) tempDecimalPart *= 10;
		wholeString += "," + tempDecimalPart.toString();
	} else wholeString += ",-";

	return "€" + wholeString;
}

export function isInternalHref(href: string): boolean {
	const hrefUrl = URL.parse(href, window.location.href);
	return window.location.host === hrefUrl?.host;
}

export function pickRandom<T>(values: T[]): T {
	return values[Math.floor(Math.random() * values.length)];
}

export function deduplicate<T>(array: T[]) {
	return Array.from(new Set(array));
}
