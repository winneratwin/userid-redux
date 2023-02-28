import { common, webpack } from "replugged";
const { React } = common;

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

const TooltipWrapper = webpack.getByProps("Colors");
const getTagClasses = (props) => (Array.isArray(props.classes) ? props.classes : []);
const Tag = (props) => {
  const classes = getTagClasses(props);
  if (!classes.includes("tagID")) classes.unshift("tagID");
  return React.createElement(TooltipWrapper, {
    //position: TooltipWrapper.Positions.TOP,
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

export { getPos, Tag, WrapBoundary };
