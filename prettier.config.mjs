/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  importOrder: [
    "^(react|next?/?([a-zA-Z/]*))$",
    "<THIRD_PARTY_MODULES>",
    "^@/(.*)$",
    "^@/util/(.*)$",
    "^@/lib/(.*)$",
    "^@/db/(.*)$",
    "^@/styles/(.*)$",
    "^@/data-access/(.*)$",
    "^@/use-cases/(.*)$",
    "^@/providers/(.*)$",
    "^@/hooks/(.*)$",
    "^@/emails/(.*)$",
    "^@/components/(.*)$",
    "^@/app/(.*)$",
    "^[./]",
  ],
  tabWidth: 2,
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

export default config;
