import { common, webpack } from "replugged";
const { React } = common;

const ErrorBoundary = class ErrorBoundary extends React.Component {
  // type for the state
  props: any;
  state: { hasError: boolean };
  // constructor for the state
  constructor(props: any) {
    // call the parent constructor
    super(props);
    // set the state to have no error
    this.state = { hasError: false };
  }

  render() {
    // if there is an error, return an inline div with the text "error"
    if (this.state.hasError)
      return React.createElement(
        "div",
        {
          className: `ChatUserIDsRedux-error`,
        },
        "error",
      );
    // otherwise, return the children
    return this.props.children;
  }
};

// wrap the original component in the error boundary
const WrapBoundary = (Original: any) => (props: any) =>
  React.createElement(ErrorBoundary, null, React.createElement(Original, props));

// get the tag props
const getTagProps = (props: any, classes: string[]) => ({
  // if the hover prop is true, add the tooltip-wrapper class to the classes array
  className: `${props.hover ? "tooltip-wrapper" : ""} ${classes.join(" ")}`.trim(),

  // set the children to a span with the id
  children: [
    React.createElement("span", {
      // set the class to tag
      className: "tag",
      // set the text to the user id
      children: [props.id],
      // copy the id to the clipboard on double click
      onDoubleClick: (e: any) => props.onDoubleClick(e),
    }),
  ],
});

// get the tag element
const getTagElement = (props: any, classes: any) => {
  return (cProps: any) =>
    React.createElement("span", Object.assign(getTagProps(props, classes), props.hover && cProps));
};

// get the tooltip wrapper
const TooltipWrapper: any = webpack.getByProps("Colors");

// get the classes from the props
const getTagClasses = (props: any) => (Array.isArray(props.classes) ? props.classes : []);

// the tag component
const Tag = (props: any) => {
  // get the classes
  const classes = getTagClasses(props);

  // if the tagID class is not in the classes array, add it to the beginning of the array
  if (!classes.includes("tagID")) classes.unshift("tagID");

  //return the tooltip wrapper
  return React.createElement(TooltipWrapper, {
    //position: TooltipWrapper.Positions.TOP, // removed due to it now being the default position
    color: TooltipWrapper.Colors.PRIMARY,

    // set the text to the user id
    text: props.text,

    // create the hover element which contains the date of the message/user creation
    children: getTagElement(props, classes),
  });
};

// the tag position
function getPos(config: any) {
  const value = !config;
  return {
    extraClass: value ? "before" : "after",
    pos: value ? "beforebegin" : "afterend",
  };
}

// return the exports
export { getPos, Tag, WrapBoundary };
