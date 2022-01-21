export const scripts = ['javascript', 'typescript'] as const;
export const styles = ['scss', 'sass', 'css'] as const;
export const platforms = ['next', 'react'] as const;
export const licenses = [
  {
    name: 'afl-3.0',
    accessor: /academic|afl(\s|\-|)(v|)(\d|)(\.|)(\d|)(\w|\s|\d|)+/gi,
  },
  {
    name: 'apache-2.0',
    accessor: /apache(\s|-|)(license(\s|)|)/gi,
  },
  { name: 'artistic-2.0', accessor: /artistic(\s|-|)(license(\s|)|)/gi },
  { name: 'bsl-1.0', accessor: /bsl|Boost(\s|-|)(license|software(\s|)|)(license|)/gi },
  { name: 'bsd-2-clause', accessor: /bsd(.|-|)2/gi },
  { name: 'bsd-3-clause', accessor: /bsd(.|-|)3/gi },
  { name: 'cc0-1.0', accessor: /(cc|(Cre\w+(\s|)(Com\w+|)))(0|)(\s|-|)(\w+|)(\s|-|)(v|)1/gi },
  { name: 'cc-by-sa-4.0', accessor: /(cc|(Cre\w+(\s|)(Com\w+|)))(\s|-|)(Att\w+|by(\s|-|))(\s|-|)(sa|Share(\s|-|)(Alike|))/gi },
  { name: 'cc-by-4.0', accessor: /(cc|(Cre\w+(\s|)(Com\w+|)))(\s|-|)(Att\w+(\s|-|))/gi },
  { name: 'wtfpl', accessor: /wtf|(f\w\w\w)|wtfpl|what|want/gi },
  { name: 'ecl-2.0', accessor: /(ecl|(Ed\w+)(\s|-|)(Com\w+|Li\w+)(\s|-|)(Li\w+|))(\s|-|)(v|)2/gi },
  { name: 'epl-1.0', accessor: /(epl|(Eclipse(\s|-|)(Pu\w+|Li\w+)))(\s|-|)(Li\w+|)(\s|-|)1/gi },
  { name: 'epl-2.0', accessor: /(epl|(Eclipse(\s|-|)(Pu\w+|Li\w+)))(\s|-|)(Li\w+|)(\s|-|)2/gi },
  { name: 'eupl-1.1', accessor: /(eupl|(((E|Eur\w+)(\s|-|)(U|Un\w+)))(\s|-|)((pu\w+)|(li\w+))(\s|-|)(li\w+|))(\s|-|)1/gi },
  { name: 'agpl-3.0', accessor: /agpl|Affero/gi },
  { name: 'gpl-2.0', accessor: /(gpl(\s|-|)2)|(GNU.+2)|((Ge\w+).+2)/gi },
  { name: 'gpl-3.0', accessor: /(gpl(\s|-|)3)|(GNU.+3)|((Ge\w+).+3)/gi },
  { name: 'lgpl-2.1', accessor: /(lgpl(\s|-|)2)|(GNU(\s|-|)Les\w+.+2)|(Les\w+(\s|-|)Ge\w+.+2)/gi },
  { name: 'lgpl-3.0', accessor: /lgpl(\s|-|)3|(GNU(\s|-|)Les\w+.+3)|(Les\w+(\s|-|)Ge\w+.+3)/gi },
  { name: 'isc', accessor: /isc/gi },
  { name: 'lppl-1.3c', accessor: /lppl|(latex)/gi },
  { name: 'ms-pl', accessor: /ms-pl|Microsoft/gi },
  { name: 'mit', accessor: /mit/gi },
  { name: 'mpl-2.0', accessor: /mpl|Mozilla/gi },
  { name: 'osl-3.0', accessor: /osl|(Open(\s|-|)s)/gi },
  { name: 'postgresql', accessor: /post\w+/gi },
  { name: 'ofl-1.1', accessor: /ofl|(Open(\s|-|)f)/gi },
  { name: 'ncsa', accessor: /ncsa/gi },
  { name: 'unlicense', accessor: /unlicense/gi },
  { name: 'zlib', accessor: /zlib/gi },
] as const;

type Configuration = {
  script: typeof scripts[number] | 'ASK';
  style: typeof styles[number] | 'ASK';
  platform: typeof platforms[number];
  license?: typeof licenses[number];
  strict: boolean;
};

export default Configuration;
