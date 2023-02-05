import { cfg } from ".";
import { webpack, util, components, common } from "replugged";
const { SwitchItem } = components;
const { React } = common;
import { DropdownSettings } from "./constants.js";

const mod = webpack.getBySource(/.\.options,.=.\.placeholder/);
const DropdownMenu = webpack.getFunctionBySource(/.\.options,.=.\.placeholder/, mod);

function useDropdownSetting(settings, key) {
  const initial = settings.get(key);
  const [value, setValue] = React.useState(initial);

  return {
    value,
    isSelected: (compareValue) => {
      return compareValue === value;
    },
    onSelect: (newValue) => {
      setValue(newValue);
      settings.set(key, newValue);
    },
  };
}

function DropdownMenuItem(props) {
  function serialize(value) {
    return value;
  } // not relevant but DropdownMenu calls it

  // todo: this is bad and dumb and will break,
  //  figure out how to mimic discord's settings stuff
  const res = SwitchItem({
    note: props.note,
    children: props.children,
  });

  const switchItemElement = res?.props?.children?.[0]?.props?.children?.props?.children;
  if (switchItemElement === undefined) return null;

  switchItemElement[1] = (
    <DropdownMenu
      options={props.options}
      isSelected={props.isSelected}
      select={props.onSelect}
      serialize={serialize}></DropdownMenu>
  );

  return res;
}

export function Settings() {
  return (
    <div>
      <DropdownMenuItem
        note="When to require hovering over the username to show pronouns."
        options={DropdownSettings.colors}
        {...useDropdownSetting(cfg, "color")}>
        Color
      </DropdownMenuItem>
      <SwitchItem
        note="When off, the tag will be to the left."
        {...util.useSetting(cfg, "tagPosition")}
        disabled>
        Tag position
      </SwitchItem>
      <SwitchItem note="will show message date as hovertip." {...util.useSetting(cfg, "hoverTip")}>
        Show hovertip
      </SwitchItem>
    </div>
  );
}
