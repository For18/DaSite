import { useCallback } from "react";
import { useNavigate } from "react-router";
import { isInternalHref } from "@lib/util";

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
