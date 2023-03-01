// TODO: insert passive aggressive comment about how asportnoy said
// "Why not just your own class name to the element?" when i needed
// dynamic stylesheets to programmatically change the theme when
// discord updates and changes the class names.

function getElement(e: string, baseElement: any = document): Element {
  return baseElement.querySelector(e) as Element;
}

function createElement(
  tag: string,
  options: { className?: string; id?: string; target?: any } = {},
  child = null,
) {
  const { className, id, target } = options;
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (id) element.id = id;
  if (child) element.append(child);
  if (target) getElement(target).append(element);
  return element;
}

function escapeID(id: string): string {
  return id.replace(/^[^a-z]+|[^\w-]+/gi, "-");
}

function getStyleFolder(): Element {
  return (
    getElement(`rp-styles`, document.head) || createElement("rp-styles", { target: document.head })
  );
}

function injectStyle(id: string, css: string) {
  let styleFolder = getStyleFolder();
  id = escapeID(id);
  const styleelement = getElement(`#${id}`, styleFolder) || createElement("style", { id });
  styleelement.textContent = css;
  styleFolder.append(styleelement);
}

function removeStyle(id: string) {
  let styleFolder = getStyleFolder();
  id = escapeID(id);
  const exists = getElement(`#${id}`, styleFolder);
  if (exists) exists.remove();
}
//export style functions
export { injectStyle, removeStyle };
