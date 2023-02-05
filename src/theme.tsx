import { webpack } from "replugged";
const MessageClasses = {
  ...webpack.getByProps("message", "groupStart"),
  ...webpack.getByProps("compact", "cozy", "username"),
  ...webpack.getByProps("username", "zalgo", "timestamp", "header"),
  ...webpack.getByProps("tooltip"),
  ...webpack.getByProps("toolbar", "title"),
};

let style = `
@import 'https://fonts.googleapis.com/css?family=Roboto|Inconsolata';
				
.tagID {
	font-size: 10px;
	letter-spacing: 0.025rem;
	position: relative;
	/*top: 3px;*/
	height: 9px;
	line-height: 10px;
	text-shadow: 0 1px 3px black;
	background: {color};
	border-radius: 3px;
	font-weight: 500;
	padding: 3px 5px;
	color: #FFF;
	font-family: 'Roboto', 'Inconsolata', 'Whitney', sans-serif;
	width: fit-content;
}
.tagID.before {
	margin-left: -4px;
	margin-right: 6px;
}
.tagID.after {
	margin-left: 4px;
	margin-right: 4px;
}

.${MessageClasses.groupStart.split(" ")[0]}.${MessageClasses.cozyMessage.split(" ")[0]} h2.${
  MessageClasses.header.split(" ")[0]
},
.${MessageClasses.groupStart.split(" ")[0]}.${MessageClasses.cozyMessage.split(" ")[0]} h2.${
  MessageClasses.header.split(" ")[0]
} .${MessageClasses.headerText.split(" ")[0]} {
	display: flex;
	align-items: center;
}
.${MessageClasses.compact.split(" ")[0]} .tagID {
	padding: 2px 3px;
}
#app-mount :-webkit-any(${MessageClasses.tooltip.split(" ")[0]}, .bd-tooltip, ${
  MessageClasses.toolbar.split(" ")[0]
}, .bubble-3we2d) {
	white-space: break-spaces;
}`;

export { style };
