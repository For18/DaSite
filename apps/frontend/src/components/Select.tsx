import { createContext, type Key, type PropsWithChildren, useCallback, useContext, useId, useLayoutEffect, useRef,
	useState } from "react";
import ClickAwayDetector from "./ClickAwayDetector";
import styles from "./Select.module.scss";
import Typography from "./Typography";

// TODO: Add checkmark next to selected option
// TODO: Add opening arrow to head
// TODO: Fix opening via click

export interface SelectContext {
	value: string | null;
	setValue?: (value: string) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
	focus: () => void;
	focusFirst: () => void;
	focusLast: () => void;
}

const SelectContext = createContext<SelectContext | null>(null);

export interface SelectProps extends PropsWithChildren {
	value: string | null;
	onChange?: (value: string) => void;
	placeholder?: string;
	"aria-labelledby"?: string;
}

export function Select(
	{ children, value, onChange: setValue, placeholder, "aria-labelledby": labelledBy }: SelectProps
) {
	const [open, setOpen] = useState<boolean>(false);
	const innerRef = useRef<HTMLDivElement>(null);
	const [contentHeight, setContentHeight] = useState<number>(0);
	const headRef = useRef<HTMLDivElement>(null);
	const innerId = useId();

	useLayoutEffect(() => {
		if (!innerRef.current) return;
		const rect = innerRef.current.getBoundingClientRect();
		setContentHeight(rect.height);
	}, [innerRef, children]);

	const focusFirst = useCallback(() => {
		(innerRef.current?.firstElementChild as HTMLElement | null)?.focus();
	}, [innerRef]);
	const focusLast = useCallback(() => {
		(innerRef.current?.lastElementChild as HTMLElement | null)?.focus();
	}, [innerRef]);

	return (
		<ClickAwayDetector onClickAway={() => setOpen(false)}>
			<div className={styles.container}>
				<div className={styles.head} ref={headRef} onClick={() => setOpen(!open)} tabIndex={0}
					onFocus={_e => setOpen(true)} onKeyDown={e => {
					if (e.key === "Tab") setOpen(false);
					else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
						e.preventDefault();
						setOpen(true);
						focusFirst();
					} else if (e.key === "Escape") setOpen(false);
					else if (e.key === "Enter" || e.key === " ") setOpen(!open);
					else if (e.key === "Home") {
						setOpen(true);
						focusFirst();
					} else if (e.key === "End") {
						setOpen(true);
						focusLast();
					}
					// TODO: Add filtering by typing
				}} role="combobox" aria-labelledby={labelledBy} aria-controls={innerId} aria-expanded={open}>
					{/* TODO: Add aria-activedescendant */}
					<Typography>{value ?? placeholder}</Typography>
				</div>
				<div className={styles.dropdown + (open ? " " + styles.open : "")} style={{
					"--content-height": contentHeight + "px"
				} as any} inert={!open}>
					<div className={styles.inner} ref={innerRef} id={innerId} role="listbox">
						<SelectContext.Provider value={{
							value,
							setValue,
							open,
							setOpen,
							focus: () => headRef.current?.focus(),
							focusFirst,
							focusLast
						}}>
							{children}
						</SelectContext.Provider>
					</div>
				</div>
			</div>
		</ClickAwayDetector>
	);
}

export interface OptionProps extends PropsWithChildren {
	value: string;
	key?: Key;
}

export function Option({ value, children, key }: OptionProps) {
	const selectData = useContext(SelectContext);
	if (selectData == null) throw new Error("Option rendered outside of Select component");
	const {
		value: selectValue,
		setValue: setSelectValue,
		open,
		setOpen,
		focus: focusHead,
		focusFirst: focusFirstOption,
		focusLast: focusLastOption
	} = selectData;
	const containerRef = useRef<HTMLDivElement>(null);

	const select = useCallback(() => {
		setSelectValue?.(value);
	}, [setSelectValue, value]);

	return (
		<div key={key} ref={containerRef} className={styles.item + (selectValue === value ? " " + styles.selected : "")}
			onClick={select} tabIndex={-1} onKeyDown={e => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				select();
				focusHead();
				setOpen(false);
			} else if (e.key === "ArrowDown") {
				e.preventDefault();
				(containerRef.current?.nextElementSibling as HTMLElement | null)?.focus();
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				if (e.altKey) {
					select();
					focusHead();
					setOpen(false);
				} else {
					(containerRef.current?.previousElementSibling as HTMLElement | null)?.focus();
				}
			} else if (e.key === "Tab") {
				select();
				setOpen(false);
			} else if (e.key === "Escape") {
				focusHead();
				setOpen(false);
			} else if (e.key === "Home" || e.key === "PageUp") {
				e.stopPropagation();
				focusFirstOption();
			} else if (e.key === "End" || e.key === "PageDown") {
				focusLastOption();
			}
			// TODO: Add filtering by typing
		}} role="option" aria-selected={selectValue === value}>
			{children}
		</div>
	);
}
