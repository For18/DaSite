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
