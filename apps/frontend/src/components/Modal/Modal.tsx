import ThemeCSSProvider, { useTheme } from "@/themes/ThemeCSSProvider";
import Button from "@component/Button";
import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import { CgClose } from "react-icons/cg";
import { PropsWithChildren, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { CgClose } from "react-icons/cg";
import styles from "./Modal.module.scss";

export interface ModalProps extends PropsWithChildren {
	open: boolean;
	/**
	 * Callback function to close the modal
	 * If present a close button is added
	 * For accessibility reasons this should be provided whenever possible
	 */
	onClose?: () => void;
	labelledby?: string;
	describedby?: string;
}

export default function Modal({ children, open, onClose: close, labelledby, describedby }: ModalProps) {
	const { theme } = useTheme();

	const handleKeyDown = useCallback((e: KeyboardEvent) => {
		if (e.key === "Escape") {
			e.stopPropagation();
			close?.();
		}
	}, []);

	useEffect(() => {
		if (open) document.addEventListener("keydown", handleKeyDown);
		else document.removeEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [open]);

	if (!open) return null;

	return createPortal(
		<ThemeCSSProvider theme={theme}>
			<div className={styles.backdrop} onClick={e => {
				e.stopPropagation();
				close?.();
			}}>
				<div className={styles.modal} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true"
					aria-labelledby={labelledby} aria-describedby={describedby}
				>
					{children}
					{close && (
						<Button onClick={close} className={styles.closeButton}>
							<CgClose/>
						</Button>
					)}
				</div>
			</div>
		</ThemeCSSProvider>,
		document.body
	);
}
