import styles from "./styles/Pending.module.scss"

export default function Pending({ description, startingPoint}: { description: string, startingPoint?: string }) {
	return (
		<div>
			<h1>
				Pending...
			</h1>

			<p>
				{description}
			</p>

      {
        startingPoint
          ? <p className={styles['starting-point']}>
              Starting point: {startingPoint}
            </p>
          : null
      }
		</div>
	);
}
