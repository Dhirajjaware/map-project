export const getJSON = async function (url) {
  try {
    const res = await fetch(url);
    const data = res.json();
    return data;
  } catch (err) {
    throw err;
  }
};
