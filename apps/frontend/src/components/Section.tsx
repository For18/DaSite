import { createContext, PropsWithChildren, useContext } from "react";

export const DepthContext = createContext<number>(0);

export default function Section({ children }: PropsWithChildren) {
	const parentDepth = useContext(DepthContext);

	return (
		<DepthContext.Provider value={parentDepth + 1}>
			<section>{children}</section>
		</DepthContext.Provider>
	);
}
