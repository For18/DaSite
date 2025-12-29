import { useState } from "react";

export interface ImageProps {
	src: string | string[] | null | undefined;
	alt: string;
	width?: number;
	height?: number;
	onClick?: React.MouseEventHandler<HTMLImageElement>;
	className?: string;
	style?: React.CSSProperties;
}

export default function Image({ src, alt, width, height, onClick, className, style }: ImageProps) {
	if (src === null || src === undefined) src = [];
	else if (typeof src === "string") src = [src];

	src.push(`https://placehold.co/${width ?? height ?? 100}x${height ?? width ?? 100}?text=${alt}`);

	const [imageIndex, setImageIndex] = useState<number>(0);

	return (
		<img src={src[imageIndex]} alt={alt} width={width} height={height} onClick={onClick} className={className}
			style={style} onError={() => {
			if (imageIndex >= src.length - 1) return;
			setImageIndex(imageIndex + 1);
		}}/>
	);
}
