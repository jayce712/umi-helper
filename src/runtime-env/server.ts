module.exports = (html, opts) => {
  const {
    PUBLIC_RUNTIME_CONFIG_KEY,
    PUBLIC_RUNTIME_CONFIG,
  }=opts;
  return html.replace(
    `{{${PUBLIC_RUNTIME_CONFIG_KEY}}}`,
    JSON.stringify(PUBLIC_RUNTIME_CONFIG),
  );
};
