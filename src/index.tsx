import { common, Injector, Logger, settings, webpack } from "replugged";
import { DefaultSettings } from "./constants";
import { injectStyle, removeStyle } from "./theme_manager.tsx";
import { style } from "./theme.tsx";
import { getPos, Tag, WrapBoundary } from "./elements.tsx";

import { Settings } from "./Settings";
export { Settings };

const { React, toast } = common;

const injector = new Injector();
const logger = Logger.plugin("UserIdRedux");

// plugin id found in manifest.json
let PLUGIN_ID = "dev.winner.useridreduxport";

const cfg = await settings.init(PLUGIN_ID, DefaultSettings);
export { cfg };

export async function start(): Promise<void> {
  injectStyle(PLUGIN_ID, style.replace(/{color}/, cfg.get("color")));
  let mod = webpack.getBySource('"BADGES"');

  injector.after(mod, "Z", ([args], res: React.ReactElement) => {
    const { author } = args.message;

    //const date = author.createdAt.toString().replace(/\([\w\d].+\)/g, '').split(' ');
    //const gmt = date.pop();

    //const date = author.createdAt.toISOString();
    const date = args.message.timestamp.toISOString();

    const { extraClass, pos } = getPos(cfg.get("tagPosition"));

    const tag = React.createElement(WrapBoundary(Tag), {
      id: author.id,
      key: `ChatUserID-${author.id}`,
      //text: `${date.join(' ').trim()}\n${gmt.trim()}`,
      text: date,
      hover: cfg.get("hoverTip"),
      classes: [extraClass],
      onDoubleClick: (e) => {
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
