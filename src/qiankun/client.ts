import {
  formatOptions,
  hasProtocol,
  createQiankunAppOption,
} from './helpers';
import { AppItem, Options } from './types';

export const createQiankunApps = (apps: AppItem[], opts: Options) => apps.map((item) => createQiankunAppOption(item, opts));

export const createMasterOption = (apps: AppItem[], opts: Options) => ({
  apps: createQiankunApps(apps, opts),
  sandbox: true,
})

export const createMasterRuntimeOption = (opts: Options) => {
  const { rewrite } = formatOptions(opts);

  const ALL_SCRIPT_REGEX = /(<script[\s\S]*?>)[\s\S]*?<\/script>/gi;
  const SCRIPT_SRC_REGEX = /.*\ssrc=('|")?([^>'"\s]+)/;

  const LINK_TAG_REGEX = /<(link)\s+.*?>/isg;
  const LINK_HREF_REGEX = /.*\shref=('|")?([^>'"\s]+)/;

  return {
    getTemplate(tpl) {
      const res = tpl
      .replace(ALL_SCRIPT_REGEX, (match, scriptTag) => {
        const matchedScriptSrcMatch = scriptTag.match(SCRIPT_SRC_REGEX);
        const matchedScriptSrc =
          matchedScriptSrcMatch && matchedScriptSrcMatch[2];
        if (matchedScriptSrc && !hasProtocol(matchedScriptSrc)) {
          return match.replace(
            matchedScriptSrc,
            `${rewrite}${matchedScriptSrc}`,
          );
        }
        return match;
      })
      .replace(LINK_TAG_REGEX,(match)=>{
        const matchedLinkHrefMatch= match.match(LINK_HREF_REGEX);
        const matchedLinkHref =
        matchedLinkHrefMatch && matchedLinkHrefMatch[2];
        if(matchedLinkHref && !hasProtocol(matchedLinkHref)){
          return match.replace(
            matchedLinkHref,
            `${rewrite}${matchedLinkHref}`,
          );
        }
        return match;
      });

      return res;
    },
  };
};
