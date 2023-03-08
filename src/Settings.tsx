import { PLUGIN_ID, cfg } from ".";
import { injectStyle } from "./theme_manager";
import { components, util } from "replugged";
import { style } from "./theme";
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
        onChange={(value: string) => {
          colorOnChange(value);
          injectStyle(PLUGIN_ID, style.replace(/{color}/, cfg.get("color") as string));
        }}>
        Color
      </SelectItem>
      <SelectItem
        {...util.useSetting(cfg, "tagPosition")}
        options={DropdownSettings.position as any}
        value={posValue as any}
        onChange={(value) => {
          posOnChange(Number(value));
        }}>
        Tag position
      </SelectItem>
      <SwitchItem
        {...util.useSetting(cfg, "hoverTip")}
        note="will show message/author creation date as hovertip.">
        Show hovertip
      </SwitchItem>
      <SwitchItem
        {...util.useSetting(cfg, "authorCreatedAt")}
        note="will show author's account creation date instead of message's timestamp.">
        Show author's account creation date
      </SwitchItem>
    </div>
  );
}
