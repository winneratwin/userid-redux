import { log } from "console";
import { common, Injector, Logger, settings, webpack } from "replugged";
import { theme } from "replugged/dist/types/addon";
import { DefaultSettings } from "./constants";
import { injectStyle, removeStyle } from "./theme_manager.tsx";

import { Settings } from "./Settings";
export { Settings };

const { React, toast } = common;

const injector = new Injector();
const logger = Logger.plugin("UserIdRedux");

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

// plugin id found in manifest.json
let PLUGIN_ID = "dev.winner.useridreduxport";

const cfg = await settings.init(PLUGIN_ID, DefaultSettings);
export { cfg };

const ErrorBoundary = class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  render() {
    if (this.state.hasError)
      return React.createElement(
        "div",
        {
          className: `ChatUserIDsRedux-error`,
        },
        "error",
      );
    return this.props.children;
  }
};
const WrapBoundary = (Original) => (props) =>
  React.createElement(ErrorBoundary, null, React.createElement(Original, props));

const getTagProps = (props, classes) => ({
  className: `${props.hover ? "tooltip-wrapper" : ""} ${classes.join(" ")}`.trim(),
  children: [
    React.createElement("span", {
      className: "tag",
      children: [props.id],
      onDoubleClick: (e) => props.onDoubleClick(e),
    }),
  ],
});

const getTagElement = (props, classes) => {
  return (cProps) =>
    React.createElement("span", Object.assign(getTagProps(props, classes), props.hover && cProps));
};

const TooltipWrapper = webpack.getByProps("Colors", "Positions");
const getTagClasses = (props) => (Array.isArray(props.classes) ? props.classes : []);
const Tag = (props) => {
  const classes = getTagClasses(props);
  if (!classes.includes("tagID")) classes.unshift("tagID");
  return React.createElement(TooltipWrapper, {
    position: TooltipWrapper.Positions.TOP,
    color: TooltipWrapper.Colors.PRIMARY,
    text: props.text,
    children: getTagElement(props, classes),
  });
};

function getPos(config) {
  const value = !config;
  return {
    extraClass: value ? "before" : "after",
    pos: value ? "beforebegin" : "afterend",
  };
}

export async function start(): Promise<void> {
  injectStyle(PLUGIN_ID, style.replace(/{color}/, cfg.get("color")));
  let mod = webpack.getBySource('"BADGES"');

  injector.after(mod, "Z", ([args], res: React.ReactElement) => {
    const { author } = args.message;

    //const date = author.createdAt.toString().replace(/\([\w\d].+\)/g, '').split(' ');
    //const gmt = date.pop();

    //const date = author.createdAt.toISOString();
    const date = args.message.timestamp.toISOString();

    const { extraClass, pos } = getPos(cfg.get("tagPosition"));

    const tag = React.createElement(WrapBoundary(Tag), {
      id: author.id,
      key: `ChatUserID-${author.id}`,
      //text: `${date.join(' ').trim()}\n${gmt.trim()}`,
      text: date,
      hover: cfg.get("hoverTip"),
      classes: [extraClass],
      onDoubleClick: (e) => {
        DiscordNative.clipboard.copy(author.id);
        toast.toast("Copied to clipboard");
      },
    });

    res?.props?.children[3]?.props?.children?.splice(pos === "beforebegin" ? 0 : 2, 0, tag);

    return res;
  });
}

export function stop(): void {
  injector.uninjectAll();
  removeStyle(PLUGIN_ID);
}
