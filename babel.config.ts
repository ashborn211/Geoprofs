export default function (api: any) {
  api.cache(true);

  return {
    presets: [
      'next/babel', // Use Next.js's built-in Babel config
    ],
    plugins: [
      ["@babel/plugin-syntax-import-assertions", { "disabled": true }] // Disable importAssertions if needed
    ],
  };
}
