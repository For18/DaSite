import { Typography } from "@mui/material";
import styles from "./styles/Pending.module.scss"

export default function Pending({ description, startingPoint}: { description: string, startingPoint?: string }) {
	return (
		<div>
			<Typography>
				Pending...
			</Typography>

			<Typography>
				{description}
			</Typography>

      {
        startingPoint
          ? <Typography className={styles['starting-point']}>
              Starting point: {startingPoint}
            </Typography>
          : null
      }
		</div>
	);
}
