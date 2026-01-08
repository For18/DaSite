import ThemeCSSProvider, { useTheme } from "@/themes/ThemeCSSProvider";
import { PropsWithChildren } from "react";
import { CgClose } from "react-icons/cg";
import Button from "@component/Button";
import styles from "./Modal.module.scss";
import { createPortal } from "react-dom";
import ClickAwayDetector from "../ClickAwayDetector";

export interface ModalProps extends PropsWithChildren {
	open: boolean;
	/** Callback function to close the modal, if present a close button is added */
	onClose?: () => void;
}

export default function Modal({ children, open, onClose: close }: ModalProps) {
	const { theme } = useTheme();

	if (!open) return null;

	return createPortal(
		<ThemeCSSProvider theme={theme}>
			<div className={styles.backdrop} onClick={e => {
				e.stopPropagation();
				close?.();
			}}>
				<div className={styles.modal} onClick={e => e.stopPropagation()}>
					{children}
					{close && (
						<Button onClick={close} className={styles.closeButton}><CgClose/></Button>
					)}
				</div>
			</div>
		</ThemeCSSProvider>
	, document.body);
}