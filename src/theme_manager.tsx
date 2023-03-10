// TODO: insert passive aggressive comment about how asportnoy said
// "Why not just your own class name to the element?" when i needed
// dynamic stylesheets to programmatically change the theme when
// discord updates and changes the class names.

function getElement(e: any, baseElement?: any) {
  // if e is already an element, return it
  if (e instanceof Node) return e;
  // set baseElement to document if not specified
  baseElement = baseElement || document;
  // return element
  return baseElement.querySelector(e);
}

function createElement(
  tag: string,
  options: { className?: string; id?: string; target?: any; child?: any } = {},
) {
  // destructure options
  const { className, id, target, child } = options;

  // create element
  const element = document.createElement(tag);

  // set class and id if specified
  if (className) element.className = className;
  if (id) element.id = id;

  // append child
  if (child) element.append(child);
  // append to target if specified
  if (target) getElement(target).append(element);

  // return element
  return element;
}

function escapeID(id: string): string {
  // replace all non-alphanumeric characters with dashes
  return id.replace(/^[^a-z]+|[^\w-]+/gi, "-");
}

function getStyleFolder(): Element {
  // get style folder
  return (
    // if it doesn't exist, create it
    getElement(`rp-styles`, document.head) || createElement("rp-styles", { target: document.head })
  );
}

function injectStyle(id: string, css: string) {
  // get style folder
  let styleFolder = getStyleFolder();

  // escape invalid characters
  id = escapeID(id);

  // get existing style element or create a new one
  const styleelement = getElement(`#${id}`, styleFolder) || createElement("style", { id });

  // set css
  styleelement.textContent = css;

  // append to style folder
  styleFolder.append(styleelement);
}

function removeStyle(id: string) {
  // get style folder
  let styleFolder = getStyleFolder();
  // escape invalid characters
  id = escapeID(id);
  // get existing style element
  const exists = getElement(`#${id}`, styleFolder);
  // remove if it exists
  if (exists) exists.remove();
}

//export style functions
export { injectStyle, removeStyle };
