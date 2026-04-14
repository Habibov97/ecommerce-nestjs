export const mapTranslation = (item) => {
  return {
    ...item,
    translations: undefined,
    ...Object.fromEntries(item.translations.map((t) => [t.field, t.value])),
  };
};
