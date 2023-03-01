import { common, webpack } from "replugged";
const { React } = common;

const ErrorBoundary = class ErrorBoundary extends React.Component {
  props: any;
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  state: { hasError: boolean };

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
const WrapBoundary = (Original: any) => (props: any) =>
  React.createElement(ErrorBoundary, null, React.createElement(Original, props));

const getTagProps = (props: any, classes: string[]) => ({
  className: `${props.hover ? "tooltip-wrapper" : ""} ${classes.join(" ")}`.trim(),
  children: [
    React.createElement("span", {
      className: "tag",
      children: [props.id],
      onDoubleClick: (e: any) => props.onDoubleClick(e),
    }),
  ],
});

const getTagElement = (props: any, classes: any) => {
  return (cProps: any) =>
    React.createElement("span", Object.assign(getTagProps(props, classes), props.hover && cProps));
};

const TooltipWrapper: any = webpack.getByProps("Colors");
const getTagClasses = (props: any) => (Array.isArray(props.classes) ? props.classes : []);
const Tag = (props: any) => {
  const classes = getTagClasses(props);
  if (!classes.includes("tagID")) classes.unshift("tagID");
  return React.createElement(TooltipWrapper, {
    //position: TooltipWrapper.Positions.TOP,
    color: TooltipWrapper.Colors.PRIMARY,
    text: props.text,
    children: getTagElement(props, classes),
  });
};

function getPos(config: any) {
  const value = !config;
  return {
    extraClass: value ? "before" : "after",
    pos: value ? "beforebegin" : "afterend",
  };
}

export { getPos, Tag, WrapBoundary };
