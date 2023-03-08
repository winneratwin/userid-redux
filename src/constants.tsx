const DefaultSettings = Object.freeze({
  color: "#798AED",
  tagPosition: 1,
  hoverTip: true,
  authorCreatedAt: true,
});

const DropdownSettings = Object.freeze({
  colors: [
    { label: "Original", value: "#798AED" },
    { label: "Red", value: "#ff0000" },
    { label: "Green", value: "#00ff00" },
    { label: "Blue", value: "#0000ff" },
  ],
  position: [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
    { label: "5", value: 5 },
    { label: "6", value: 6 },
  ],
});

export { DefaultSettings, DropdownSettings };
