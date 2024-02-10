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
  // color in hex format (e.g. #ff0000)
  color: string;
  // position of the tag
  tagPosition: number;
  // if you show the tag on hover
  hoverTip: boolean;
  // if you show the author's createdAt date instead of the message's timestamp
  authorCreatedAt: boolean;
}

// init settings
const cfg = await settings.init<SettingsType>(PLUGIN_ID, DefaultSettings);
export { cfg };

// type for some of the arguments(the ones we are going to use) of the function we are going to inject
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
  // inject style
  injectStyle(PLUGIN_ID, style.replace(/{color}/, cfg.get("color") as string));

  // get the module
  let mod = (await webpack.waitForModule(webpack.filters.bySource('"BADGES"'))) as any;

  // inject the code
  injector.after(mod, "default", (args, res: React.ReactElement) => {
    let args2 = args[0] as ArgsType;
    const { author } = args2.message;

    // if the author_createdAt is enabled, use the author's account creation timestamp instead of the message's timestamp
    const date = cfg.get("authorCreatedAt")
      ? author.createdAt.toISOString()
      : args2.message.timestamp.toISOString();

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

    // position of the tag can't be changed anymore to be before the username
    res?.props?.children[3]?.props?.children?.splice(cfg.get("tagPosition"), 0, tag);

    // return the modified element
    return res;
  });
}

export function stop(): void {
  // uninject the code
  injector.uninjectAll();
  // remove the style
  removeStyle(PLUGIN_ID);
}
