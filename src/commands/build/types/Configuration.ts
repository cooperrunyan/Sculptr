export const scripts = ['javascript', 'typescript'] as const;
export const styles = ['scss', 'sass', 'css'] as const;
export const platforms = ['next', 'react'] as const;

type Configuration = {
  script: typeof scripts[number] | 'ASK';
  style: typeof styles[number] | 'ASK';
  platform: typeof platforms[number];
  strict: boolean;
};

export default Configuration;
