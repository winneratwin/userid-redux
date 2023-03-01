import { Injector, common, settings, webpack } from "replugged";
import { DefaultSettings } from "./constants";
import { injectStyle, removeStyle } from "./theme_manager";
import { style } from "./theme";
import { Tag, WrapBoundary, getPos } from "./elements";

import { Settings } from "./Settings";
export { Settings };

const { React, toast } = common;

const injector = new Injector();

// plugin id found in manifest.json
let PLUGIN_ID = "dev.winner.useridreduxport";
export { PLUGIN_ID };

interface SettingsType {
  color: string;
  tagPosition: number;
  hoverTip: boolean;
}
const cfg = await settings.init<SettingsType>(PLUGIN_ID, DefaultSettings);
export { cfg };

interface ArgsType {
  message: {
    author: {
      id: string;
      createdAt: Date;
    };
    timestamp: Date;
  };
}

export async function start(): Promise<void> {
  injectStyle(PLUGIN_ID, style.replace(/{color}/, cfg.get("color") as string));
  let mod = (await webpack.waitForModule(webpack.filters.bySource('"BADGES"'))) as any;

  injector.after(mod, "Z", (args, res: React.ReactElement) => {
    let args2 = args[0] as ArgsType;
    const { author } = args2.message;

    //const date = author.createdAt.toString().replace(/\([\w\d].+\)/g, '').split(' ');
    //const gmt = date.pop();

    //const date = author.createdAt.toISOString();
    const date = args2.message.timestamp.toISOString();

    const { extraClass } = getPos(cfg.get("tagPosition"));

    // eslint-disable-next-line new-cap
    const tag = React.createElement(WrapBoundary(Tag), {
      id: author.id,
      key: `ChatUserID-${author.id}`,
      //text: `${date.join(' ').trim()}\n${gmt.trim()}`,
      text: date,
      hover: cfg.get("hoverTip"),
      classes: [extraClass],
      onDoubleClick: () => {
        const { DiscordNative } = window as any;
        DiscordNative.clipboard.copy(author.id);
        toast.toast("Copied to clipboard");
      },
    });

    // position of the tag can't be changed anymore
    res?.props?.children[3]?.props?.children?.splice(cfg.get("tagPosition"), 0, tag);

    return res;
  });
}

export function stop(): void {
  injector.uninjectAll();
  removeStyle(PLUGIN_ID);
}
