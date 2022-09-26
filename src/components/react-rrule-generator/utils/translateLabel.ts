const replacePlaceholder = (
  text: string,
  replacements: { [key: string]: any } = {}
) => {
  let localText = text;

  Object.keys(replacements).forEach(
    (key) => (localText = localText.replace(`%{${key}}`, replacements[key]))
  );

  return localText;
};

const getObjectValue = (
  o: { [key: string]: any },
  path: string,
  errorMessage: string
): any => {
  let localObj = o;

  try {
    path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    path = path.replace(/^\./, ''); // strip a leading dot
    const keys = path.split('.');
    keys.forEach((val) => {
      if (val in localObj) {
        localObj = localObj[val];
      } else {
        return;
      }
    });
    return localObj;
  } catch (error) {
    throw new Error(errorMessage);
  }
};

const translateLabel = (
  translations: ((key: string, replacements: any) => any) | object,
  key: string,
  replacements = {}
) => {
  if (typeof translations === 'function') {
    return translations(key, replacements);
  } else if (typeof translations === 'object') {

    const value = getObjectValue(translations, key, `[translation missing '${key}']`);
    if(typeof value !== 'string') throw new Error('returned translation value not of type string');

    return replacePlaceholder(
      value, 
      replacements
    );
  }

  return null;
};

export default translateLabel;
