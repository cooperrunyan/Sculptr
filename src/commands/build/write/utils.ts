export const enc = (str: string) => new TextEncoder().encode(str);

export const clearLastLine = () => {
  return Deno.stdout.write(enc('\x1b[A\x1b[K')); // clears from cursor to line end
};
