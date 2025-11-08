export default function Pending({ description, startingPoint = "" }: { description: string, startingPoint?: string }) {
	return (
		<div>
			<h1>
				Pending...
			</h1>

			<p>
				{description}
			</p>

			<p className={"starting-point" + (startingPoint == "" ? "" : "visible")}>
				Starting point: {startingPoint}
			</p>
		</div>
	);
}
