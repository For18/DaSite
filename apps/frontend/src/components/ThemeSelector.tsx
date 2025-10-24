import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Theme, useTheme } from "@mui/material/styles";
import { useContext } from "react";
import { SetThemeContext } from "../App";
import { getThemeById } from "../Themes";

export default function ThemeSelector({
	themes,
	style
}: {
	themes: Theme[];
	style?: React.CSSProperties;
}) {
	const setTheme = useContext(SetThemeContext);
	const currentTheme = useTheme();

	return (
		<FormControl style={style}>
			<InputLabel id="theme-selector-label">Theme</InputLabel>
			<Select
				labelId="theme-selector-label"
				id="theme-selector"
				value={currentTheme.id}
				label="Theme"
				style={{
					width: "7em"
				}}
				onChange={event => {
					setTheme(getThemeById(event.target.value) ?? themes[0]);
				}}
			>
				{themes.map(theme => <MenuItem value={theme.id}>{theme.name}</MenuItem>)}
			</Select>
		</FormControl>
	);
}
