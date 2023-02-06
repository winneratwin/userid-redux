// TODO: insert passive aggressive comment about how asportnoy said
// "Why not just your own class name to the element?" when i needed
// dynamic stylesheets to programmatically change the theme when
// discord updates and changes the class names.

function getElement(e, baseElement = document) {
  if (e instanceof Node) return e;
  return baseElement.querySelector(e);
}

function createElement(tag, options = {}, child = null) {
  const { className, id, target } = options;
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (id) element.id = id;
  if (child) element.append(child);
  if (target) getElement(target).append(element);
  return element;
}

function escapeID(id) {
  return id.replace(/^[^a-z]+|[^\w-]+/gi, "-");
}

function getStyleFolder() {
  return (
    getElement(`rp-styles`, document.head) || createElement("rp-styles", { target: document.head })
  );
}

function injectStyle(id, css) {
  let styleFolder = getStyleFolder();
  id = escapeID(id);
  const styleelement = getElement(`#${id}`, styleFolder) || createElement("style", { id });
  styleelement.textContent = css;
  styleFolder.append(styleelement);
}

function removeStyle(id) {
  let styleFolder = getStyleFolder();
  id = escapeID(id);
  const exists = getElement(`#${id}`, styleFolder);
  if (exists) exists.remove();
}
//export style functions
export { injectStyle, removeStyle };
