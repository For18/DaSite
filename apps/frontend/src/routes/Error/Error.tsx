import { useContext, useEffect } from "react";
import { ErrorBoundaryContext } from "react-error-boundary";
import styles from "./Error.module.scss";
import Button from "@component/Button";

export default function Error() {
	useEffect(() => {
		document.title = "For18 - Error";
	}, []);

	const { error, resetErrorBoundary } = useContext(ErrorBoundaryContext);

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>
				An error occurred
			</h1>

			<p className={styles.error}>
				{error.stack}
			</p>

			<p className={styles.text}>Please <Button onClick={resetErrorBoundary} className={styles.retry}>Retry</Button> or if the issue persists, contact For18</p>
		</div>
	);
}