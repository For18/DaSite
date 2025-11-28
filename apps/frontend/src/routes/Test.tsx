import { useState } from "react";
import { Switch } from "../components/Switch";

export default function Test() {
	const [switchEnabled, setSwitchEnabled] = useState<boolean>(false);

	return (
		<>
			<Switch enabled={switchEnabled} onClick={() => setSwitchEnabled(e => !e)}/>
		</>
	);
}
