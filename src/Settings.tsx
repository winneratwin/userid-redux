import { cfg, logger, PLUGIN_ID } from ".";
import { injectStyle, removeStyle } from "./theme_manager.tsx";
import { components, util } from "replugged";
import { style } from "./theme.tsx";
const { SwitchItem, SelectItem } = components;
import { DropdownSettings } from "./constants.js";

export function Settings() {
  const { value: colorValue, onChange: colorOnChange } = util.useSetting(cfg, "color");
  const { value: posValue, onChange: posOnChange } = util.useSetting(cfg, "tagPosition");

  return (
    <div>
      <SelectItem
        {...util.useSetting(cfg, "color")}
        options={DropdownSettings.colors}
        note="Color of the tag. (needs reload to take effect)"
        value={colorValue}
        onChange={(value) => {
          colorOnChange(value);
          injectStyle(PLUGIN_ID, style.replace(/{color}/, cfg.get("color")));
        }}>
        Color
      </SelectItem>
      <SelectItem
        {...util.useSetting(cfg, "tagPosition")}
        options={DropdownSettings.position}
        value={posValue}
        onChange={(value) => {
          posOnChange(value);
        }}>
        Tag position
      </SelectItem>
      <SwitchItem {...util.useSetting(cfg, "hoverTip")} note="will show message date as hovertip.">
        Show hovertip
      </SwitchItem>
    </div>
  );
}
