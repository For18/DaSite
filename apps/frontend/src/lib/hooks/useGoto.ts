import { isInternalHref } from "@lib/util";
import { useCallback } from "react";
import { useNavigate } from "react-router";

export default function useGoto() {
	const navigate = useNavigate();

	return useCallback((href: string) => {
		if (isInternalHref(href)) {
			navigate(href);
		} else {
			window.location.href = href;
		}
	}, []);
}
