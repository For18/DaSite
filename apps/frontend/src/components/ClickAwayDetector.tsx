import { MouseEvent, PropsWithChildren, useCallback, useEffect } from "react";

export interface ClickAwayDetectorProps extends PropsWithChildren {
	onClickAway: () => void;
}

export default function ClickAwayDetector({ onClickAway, children }: ClickAwayDetectorProps) {
	useEffect(() => {
		document.body.addEventListener("click", onClickAway);
		return () => document.body.removeEventListener("click", onClickAway);
	}, []);

	return (
		<div role="none" style={{
			width: "fit-content",
			height: "fit-content"
		}} onClick={e => e.stopPropagation()}>
			{children}
		</div>
	);
}
